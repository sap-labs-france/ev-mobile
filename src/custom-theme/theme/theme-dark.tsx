import palette from './palette';
import color from 'color';

// Dark theme
const dark = '#272727';
const darkLight = '#2c2c2c';
const light = '#FAF9F6'; // Off-white

// Desaturated primary colors
const success = color(palette.success).desaturate(0.2).hex();
const danger = color(palette.danger).desaturate(0.2).hex();
const dangerLight = color(palette.dangerLight).desaturate(0.2).hex();
const warning = color(palette.warning).desaturate(0.2).hex();
const warningLight = color(palette.warningLight).desaturate(0.2).hex();
const warningDark = color(palette.warningDark).desaturate(0.2).hex();
const primary = color(palette.primary).desaturate(0.2).hex();
const primaryDark = color(palette.primaryDark).desaturate(0.2).hex();
const primaryLight = color(palette.primaryLight).desaturate(0.2).hex();
const info = color(palette.info).desaturate(0.2).hex();
const infoLight = color(palette.infoLight).desaturate(0.2).hex();
const disabled = color(palette.disabled).desaturate(0.2).hex();
const disabledLight = color(palette.disabledLight).desaturate(0.2).hex();
const disabledDark = color(palette.disabledDark).desaturate(0.2).hex();
const lightDark = color(palette.lightDark).desaturate(0.2).hex();

export default {
  success: palette.success,
  warning,
  warningLight,
  warningDark,
  danger,
  light,
  info,
  infoLight,
  primaryDark,
  primaryLight,
  dangerLight,
  primary,
  disabled,
  disabledLight,
  disabledDark,
  darkLight,
  lightDark,
  backgroundHeader: dark,
  modalBackgroundColor: '#262626',
  listBackgroundHeader: '#383838',
  listItemSelected: '#1E1E1E',
  cardShadowColor: '#5c3074',
  background: dark,
  borderColor: light,
  textColor: light,
  placeholderTextColor: palette.disabledDark,
  inverseTextColor: dark,
  subTextColor: palette.disabledDark,
  buttonBg: darkLight,
  touchableBackgroundColor: 'rgba(255,255,255,0.1)',
  selectFieldBackgroundColor: '#1d1d1d',
  selectDropdownBackgroundColor: '#1d1d1d',
  listItemBackground: '#1d1d1d',
  listHeaderBackground: '#1d1d1d',
  mapClusterBorder: dark
};
