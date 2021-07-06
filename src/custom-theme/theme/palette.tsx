import color from 'color';

// SAP Colors
const colorBrand = '#0a6ed1';
const colorSuccess = '#16ab54';
const colorWarning = '#FB8C00';
const colorError = '#ee0000';
const colorPrimary = '#0a6ed1';
const colorDisabled = '#E7E7E7';

const darkLightRatio = 0.4;

export default {
  primary: colorBrand,
  primaryLight: color(colorBrand).lighten(darkLightRatio).hex(),
  primaryDark: color(colorBrand).darken(darkLightRatio).hex(),

  info: colorPrimary,
  infoLight: color(colorPrimary).lighten(darkLightRatio).hex(),
  infoDark: color(colorPrimary).darken(darkLightRatio).hex(),

  success: colorSuccess,
  successLight: color(colorSuccess).lighten(darkLightRatio).hex(),
  successDark: color(colorSuccess).darken(darkLightRatio).hex(),

  danger: colorError,
  dangerLight: color(colorError).lighten(darkLightRatio).hex(),
  dangerDark: color(colorError).darken(darkLightRatio).hex(),

  warning: colorWarning,
  warningLight: color(colorWarning).lighten(darkLightRatio).hex(),
  warningDark: color(colorWarning).darken(darkLightRatio).hex(),

  disabled: colorDisabled,
  disabledLight: color(colorDisabled).lighten(darkLightRatio).hex(),
  disabledDark: color(colorDisabled).darken(darkLightRatio).hex(),

  dark: '#000000',
  darkLight: '#333333',

  light: '#FFFFFF',
  lightDark: '#CCCCCC'
};
