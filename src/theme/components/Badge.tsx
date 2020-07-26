import { moderateScale, scale } from 'react-native-size-matters';
import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const badgeTheme: any = {
    '.primary': {
      backgroundColor: themeColor.buttonPrimaryBg
    },
    '.warning': {
      backgroundColor: themeColor.buttonWarningBg
    },
    '.info': {
      backgroundColor: themeColor.buttonInfoBg
    },
    '.success': {
      backgroundColor: themeColor.buttonSuccessBg
    },
    '.danger': {
      backgroundColor: themeColor.buttonDangerBg
    },
    'NativeBase.Text': {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      color: themeColor.badgeColor,
      fontSize: themeColor.fontSizeBase,
      lineHeight: themeColor.lineHeight - 5,
      textAlign: 'center',
      paddingTop: moderateScale(11, 4),
      paddingBottom: moderateScale(8),
      paddingHorizontal: 3
    },
    backgroundColor: themeColor.badgeBg,
    padding: themeColor.badgePadding,
    paddingHorizontal: 6,
    borderStyle: 'solid',
    borderColor: themeColor.textColor,
    borderWidth: scale(4),
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(44),
    height: scale(44)
  };
  return badgeTheme;
};
