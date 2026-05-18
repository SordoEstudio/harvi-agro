1. Identidad y rol de los colores
Token (CSS)	HEX	Uso en este sitio
--harvi-dark	#203143	Texto principal, títulos, iconos sobre acento, enlaces “marca”. Sustituye al negro.
--harvi-green-dark	#103d20	Solo fondos (p. ej. footer); hovers oscuros (hover:text-[#103d20]).
--harvi-green-lime	#cbdf4a	Acentos, bordes de tarjetas, CTAs rellenos, iconos circulares, hover en nav.
--harvi-blue-light	#c5daf3	Decoración suave, texto secundario en footer sobre verde oscuro.
--harvi-grey	#f7f7f7	Fondos de sección, relleno de CTAs secundarios, interior de cards.
Derivados para atmósfera (esferas / degradados): definidos en app/globals.css con color-mix sobre lima, celeste y verde oscuro (--harvi-sphere-lime-soft, --harvi-sphere-celeste-soft, etc.). En otro stack puedes replicar mezclando ~20–36 % del color base con blanco.

Texto secundario en UI: además de #203143 con opacidad (/80, /90), a veces se usa text-gray-600 / text-gray-700 para párrafos de apoyo.

Implementación recomendada en el otro proyecto: mismas variables CSS en :root y nombres estables (--color-text, --color-accent, etc.) mapeados a estos HEX.

2. Tipografía
Familia: Public Sans (en Next: next/font/google, subset latin).
Cuerpo: antialiased, sin serif.
Jerarquía típica:
H2 de sección: text-4xl md:text-5xl, font-bold, text-balance, color #203143.
H1 hero: text-[clamp(1.6rem,4vw,3.1rem)], font-bold, leading-[1.12], text-balance.
Subtítulos / lead: text-lg md:text-xl, leading-relaxed, text-balance.
Énfasis en navegación: font-bold text-sm con transición de color.
3. Layout y contenedores
Ancho máximo habitual: max-w-6xl o max-w-5xl según sección, centrado con mx-auto.
Padding horizontal: px-4 en casi todas las secciones.
Padding vertical de bloque: py-20 md:py-28 (ritmo uniforme entre secciones).
Scroll con ancla: scroll-mt-[72px] donde hace falta compensar navbar fija (~72 px de alto con logo).
HTML: lang="es", scroll-smooth en <html>.
4. Patrones de componente (para replicar “la misma cara”)
Navbar

Fondo blanco, shadow-sm, fixed top-0 z-40.
Enlaces: #203143 → hover #cbdf4a, transition.
Tarjetas / bloques elevados

