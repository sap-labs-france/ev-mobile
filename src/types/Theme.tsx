export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light',
}

export default interface ThemeDefinition {
  backgroundHeader: string;
  background: string;
  borderColor: string;
  textColor: string;
  placeholderTextColor: string;
  inverseTextColor: string;
  subTextColor: string;
  buttonBg: string;
  fontSize: number;
  fontSizeIconBase: number;
  success: string;
  warning: string;
  danger: string;
  info: string;
  primary: string;
  disabled: string;
}