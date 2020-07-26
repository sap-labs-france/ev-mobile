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
const darkLight = color(dark).lighten(darkLightRatio).hex();

const light = '#f4f4f4';
const lightDark = color(dark).darken(darkLightRatio).hex();

// Dark theme
const darkTheme: ThemeDefinition = {
  success: successLight,
  warning: warningLight,
  danger: dangerLight,
  info: infoLight,
  primary: primaryLight,
  disabled: disabledLight,
  backgroundHeader: dark,
  listBackgroundHeader: darkLight,
  background: dark,
  borderColor: light,
  textColor: light,
  placeholderTextColor: disabledDark,
  inverseTextColor: dark,
  subTextColor: disabledDark,
  buttonBg: disabledDark,
};

// Light theme
const lightTheme: ThemeDefinition = {
  success: successDark,
  warning: warningDark,
  danger: dangerDark,
  info: infoDark,
  primary: primaryDark,
  disabled: disabledDark,
  backgroundHeader: light,
  listBackgroundHeader: lightDark,
  background: disabled,
  borderColor: dark,
  textColor: primaryDark,
  placeholderTextColor: disabledDark,
  inverseTextColor: light,
  subTextColor: disabledLight,
  buttonBg: disabledLight,
};

const getCurrentTheme = (): ThemeDefinition => {
  const darkThemeEnabled = ThemeManager.getInstance().isThemeTypeIsDark();
  if (darkThemeEnabled) {
    return darkTheme;
  }
  return lightTheme;
}

const customCommonColors = {
  primary: getCurrentTheme().primary,
  brandPrimary: primary,
  brandPrimaryLight: primaryLight,
  brandPrimaryDark: primaryDark,

  info: getCurrentTheme().info,
  brandInfo: info,
  brandInfoLight: infoLight,
  brandInfoDark: infoDark,

  success: getCurrentTheme().success,
  brandSuccess: success,
  brandSuccessLight: successLight,
  brandSuccessDark: successDark,

  danger: getCurrentTheme().danger,
  brandDanger: danger,
  brandDangerLight: dangerLight,
  brandDangerDark: dangerDark,

  warning: getCurrentTheme().warning,
  brandWarning: warning,
  brandWarningLight: warningLight,
  brandWarningDark: warningDark,

  disabled: getCurrentTheme().disabled,
  brandDisabled: disabled,
  brandDisabledLight: disabledLight,
  brandDisabledDark: disabledDark,

  brandBackground: getCurrentTheme().background,

  brandDark: getCurrentTheme().buttonBg,
  brandLight: light,

  containerBgColor: getCurrentTheme().background,
  listHeaderBgColor: getCurrentTheme().listBackgroundHeader,
  headerBgColor: getCurrentTheme().backgroundHeader,
  headerTextColor: getCurrentTheme().textColor,
  textColor: getCurrentTheme().textColor,
  buttonBg: getCurrentTheme().buttonBg,
  subTextColor: getCurrentTheme().subTextColor,
  placeholderTextColor: getCurrentTheme().placeholderTextColor,

  topTabBarActiveTextColor: getCurrentTheme().textColor,
};

export default customCommonColors;
