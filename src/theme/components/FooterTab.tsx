import { Platform } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const platform = themeColor.platform;

  const footerTabTheme: any = {
    'NativeBase.Button': {
      '.active': {
        'NativeBase.Text': {
          color: themeColor.tabBarActiveTextColor,
          fontSize: themeColor.tabBarTextSize,
          lineHeight: 16
        },
        'NativeBase.Icon': {
          color: themeColor.tabBarActiveTextColor
        },
        'NativeBase.IconNB': {
          color: themeColor.tabBarActiveTextColor
        },
        backgroundColor: themeColor.tabActiveBgColor
      },
      flexDirection: null,
      backgroundColor: 'transparent',
      borderColor: null,
      elevation: 0,
      shadowColor: null,
      shadowOffset: null,
      shadowRadius: null,
      shadowOpacity: null,
      alignSelf: 'center',
      flex: 1,
      height: themeColor.footerHeight,
      justifyContent: 'center',
      '.badge': {
        'NativeBase.Badge': {
          'NativeBase.Text': {
            fontSize: 11,
            fontWeight: platform === PLATFORM.IOS ? '600' : undefined,
            lineHeight: 14
          },
          top: -3,
          alignSelf: 'center',
          left: 10,
          zIndex: 99,
          height: 18,
          padding: 1.7,
          paddingHorizontal: 3
        },
        'NativeBase.Icon': {
          marginTop: -18
        }
      },
      'NativeBase.Icon': {
        color: themeColor.tabBarTextColor
      },
      'NativeBase.IconNB': {
        color: themeColor.tabBarTextColor
      },
      'NativeBase.Text': {
        color: themeColor.tabBarTextColor,
        fontSize: themeColor.tabBarTextSize,
        lineHeight: 16
      }
    },
    backgroundColor: Platform.OS === PLATFORM.ANDROID ? themeColor.footerDefaultBg : undefined,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignSelf: 'stretch'
  };

  return footerTabTheme;
};
