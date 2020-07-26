import { scale } from 'react-native-size-matters';

import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const tabBarTheme: any = {
    '.tabIcon': {
      height: undefined
    },
    '.vertical': {
      height: 60
    },
    'NativeBase.Button': {
      '.transparent': {
        'NativeBase.Text': {
          fontSize: themeColor.tabFontSize,
          color: themeColor.sTabBarActiveTextColor,
          fontWeight: '400'
        },
        'NativeBase.IconNB': {
          color: themeColor.sTabBarActiveTextColor
        }
      },
      'NativeBase.IconNB': {
        color: themeColor.sTabBarActiveTextColor
      },
      'NativeBase.Text': {
        fontSize: themeColor.tabFontSize,
        color: themeColor.sTabBarActiveTextColor,
        fontWeight: '400'
      },
      '.isTabActive': {
        'NativeBase.Text': {
          fontWeight: '900'
        }
      },
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: null,
      borderBottomColor: 'transparent',
      backgroundColor: themeColor.tabBgColor
    },
    height: scale(50),
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#ccc',
    backgroundColor: themeColor.tabBgColor
  };

  return tabBarTheme;
};
