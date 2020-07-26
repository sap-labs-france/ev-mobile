import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const iconCommon = {
    'NativeBase.Icon': {
      color: themeColor.tabBarActiveTextColor
    }
  };
  const iconNBCommon = {
    'NativeBase.IconNB': {
      color: themeColor.tabBarActiveTextColor
    }
  };
  const textCommon = {
    'NativeBase.Text': {
      color: themeColor.tabBarActiveTextColor
    }
  };
  const footerTheme: any = {
    'NativeBase.Left': {
      'NativeBase.Button': {
        '.transparent': {
          backgroundColor: 'transparent',
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null,
          ...iconCommon,
          ...iconNBCommon,
          ...textCommon
        },
        alignSelf: null,
        ...iconCommon,
        ...iconNBCommon
        // ...textCommon
      },
      flex: 1,
      alignSelf: 'center',
      alignItems: 'flex-start'
    },
    'NativeBase.Body': {
      flex: 1,
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row',
      'NativeBase.Button': {
        alignSelf: 'center',
        '.transparent': {
          backgroundColor: 'transparent',
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null,
          ...iconCommon,
          ...iconNBCommon,
          ...textCommon
        },
        '.full': {
          height: themeColor.footerHeight,
          paddingBottom: themeColor.footerPaddingBottom,
          flex: 1
        },
        ...iconCommon,
        ...iconNBCommon
        // ...textCommon
      }
    },
    'NativeBase.Right': {
      'NativeBase.Button': {
        '.transparent': {
          backgroundColor: 'transparent',
          borderColor: null,
          elevation: 0,
          shadowColor: null,
          shadowOffset: null,
          shadowRadius: null,
          shadowOpacity: null,
          ...iconCommon,
          ...iconNBCommon,
          ...textCommon
        },
        alignSelf: null,
        ...iconCommon,
        ...iconNBCommon
        // ...textCommon
      },
      flex: 1,
      alignSelf: 'center',
      alignItems: 'flex-end'
    },
    backgroundColor: themeColor.footerDefaultBg,
    flexDirection: 'row',
    justifyContent: 'center',
    height: themeColor.footerHeight,
    paddingBottom: themeColor.footerPaddingBottom,
    elevation: 3,
    left: 0,
    right: 0
  };
  return footerTheme;
};
