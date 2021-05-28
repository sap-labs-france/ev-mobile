import palette from './palette';
import commonColor from '../../theme/variables/commonColor';

// Dark theme
export default {
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
  primary: palette.primary,
  disabled: palette.disabled,
  backgroundHeader: palette.light,
  listBackgroundHeader: palette.disabled,
  background: palette.light,
  borderColor: palette.dark,
  textColor: palette.primaryDark,
  placeholderTextColor: palette.disabledDark,
  inverseTextColor: palette.light,
  subTextColor: palette.disabledDark,
  buttonBg: palette.disabled,
  listShadowedItemBackgroundColor: commonColor.containerBgColor,
  touchableBackgroundColor: 'rgba(0,0,0,0.4)'
};
