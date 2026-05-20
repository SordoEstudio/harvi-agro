Eyebrow
Trabajemos juntos
Titular
¿Tenés un problema
en el campo que la
tecnología puede resolver?
Subtítulo
Si hay algo en tu operación que se hace a mano, que se pierde, 
que no se mide o que lleva más tiempo del que debería, 
contanos. Desarrollamos la herramienta que necesitás.
Formulario de contacto
Campos (igual estructura que harvi.digital):
Nombre            input text      obligatorio
Empresa / Campo   input text      opcional
Email             input email     obligatorio
¿Cuál es tu rol?  select          opcional
                    → Contratista de aplicación
                    → Agrónomo asesor
                    → Productor / empresa agropecuaria
                    → Cooperativa
                    → Otro
Contanos tu situación  textarea   obligatorio
                    placeholder: "¿Qué hacés hoy? ¿Qué problema querés resolver? 
                                  No hace falta que sea técnico, contanos con tus palabras."

[Enviar mensaje]
Debajo del formulario
O escribinos directo por WhatsApp →
wa.me/5493492635571?text=Hola Harvi Agro, tengo una consulta sobre un proyecto.
Nota de cierre
Respondemos en menos de 24 horas · Sin compromiso · En español

El select de rol no es casualidad — es el mismo dato de segmentación que capturamos en el registro de la app, y acá te llega antes de que sean usuarios. Cualquier lead del formulario ya viene etiquetado por segmento.


● Instalación form en harviagro.digital

  1. Lado CMS (admin)

  a) En admin CMS → cliente harvi → tab Dominios → agregar harviagro.digital (también www.harviagro.digital si aplica) con     isActive: true. Esto habilita CORS automáticamente (getDomainsForCors deriva base + www + *.dominio).

  b) En módulo Forms → crear formulario o reusar el existente (mismo slug sirve para múltiples sitios, el cliente es el mismo
   tenant). Confirmar:
  - status: 'published'
  - settings.store_submissions: true
  - settings.send_email_notification: true + email_to: ['...'] si querés mail

  c) Identificación del tenant viene del header Host. harviagro.digital debe matchear client.domains[] o se rechaza con 404. 

  2. Contrato API

  Base: https://micms.website/api/public/v1/forms/<slug>

  GET schema

  GET /api/public/v1/forms/contacto
  Host: harviagro.digital   (implícito desde browser)

  Respuesta:
  {
    "success": true,
    "data": {
      "_id": "...",
      "slug": "contacto",
      "name": { "es": "Contacto" },
      "description": { "es": "..." },
      "fields": [
        {
          "id": "nombre",
          "type": "text",
          "label": { "es": "Nombre" },
          "placeholder": { "es": "Tu nombre" },
          "required": true,
          "order": 1,
          "width": "full"
        }
        // ...
      ],
      "settings": { "success_message": { "es": "Gracias" } }
    }
  }

  POST submit

  POST /api/public/v1/forms/contacto/submit
  Content-Type: application/json

  Body:
  {
    "nombre": "Juan",
    "email": "j@x.com",
    "mensaje": "Hola",
    "_hp": "",        // honeypot, dejar vacío
    "locale": "es"    // opcional
  }

  Claves del body: deben ser field.id definidos en el form. Claves desconocidas se descartan.

  Respuestas:

  ┌────────┬─────────────────────────────────────────────────────────────────┐
  │ Status │                              Caso                               │
  ├────────┼─────────────────────────────────────────────────────────────────┤
  │ 201    │ OK — { success: true, data: { message: "..." } }                │
  ├────────┼─────────────────────────────────────────────────────────────────┤
  │ 403    │ store_submissions: false                                        │
  ├────────┼─────────────────────────────────────────────────────────────────┤
  │ 404    │ slug no existe o Host no matchea cliente                        │
  ├────────┼─────────────────────────────────────────────────────────────────┤
  │ 422    │ required faltantes — { details: ["El campo X es obligatorio"] } │
  ├────────┼─────────────────────────────────────────────────────────────────┤
  │ 429    │ rate limit (5/min por IP)                                       │
  ├────────┼─────────────────────────────────────────────────────────────────┤
  │ 500    │ error interno                                                   │
  └────────┴─────────────────────────────────────────────────────────────────┘

  Límites: 5 envíos/min/IP. Strings sanitizados (tags HTML eliminados).

  3. Snippet cliente

  <form id="frm">
    <input name="nombre" required />
    <input name="email" type="email" required />
    <textarea name="mensaje" required></textarea>
    <input name="_hp" style="display:none" tabindex="-1" autocomplete="off" />
    <button type="submit">Enviar</button>
  </form>

  <script>
  const API = 'https://micms.website/api/public/v1/forms/contacto/submit';

  document.getElementById('frm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = Object.fromEntries(fd.entries());
    payload.locale = document.documentElement.lang || 'es';

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Error');
      }
      alert(json.data.message);
      e.target.reset();
    } catch (err) {
      alert('No pudimos enviar. Probá de nuevo.');
    }
  });
  </script>

  Notas:
  - No mandar credentials: 'include' — endpoint público sin cookies.
  - Si querés generar el form dinámico desde el schema, hacer GET primero y mapear fields[] a inputs.
  - Bot: campo _hp oculto. Si bot lo llena, server responde 200 fake pero no guarda.

  4. Verificación post-deploy

  # Test preflight
  curl -i -X OPTIONS https://micms.website/api/public/v1/forms/contacto/submit \
    -H "Origin: https://harviagro.digital" \
    -H "Access-Control-Request-Method: POST"

  # Test submit (Host header simula sitio)
  curl -i -X POST https://micms.website/api/public/v1/forms/contacto/submit \
    -H "Content-Type: application/json" \
    -H "Origin: https://harviagro.digital" \
    -H "Host: harviagro.digital" \
    -d '{"nombre":"test","email":"t@t.com","mensaje":"ping","_hp":""}'

  Buscar Access-Control-Allow-Origin: https://harviagro.digital en respuesta. Si vuelve * o falta → dominio no está en       
  client.domains[].
