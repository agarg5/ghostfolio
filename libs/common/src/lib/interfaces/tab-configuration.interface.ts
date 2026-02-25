export interface TabConfiguration {
  iconName: string;
  label: string;
  routerLink?: string[];
  onClick?: () => void;
  showCondition?: boolean;
}
