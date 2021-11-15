import { Platform } from 'react-native';

import palette from '../custom-theme/theme/palette';
import commonColor, { PLATFORM } from '../theme/variables/commonColor';
import ThemeDefinition from '../types/Theme';
import ThemeManager from './ThemeManager';

export const buildCommonColor = (currentTheme: ThemeDefinition) => ({
  ...commonColor,
  light: currentTheme.light,

  primary: currentTheme.primary,
  brandPrimary: palette.primary,
  brandPrimaryLight: palette.primaryLight,
  primaryDark: currentTheme.primaryDark,
  primaryLight: currentTheme.primaryLight,

  yellow: '#FFBE59',
  purple: 'purple',

  mapClusterBorder: currentTheme.mapClusterBorder,

  info: currentTheme.info,
  brandInfo: palette.info,
  brandInfoLight: palette.infoLight,
  brandInfoDark: palette.infoDark,

  success: currentTheme.success,
  brandSuccess: currentTheme.success,
  brandSuccessLight: palette.successLight,
  brandSuccessDark: palette.successDark,

  danger: currentTheme.danger,
  dangerLight: currentTheme.dangerLight,
  brandDanger: palette.danger,
  brandDangerLight: palette.dangerLight,
  brandDangerDark: palette.dangerDark,

  warning: currentTheme.warning,
  warningLight: currentTheme.warningLight,
  warningDark: currentTheme.warningDark,
  brandWarning: palette.warning,
  brandWarningLight: palette.warningLight,
  brandWarningDark: palette.warningDark,

  disabled: currentTheme.disabled,
  disabledLight: currentTheme.disabledLight,
  disabledDark: currentTheme.disabledDark,
  brandDisabled: palette.disabled,
  brandDisabledLight: palette.disabledLight,
  brandDisabledDark: palette.disabledDark,

  brandBackground: currentTheme.background,

  brandDark: palette.dark,
  brandLight: palette.light,
  lightDark: currentTheme.lightDark,

  listBorderColor: palette.disabledDark,
  listItemSelected: currentTheme.listItemSelected,
  listItemBackground: currentTheme.listItemBackground,
  listHeaderBackground: currentTheme.listHeaderBackground,
  cardBorderColor: currentTheme.textColor,

  containerBgColor: currentTheme.background,
  containerTouchableBackgroundColor: currentTheme.touchableBackgroundColor,
  listHeaderBgColor: currentTheme.listBackgroundHeader,
  headerBgColor: currentTheme.backgroundHeader,
  headerTextColor: currentTheme.textColor,
  textColor: currentTheme.textColor,
  inverseTextColor: currentTheme.inverseTextColor,
  buttonBg: currentTheme.buttonBg,
  subTextColor: currentTheme.subTextColor,
  placeholderTextColor: currentTheme.placeholderTextColor,

  topTabBarActiveTextColor: currentTheme.textColor,

  CheckboxIconMarginTop: Platform.OS === PLATFORM.IOS ? 3 : 2,
  CheckboxPaddingLeft: Platform.OS === PLATFORM.IOS ? 0 : 2,
  checkboxSize: 23,
  checkboxTickColor: currentTheme.textColor,
  checkboxDefaultColor: 'transparent',

  borderRadiusBase: 0,

  buttonDangerBg: currentTheme.danger,
  buttonWarningBg: currentTheme.warning,
  buttonInfoBg: currentTheme.info,
  buttonSuccessBg: currentTheme.success,
  buttonDisabledBg: palette.disabledDark,

  // Modal style
  modalBackgroundColor: currentTheme.modalBackgroundColor,

  // Select dropdown
  selectFieldBackgroundColor: currentTheme.selectFieldBackgroundColor,
  selectDropdownBackgroundColor: currentTheme.selectDropdownBackgroundColor
});

const themeManager = ThemeManager.getInstance();
const currentThemeDef = themeManager.getCurrentThemeDefinition();

export default buildCommonColor(currentThemeDef);
