import { FaWhatsapp } from 'react-icons/fa';
import type { FC } from 'react';

interface Props {
  size?: number;
  className?: string;
}

export const WhatsAppIcon: FC<Props> = ({ size = 32, className }) => (
  <FaWhatsapp size={size} className={className} aria-hidden />
);
