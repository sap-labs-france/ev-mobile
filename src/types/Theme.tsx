export enum ThemeType {
  DARK = 'dark',
  LIGHT = 'light'
}

export default interface ThemeDefinition {
  backgroundHeader: string;
  background: string;
  listBackgroundHeader: string;
  listItemSelected: string;
  borderColor: string;
  textColor: string;
  placeholderTextColor: string;
  inverseTextColor: string;
  subTextColor: string;
  buttonBg: string;
  success: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  danger: string;
  dangerLight: string;
  info: string;
  primary: string;
  light: string;
  primaryDark: string;
  primaryLight: string;
  lightDark: string;
  disabled: string;
  disabledLight: string;
  disabledDark: string;
  touchableBackgroundColor: string;
  modalBackgroundColor: string;
  selectFieldBackgroundColor: string;
  selectDropdownBackgroundColor: string;
  listItemBackground: string;
  listHeaderBackground: string;
  mapClusterBorder: string;
}
