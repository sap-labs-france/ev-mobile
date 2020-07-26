import color from 'color';
import ThemeDefinition from 'types/Theme';
import ThemeManager from './ThemeManager';

// SAP Colors
const colorBrand = '#0a6ed1';
const colorSuccess = '#16ab54';
const colorWarning = '#FB8C00';
const colorError = '#ee0000';
const colorPrimary = '#0a6ed1';
const colorDisabled ='#E7E7E7';

const darkLightRatio = 0.4;

const primary = colorBrand;
const primaryLight = color(primary).lighten(darkLightRatio).hex();
const primaryDark = color(primary).darken(darkLightRatio).hex();
const info = colorPrimary;
const infoLight = color(info).lighten(darkLightRatio).hex();
const infoDark = color(info).darken(darkLightRatio).hex();
const success = colorSuccess;
const successLight = color(success).lighten(darkLightRatio).hex();
const successDark = color(success).darken(darkLightRatio).hex();
const danger = colorError;
const dangerLight = color(danger).lighten(darkLightRatio).hex();
const dangerDark = color(danger).darken(darkLightRatio).hex();
const warning = colorWarning;
const warningLight = color(warning).lighten(darkLightRatio).hex();
const warningDark = color(warning).darken(darkLightRatio).hex();
const disabled = colorDisabled;
const disabledLight = color(disabled).lighten(darkLightRatio).hex();
const disabledDark = color(disabled).darken(darkLightRatio).hex();
const dark = '#333';
const light = '#f4f4f4';

// Dark theme
const darkTheme: ThemeDefinition = {
  backgroundHeader: dark,
  background: dark,
  borderColor: light,
  textColor: light,
  placeholderTextColor: dark,
  inverseTextColor: dark,
  subTextColor: disabledDark,
  buttonBg: disabledDark,
  success: successLight,
  warning: warningLight,
  danger: dangerLight,
  info: infoLight,
  primary: primaryLight,
  disabled: disabledLight,
};

// Light theme
const lightTheme: ThemeDefinition = {
  backgroundHeader: light,
  background: disabled,
  borderColor: dark,
  textColor: primaryDark,
  placeholderTextColor: disabledDark,
  inverseTextColor: light,
  subTextColor: disabledLight,
  buttonBg: disabledLight,
  success: successDark,
  warning: warningDark,
  danger: dangerDark,
  info: infoDark,
  primary: primaryDark,
  disabled: disabledDark,
};

const getCurrentTheme = (): ThemeDefinition => {
  const darkThemeEnabled = ThemeManager.getInstance().isThemeTypeIsDark();
  if (darkThemeEnabled) {
    return darkTheme;
  }
  return lightTheme;
}

const customCommonColors = {
  brandPrimary: getCurrentTheme().primary,
  brandInfo: getCurrentTheme().info,
  brandSuccess: getCurrentTheme().success,
  brandDanger: getCurrentTheme().danger,
  brandWarning: getCurrentTheme().warning,
  brandPrimaryLight: primaryLight,
  brandPrimaryDark: primaryDark,
  brandInfoLight: infoLight,
  brandInfoDark: infoDark,
  brandSuccessLight: successLight,
  brandSuccessDark: successDark,
  brandDangerLight: dangerLight,
  brandDangerDark: dangerDark,
  brandWarningLight: warningLight,
  brandWarningDark: warningDark,
  brandDisabled: disabled,
  brandDisabledLight: disabledLight,
  brandDisabledDark: disabledDark,
  brandBackground: getCurrentTheme().background,
  brandDark: getCurrentTheme().buttonBg,
  brandLight: light,

  containerBgColor: getCurrentTheme().background,
  textColor: getCurrentTheme().textColor,
  buttonBg: getCurrentTheme().buttonBg,
};

export default customCommonColors;
