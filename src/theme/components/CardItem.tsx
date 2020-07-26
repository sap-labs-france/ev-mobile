import { StyleSheet } from 'react-native';

import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const platform = themeColor.platform;
  const transparentBtnCommon: any = {
    'NativeBase.Text': {
      fontSize: themeColor.DefaultFontSize - 3,
      color: themeColor.sTabBarActiveTextColor
    },
    'NativeBase.Icon': {
      fontSize: themeColor.iconFontSize - 10,
      color: themeColor.sTabBarActiveTextColor,
      marginHorizontal: null
    },
    'NativeBase.IconNB': {
      fontSize: themeColor.iconFontSize - 10,
      color: themeColor.sTabBarActiveTextColor
    },
    paddingVertical: null,
    paddingHorizontal: null
  };

  const cardItemTheme: any = {
    'NativeBase.Left': {
      'NativeBase.Body': {
        'NativeBase.Text': {
          '.note': {
            color: themeColor.listNoteColor,
            fontWeight: '400',
            marginRight: 20
          }
        },
        flex: 1,
        marginLeft: 10,
        alignItems: null
      },
      'NativeBase.Icon': {
        fontSize: themeColor.iconFontSize
      },
      'NativeBase.IconNB': {
        fontSize: themeColor.iconFontSize
      },
      'NativeBase.Text': {
        marginLeft: 10,
        alignSelf: 'center'
      },
      'NativeBase.Button': {
        '.transparent': {
          ...transparentBtnCommon,
          paddingRight: themeColor.cardItemPadding + 5
        }
      },
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    },
    '.content': {
      'NativeBase.Text': {
        color: platform === PLATFORM.IOS ? '#555' : '#222',
        fontSize: themeColor.DefaultFontSize - 2
      }
    },
    '.cardBody': {
      padding: -5,
      'NativeBase.Text': {
        marginTop: 5
      }
    },
    'NativeBase.Body': {
      'NativeBase.Text': {
        '.note': {
          color: themeColor.listNoteColor,
          fontWeight: '200',
          marginRight: 20
        }
      },
      'NativeBase.Button': {
        '.transparent': {
          ...transparentBtnCommon,
          paddingRight: themeColor.cardItemPadding + 5,
          alignSelf: 'stretch'
        }
      },
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'flex-start'
    },
    'NativeBase.Right': {
      'NativeBase.Badge': {
        alignSelf: null
      },
      'NativeBase.Button': {
        '.transparent': {
          ...transparentBtnCommon
        },
        alignSelf: null
      },
      'NativeBase.Icon': {
        alignSelf: null,
        fontSize: themeColor.iconFontSize - 8,
        color: themeColor.cardBorderColor
      },
      'NativeBase.IconNB': {
        alignSelf: null,
        fontSize: themeColor.iconFontSize - 8,
        color: themeColor.cardBorderColor
      },
      'NativeBase.Text': {
        fontSize: themeColor.DefaultFontSize - 1,
        alignSelf: null
      },
      'NativeBase.Thumbnail': {
        alignSelf: null
      },
      'NativeBase.Image': {
        alignSelf: null
      },
      'NativeBase.Radio': {
        alignSelf: null
      },
      'NativeBase.Checkbox': {
        alignSelf: null
      },
      'NativeBase.Switch': {
        alignSelf: null
      },
      flex: 0.8
    },
    '.header': {
      'NativeBase.Text': {
        fontSize: 16,
        fontWeight: platform === PLATFORM.IOS ? '600' : '500'
      },
      '.bordered': {
        'NativeBase.Text': {
          color: themeColor.brandPrimary,
          fontWeight: platform === PLATFORM.IOS ? '600' : '500'
        },
        borderBottomWidth: themeColor.borderWidth
      },
      borderBottomWidth: null,
      paddingVertical: themeColor.cardItemPadding + 5
    },
    '.footer': {
      'NativeBase.Text': {
        fontSize: 16,
        fontWeight: platform === PLATFORM.IOS ? '600' : '500'
      },
      '.bordered': {
        'NativeBase.Text': {
          color: themeColor.brandPrimary,
          fontWeight: platform === PLATFORM.IOS ? '600' : '500'
        },
        borderTopWidth: themeColor.borderWidth
      },
      borderBottomWidth: null
    },
    'NativeBase.Text': {
      '.note': {
        color: themeColor.listNoteColor,
        fontWeight: '200'
      }
    },
    'NativeBase.Icon': {
      width: themeColor.iconFontSize + 5,
      fontSize: themeColor.iconFontSize - 2
    },
    'NativeBase.IconNB': {
      width: themeColor.iconFontSize + 5,
      fontSize: themeColor.iconFontSize - 2
    },
    '.bordered': {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: themeColor.cardBorderColor
    },
    '.first': {
      borderTopLeftRadius: themeColor.cardBorderRadius,
      borderTopRightRadius: themeColor.cardBorderRadius
    },
    '.last': {
      borderBottomLeftRadius: themeColor.cardBorderRadius,
      borderBottomRightRadius: themeColor.cardBorderRadius
    },
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: themeColor.cardBorderRadius,
    padding: themeColor.cardItemPadding + 5,
    paddingVertical: themeColor.cardItemPadding,
    backgroundColor: themeColor.cardDefaultBg
  };

  return cardItemTheme;
};
