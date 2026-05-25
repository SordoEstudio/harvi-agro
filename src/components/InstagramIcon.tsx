import { FaInstagram } from 'react-icons/fa';
import type { FC } from 'react';

interface Props {
  className?: string;
}

export const InstagramIcon: FC<Props> = ({ className }) => (
  <FaInstagram className={className} aria-hidden />
);
