import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const platform = themeColor.platform;

  const tabHeadingTheme = {
    flexDirection: 'row',
    backgroundColor: themeColor.tabDefaultBg,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: platform === PLATFORM.ANDROID ? 5 : 0,
    '.scrollable': {
      paddingHorizontal: 20,
      flex: platform === PLATFORM.ANDROID ? 0 : 1,
      minWidth: platform === PLATFORM.ANDROID ? undefined : 60
    },
    'NativeBase.Text': {
      color: themeColor.topTabBarTextColor,
      marginHorizontal: 7,
      marginTop: -5
    },
    'NativeBase.Icon': {
      color: themeColor.topTabBarTextColor,
      fontSize: platform === PLATFORM.IOS ? 26 : undefined
    },
    '.active': {
      'NativeBase.Text': {
        color: themeColor.topTabBarActiveTextColor,
        fontWeight: '600',
        marginTop: -5
      },
      'NativeBase.Icon': {
        color: themeColor.topTabBarActiveTextColor
      }
    }
  };

  return tabHeadingTheme;
};
