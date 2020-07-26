import { Platform } from 'react-native';
import commonColor, { PLATFORM } from '../theme/variables/commonColor';
import ThemeManager from './ThemeManager';

const themeManager = ThemeManager.getInstance();
const currentTheme = themeManager.getCurrentThemeDefinition();

const customPlatform = {
  CheckboxIconMarginTop: Platform.OS === PLATFORM.IOS ? 3 : 1,
  CheckboxPaddingLeft: Platform.OS === PLATFORM.IOS ? 0 : 0,
  checkboxSize: 23,

  borderRadiusBase: 0,
  checkboxTickColor: currentTheme.textColor,

  buttonDangerBg: commonColor.danger,
  buttonWarningBg: commonColor.warning,
  buttonInfoBg: commonColor.info,
  buttonSuccessBg: commonColor.success,
  buttonDisabledBg: commonColor.brandDisabledDark,
};

export default customPlatform;
