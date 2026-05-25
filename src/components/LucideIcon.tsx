import type { LucideProps } from 'lucide-react';
import {
  AlertCircle,
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  Handshake,
  History,
  Layers,
  Lightbulb,
  Mail,
  Map,
  MessageCircle,
  Puzzle,
  Quote,
  Sprout,
  Target,
  Tractor,
  Upload,
} from 'lucide-react';
import type { FC } from 'react';

export const iconMap = {
  check: Check,
  target: Target,
  handshake: Handshake,
  'circle-alert': AlertCircle,
  map: Map,
  layers: Layers,
  compare: ArrowLeftRight,
  chart: BarChart3,
  pdf: FileText,
  history: History,
  tractor: Tractor,
  'clipboard-list': ClipboardList,
  sprout: Sprout,
  puzzle: Puzzle,
  'chevron-down': ChevronDown,
  'arrow-right': ArrowRight,
  'message-circle': MessageCircle,
  mail: Mail,
  lightbulb: Lightbulb,
  quote: Quote,
  upload: Upload,
} as const;

export type IconName = keyof typeof iconMap;

interface Props extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

export const LucideIcon: FC<Props> = ({
  name,
  size = 18,
  strokeWidth = 2.25,
  className,
  ...props
}) => {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden {...props} />;
};
