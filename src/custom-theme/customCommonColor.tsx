import { Platform } from 'react-native';

import commonColor, { PLATFORM } from '../theme/variables/commonColor';
import ThemeManager from './ThemeManager';

const themeManager = ThemeManager.getInstance();
const currentTheme = themeManager.getCurrentThemeDefinition();

const customCommonColor = {
  ...commonColor,

  primary: currentTheme.primary,
  brandPrimary: themeManager.primary,
  brandPrimaryLight: themeManager.primaryLight,
  brandPrimaryDark: themeManager.primaryDark,

  info: currentTheme.info,
  brandInfo: themeManager.info,
  brandInfoLight: themeManager.infoLight,
  brandInfoDark: themeManager.infoDark,

  success: currentTheme.success,
  brandSuccess: themeManager.success,
  brandSuccessLight: themeManager.successLight,
  brandSuccessDark: themeManager.successDark,

  danger: currentTheme.danger,
  brandDanger: themeManager.danger,
  brandDangerLight: themeManager.dangerLight,
  brandDangerDark: themeManager.dangerDark,

  warning: currentTheme.warning,
  brandWarning: themeManager.warning,
  brandWarningLight: themeManager.warningLight,
  brandWarningDark: themeManager.warningDark,

  disabled: currentTheme.disabled,
  brandDisabled: themeManager.disabled,
  brandDisabledLight: themeManager.disabledLight,
  brandDisabledDark: themeManager.disabledDark,

  brandBackground: currentTheme.background,

  brandDark: themeManager.dark,
  brandLight: themeManager.light,

  containerBgColor: currentTheme.background,
  listHeaderBgColor: currentTheme.listBackgroundHeader,
  headerBgColor: currentTheme.backgroundHeader,
  headerTextColor: currentTheme.textColor,
  textColor: currentTheme.textColor,
  buttonBg: currentTheme.buttonBg,
  subTextColor: currentTheme.subTextColor,
  placeholderTextColor: currentTheme.placeholderTextColor,

  topTabBarActiveTextColor: currentTheme.textColor,

  CheckboxIconMarginTop: Platform.OS === PLATFORM.IOS ? 3 : 1,
  CheckboxPaddingLeft: Platform.OS === PLATFORM.IOS ? 0 : 0,
  checkboxSize: 23,

  borderRadiusBase: 0,
  checkboxTickColor: currentTheme.textColor,

  buttonDangerBg: currentTheme.danger,
  buttonWarningBg: currentTheme.warning,
  buttonInfoBg: currentTheme.info,
  buttonSuccessBg: currentTheme.success,
  buttonDisabledBg: themeManager.disabledDark,
};

export default customCommonColor;
