import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const inputGroupTheme: any = {
    'NativeBase.Icon': {
      fontSize: 24,
      color: themeColor.sTabBarActiveTextColor,
      paddingHorizontal: 5
    },
    'NativeBase.IconNB': {
      fontSize: 24,
      color: themeColor.sTabBarActiveTextColor,
      paddingHorizontal: 5
    },
    'NativeBase.Input': {
      height: themeColor.inputHeightBase,
      color: themeColor.inputColor,
      paddingLeft: 5,
      paddingRight: 5,
      flex: 1,
      fontSize: themeColor.inputFontSize,
      lineHeight: themeColor.inputLineHeight
    },
    '.underline': {
      '.success': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.error': {
        borderColor: themeColor.inputErrorBorderColor
      },
      paddingLeft: 5,
      borderWidth: themeColor.borderWidth,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderColor: themeColor.inputBorderColor
    },
    '.regular': {
      '.success': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.error': {
        borderColor: themeColor.inputErrorBorderColor
      },
      paddingLeft: 5,
      borderWidth: themeColor.borderWidth,
      borderColor: themeColor.inputBorderColor
    },
    '.rounded': {
      '.success': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.error': {
        borderColor: themeColor.inputErrorBorderColor
      },
      paddingLeft: 5,
      borderWidth: themeColor.borderWidth,
      borderRadius: themeColor.inputGroupRoundedBorderRadius,
      borderColor: themeColor.inputBorderColor
    },

    '.success': {
      'NativeBase.Icon': {
        color: themeColor.inputSuccessBorderColor
      },
      'NativeBase.IconNB': {
        color: themeColor.inputSuccessBorderColor
      },
      '.rounded': {
        borderRadius: 30,
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.regular': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.underline': {
        borderWidth: themeColor.borderWidth,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: themeColor.inputSuccessBorderColor
      },
      borderColor: themeColor.inputSuccessBorderColor
    },

    '.error': {
      'NativeBase.Icon': {
        color: themeColor.inputErrorBorderColor
      },
      'NativeBase.IconNB': {
        color: themeColor.inputErrorBorderColor
      },
      '.rounded': {
        borderRadius: 30,
        borderColor: themeColor.inputErrorBorderColor
      },
      '.regular': {
        borderColor: themeColor.inputErrorBorderColor
      },
      '.underline': {
        borderWidth: themeColor.borderWidth,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: themeColor.inputErrorBorderColor
      },
      borderColor: themeColor.inputErrorBorderColor
    },
    '.disabled': {
      'NativeBase.Icon': {
        color: '#384850'
      },
      'NativeBase.IconNB': {
        color: '#384850'
      }
    },

    paddingLeft: 5,
    borderWidth: themeColor.borderWidth,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: themeColor.inputBorderColor,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center'
  };

  return inputGroupTheme;
};
