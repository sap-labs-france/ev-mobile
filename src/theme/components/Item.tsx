import { Platform } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const itemTheme: any = {
    '.floatingLabel': {
      'NativeBase.Input': {
        height: 50,
        top: 8,
        paddingTop: 3,
        paddingBottom: 7,
        '.multiline': {
          minHeight: themeColor.inputHeightBase,
          paddingTop: Platform.OS === PLATFORM.IOS ? 10 : 3,
          paddingBottom: Platform.OS === PLATFORM.IOS ? 14 : 10
        }
      },
      'NativeBase.Label': {
        paddingTop: 5
      },
      'NativeBase.Icon': {
        top: 6,
        paddingTop: 8
      },
      'NativeBase.IconNB': {
        top: 6,
        paddingTop: 8
      }
    },
    '.fixedLabel': {
      'NativeBase.Label': {
        position: null,
        top: null,
        left: null,
        right: null,
        flex: 1,
        height: null,
        width: null,
        fontSize: themeColor.inputFontSize
      },
      'NativeBase.Input': {
        flex: 2,
        fontSize: themeColor.inputFontSize
      }
    },
    '.stackedLabel': {
      'NativeBase.Label': {
        position: null,
        top: null,
        left: null,
        right: null,
        paddingTop: 5,
        alignSelf: 'flex-start',
        fontSize: themeColor.inputFontSize - 2
      },
      'NativeBase.Icon': {
        marginTop: 36
      },
      'NativeBase.Input': {
        alignSelf: Platform.OS === PLATFORM.IOS ? 'stretch' : 'flex-start',
        flex: 1,
        width: Platform.OS === PLATFORM.IOS ? null : themeColor.deviceWidth - 25,
        fontSize: themeColor.inputFontSize,
        lineHeight: themeColor.inputLineHeight - 6,
        '.secureTextEntry': {
          fontSize: themeColor.inputFontSize - 4
        },
        '.multiline': {
          paddingTop: Platform.OS === PLATFORM.IOS ? 9 : undefined,
          paddingBottom: Platform.OS === PLATFORM.IOS ? 9 : undefined
        }
      },
      flexDirection: null,
      minHeight: themeColor.inputHeightBase + 15
    },
    '.inlineLabel': {
      'NativeBase.Label': {
        position: null,
        top: null,
        left: null,
        right: null,
        paddingRight: 20,
        height: null,
        width: null,
        fontSize: themeColor.inputFontSize
      },
      'NativeBase.Input': {
        paddingLeft: 5,
        fontSize: themeColor.inputFontSize
      },
      flexDirection: 'row'
    },
    'NativeBase.Label': {
      fontSize: themeColor.inputFontSize,
      color: themeColor.inputColorPlaceholder,
      paddingRight: 5
    },
    'NativeBase.Icon': {
      fontSize: 24,
      paddingRight: 8
    },
    'NativeBase.IconNB': {
      fontSize: 24,
      paddingRight: 8
    },
    'NativeBase.Input': {
      '.multiline': {
        height: null
      },
      height: themeColor.inputHeightBase,
      color: themeColor.inputColor,
      flex: 1,
      top: Platform.OS === PLATFORM.IOS ? 1.5 : undefined,
      fontSize: themeColor.inputFontSize
    },
    '.underline': {
      'NativeBase.Input': {
        paddingLeft: 15
      },
      '.success': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.error': {
        borderColor: themeColor.inputErrorBorderColor
      },
      borderWidth: themeColor.borderWidth * 2,
      borderTopWidth: 0,
      borderRightWidth: 0,
      borderLeftWidth: 0,
      borderColor: themeColor.inputBorderColor
    },
    '.regular': {
      'NativeBase.Input': {
        paddingLeft: 8
      },
      'NativeBase.Icon': {
        paddingLeft: 10
      },
      '.success': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.error': {
        borderColor: themeColor.inputErrorBorderColor
      },
      borderWidth: themeColor.borderWidth * 2,
      borderColor: themeColor.inputBorderColor
    },
    '.rounded': {
      'NativeBase.Input': {
        paddingLeft: 8
      },
      'NativeBase.Icon': {
        paddingLeft: 10
      },
      '.success': {
        borderColor: themeColor.inputSuccessBorderColor
      },
      '.error': {
        borderColor: themeColor.inputErrorBorderColor
      },
      borderWidth: themeColor.borderWidth * 2,
      borderRadius: 30,
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
        borderWidth: themeColor.borderWidth * 2,
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
        borderWidth: themeColor.borderWidth * 2,
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
    '.picker': {
      marginLeft: 0
    },

    borderWidth: themeColor.borderWidth * 2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderColor: themeColor.inputBorderColor,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2
  };

  return itemTheme;
};