rounded-2xl, border border-[#cbdf4a], fondo #f7f7f7 o white, shadow-md.
Hover: hover:scale-[1.05] o [1.02] en listas, hover:shadow-xl, duration-300 ease-out.
Medallones / avatares: círculo con bg-[#cbdf4a], texto/icono #203143, shadow-md ring-4 ring-white (o border-4 border-[#cbdf4a] en casos de logo).
CTAs (botones enlaces)

Primario: fondo y borde #cbdf4a, texto #203143, rounded-2xl, px-8 py-4, font-bold, shadow-md, mismo hover de escala/sombra.
Secundario: fondo #f7f7f7, borde lima, texto azul oscuro.
Formularios

Inputs: rounded-2xl, borde #d4d4d4, texto #0f1a26, focus ring-2 ring-[#cbdf4a], focus:border-transparent.
Labels: text-sm font-medium text-[#203143].
Footer

Fondo #103D20, borde superior ligeramente más oscuro (#0a2815), texto #c5daf3, tamaño pequeño.
FAB WhatsApp

Círculo 4.25rem, lima, icono/texto oscuro, ring-4 ring-white, mismas transiciones que CTAs.
5. Hero y atmósfera visual
Fondo: degradado suave gris claro (from #f7f7f7 vía #fafafa a #f3f3f3).
Capa “vidrio” clara encima: blanco ~40 % opacidad, blur(10px), borde blanco semitransparente (no usar la clase .glass-effect oscura del mismo archivo para ese bloque; el hero usa la variante clara inline).
Esferas: círculos grandes, blur-3xl, opacidades bajas (~0.09–0.14), colores de los tokens y derivados, animaciones animate-float-* (duraciones 8–20 s, ease-in-out, infinite).
Clase .glass-effect en globals.css (versión oscura): rgba(255,255,255,0.05), blur 10px, borde rgba(255,255,255,0.1) — útil sobre fondos oscuros si extiendes el sistema.

6. Animación y microinteracción
Flotación decorativa: keyframes float-slow (8s), float-medium (10s), float-fast (12s), float-extra (14s), más float-drift, float-drift-reverse, float-pulse-wide.
Indicador scroll (chevron): animate-scroll-hint (~3.2s).
Transiciones UI: transition o transition-all duration-300 ease-out en hovers de tarjetas y botones.
7. Bordes, sombras y detalle
Radio principal: rounded-2xl en superficies grandes; rounded-md en componentes shadcn genéricos si coexisten.
Sombras: shadow-sm (nav), shadow-md (cards/botones), shadow-xl en hover; a veces drop-shadow-xl en logo hero.
Énfasis en enlaces de texto: subrayado con decoration-[#cbdf4a] decoration-2 underline-offset-4.
8. Iconografía
Lucide React en secciones de producto (pasos, formulario, menú).
react-icons (FaWhatsapp) en el botón flotante.
Trazo habitual ~2–2.5 en iconos destacados.
9. Contenido y voz (marca)
Del manual: Harvi Digital como guía/aliado; mensaje simple frente a lo técnico; paleta y Public Sans son obligatorios en piezas oficiales. Para alineación verbal, conviene enlazar el mismo tono que ya definís en el manual (B2C claro vs Harvestech B2B).

10. CMS (este repositorio)

- Los mismos tokens viven en `src/app/globals.css` como `--harvi-dark`, `--harvi-green-lime`, etc., mapeados a utilidades Tailwind `harvi-*` (`@theme inline`).
- Navbar del panel: patrón web (fondo blanco, `shadow-sm`, enlaces `#203143` → hover lima, `duration-300 ease-out`).
- Toggle de tema: iconografía **Lucide** (`Sun` / `Moon`), trazo ~2.25, coherente con el punto 8.
- CTAs del shell: variantes de botón `harvi` / `harviSoft` alineadas a primario (lima + bold) y secundario (gris `#f7f7f7` + borde lima).

11. Nota técnica para tu otro repo
Los tokens de marca viven en app/globals.css; en componentes a menudo se repiten HEX literales (#203143, #cbdf4a, …). Para consistencia, en el proyecto nuevo es mejor centralizar (variables o tema) y no duplicar hex sueltos.
El proyecto incluye tokens shadcn en styles/globals.css (--background, --primary, etc.); la landing visible prioriza la paleta Harvi anterior, no el tema HSL por defecto del boilerplate.
En layout.tsx aparece text-harvi-dark; en tailwind.config.ts no está extendido harvi — si en build no genera esa clase, el color por defecto del body puede no ser el esperado. En el otro proyecto mapeá explícitamente o usá color: var(--harvi-dark) en el body.

12. Checklist rápido para alinear el otro sitio
Mismos 5 HEX + variables derivadas de esferas si usás ese estilo.
Public Sans + jerarquía de tamaños/pesos similar.
Contenedor max-w-5xl / 6xl, px-4, py-20 / md:py-28.
Cards: rounded-2xl, borde lima, gris claro o blanco, sombra + hover escala.
CTAs: lima + texto oscuro; secundario gris #f7f7f7.
Footer verde oscuro + texto celeste claro.
Focus accesible en formularios (anillo lima).
Animaciones suaves y largas solo en decoración, no en contenido crítico.