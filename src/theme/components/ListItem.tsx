import { PixelRatio, Platform } from 'react-native';
import ThemeColor, { PLATFORM } from '../variables/ThemeColor';
import pickerTheme from './Picker';

export default (themeColor: ThemeColor) => {
  const platform = themeColor.platform;
  const selectedStyle = {
    'NativeBase.Text': {
      color: themeColor.listItemSelected
    },
    'NativeBase.Icon': {
      color: themeColor.listItemSelected
    }
  };

  const listItemTheme: any = {
    'NativeBase.InputGroup': {
      'NativeBase.Icon': {
        paddingRight: 5
      },
      'NativeBase.IconNB': {
        paddingRight: 5
      },
      'NativeBase.Input': {
        paddingHorizontal: 5
      },
      flex: 1,
      borderWidth: null,
      margin: -10,
      borderBottomColor: 'transparent'
    },
    '.searchBar': {
      'NativeBase.Item': {
        'NativeBase.Icon': {
          backgroundColor: 'transparent',
          color: themeColor.dropdownLinkColor,
          fontSize: platform === PLATFORM.IOS ? themeColor.iconFontSize - 10 : themeColor.iconFontSize - 5,
          alignItems: 'center',
          marginTop: 2,
          paddingRight: 8
        },
        'NativeBase.IconNB': {
          backgroundColor: 'transparent',
          color: null,
          alignSelf: 'center'
        },
        'NativeBase.Input': {
          alignSelf: 'center'
        },
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
        height: platform === PLATFORM.IOS ? 30 : 40,
        borderColor: 'transparent',
        backgroundColor: '#fff',
        borderRadius: 5
      },
      'NativeBase.Button': {
        '.transparent': {
          'NativeBase.Text': {
            fontWeight: '500'
          },
          paddingHorizontal: null,
          paddingLeft: platform === PLATFORM.IOS ? 10 : null
        },
        paddingHorizontal: platform === PLATFORM.IOS ? undefined : null,
        width: platform === PLATFORM.IOS ? undefined : 0,
        height: platform === PLATFORM.IOS ? undefined : 0
      },
      backgroundColor: themeColor.toolbarInputColor,
      padding: 10,
      marginLeft: null
    },
    'NativeBase.CheckBox': {
      marginLeft: -10,
      marginRight: 10
    },
    '.first': {
      '.itemHeader': {
        paddingTop: themeColor.listItemPadding + 3
      }
    },
    '.itemHeader': {
      '.first': {
        paddingTop: themeColor.listItemPadding + 3
      },
      borderBottomWidth: platform === PLATFORM.IOS ? themeColor.borderWidth : null,
      marginLeft: null,
      padding: themeColor.listItemPadding,
      paddingLeft: themeColor.listItemPadding + 5,
      paddingTop: platform === PLATFORM.IOS ? themeColor.listItemPadding + 25 : undefined,
      paddingBottom: platform === PLATFORM.ANDROID ? themeColor.listItemPadding + 20 : undefined,
      flexDirection: 'row',
      borderColor: themeColor.listBorderColor,
      'NativeBase.Text': {
        fontSize: 14,
        color: platform === PLATFORM.IOS ? undefined : themeColor.listNoteColor
      }
    },
    '.itemDivider': {
      borderBottomWidth: null,
      marginLeft: null,
      padding: themeColor.listItemPadding,
      paddingLeft: themeColor.listItemPadding + 5,
      backgroundColor: themeColor.listDividerBg,
      flexDirection: 'row',
      borderColor: themeColor.listBorderColor
    },
    '.selected': {
      'NativeBase.Left': {
        ...selectedStyle
      },
      'NativeBase.Body': {
        ...selectedStyle
      },
      'NativeBase.Right': {
        ...selectedStyle
      },
      ...selectedStyle
    },
    'NativeBase.Left': {
      'NativeBase.Body': {
        'NativeBase.Text': {
          '.note': {
            color: themeColor.listNoteColor,
            fontWeight: '200'
          },
          fontWeight: '600'
        },
        marginLeft: 10,
        alignItems: null,
        alignSelf: null
      },
      'NativeBase.Icon': {
        width: themeColor.iconFontSize - 10,
        fontSize: themeColor.iconFontSize - 10
      },
      'NativeBase.IconNB': {
        width: themeColor.iconFontSize - 10,
        fontSize: themeColor.iconFontSize - 10
      },
      'NativeBase.Text': {
        alignSelf: 'center'
      },
      flexDirection: 'row'
    },
    'NativeBase.Body': {
      'NativeBase.Text': {
        marginHorizontal: themeColor.listItemPadding,
        '.note': {
          color: themeColor.listNoteColor,
          fontWeight: '200'
        }
      },
      alignSelf: null,
      alignItems: null
    },
    'NativeBase.Right': {
      'NativeBase.Badge': {
        alignSelf: null
      },
      'NativeBase.PickerNB': {
        'NativeBase.Button': {
          marginRight: -15,
          'NativeBase.Text': {
            color: themeColor.topTabBarActiveTextColor
          }
        }
      },
      'NativeBase.Button': {
        alignSelf: null,
        '.transparent': {
          'NativeBase.Text': {
            color: themeColor.topTabBarActiveTextColor
          }
        }
      },
      'NativeBase.Icon': {
        alignSelf: null,
        fontSize: themeColor.iconFontSize - 8,
        color: '#c9c8cd'
      },
      'NativeBase.IconNB': {
        alignSelf: null,
        fontSize: themeColor.iconFontSize - 8,
        color: '#c9c8cd'
      },
      'NativeBase.Text': {
        '.note': {
          color: themeColor.listNoteColor,
          fontWeight: '200'
        },
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
      padding: null,
      flex: 0.28
    },
    'NativeBase.Text': {
      '.note': {
        color: themeColor.listNoteColor,
        fontWeight: '200'
      },
      alignSelf: 'center'
    },
    '.last': {
      marginLeft: -(themeColor.listItemPadding + 5),
      paddingLeft: (themeColor.listItemPadding + 5) * 2,
      top: 1
    },
    '.avatar': {
      'NativeBase.Left': {
        flex: 0,
        alignSelf: 'flex-start',
        paddingTop: 14
      },
      'NativeBase.Body': {
        'NativeBase.Text': {
          marginLeft: null
        },
        flex: 1,
        paddingVertical: themeColor.listItemPadding,
        borderBottomWidth: themeColor.borderWidth,
        borderColor: themeColor.listBorderColor,
        marginLeft: themeColor.listItemPadding + 5
      },
      'NativeBase.Right': {
        'NativeBase.Text': {
          '.note': {
            fontSize: themeColor.noteFontSize - 2
          }
        },
        flex: 0,
        paddingRight: themeColor.listItemPadding + 5,
        alignSelf: 'stretch',
        paddingVertical: themeColor.listItemPadding,
        borderBottomWidth: themeColor.borderWidth,
        borderColor: themeColor.listBorderColor
      },
      '.noBorder': {
        'NativeBase.Body': {
          borderBottomWidth: null
        },
        'NativeBase.Right': {
          borderBottomWidth: null
        }
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null
    },
    '.thumbnail': {
      'NativeBase.Left': {
        flex: 0
      },
      'NativeBase.Body': {
        'NativeBase.Text': {
          marginLeft: null
        },
        flex: 1,
        paddingVertical: themeColor.listItemPadding + 8,
        borderBottomWidth: themeColor.borderWidth,
        borderColor: themeColor.listBorderColor,
        marginLeft: themeColor.listItemPadding + 5
      },
      'NativeBase.Right': {
        'NativeBase.Button': {
          '.transparent': {
            'NativeBase.Text': {
              fontSize: themeColor.listNoteSize,
              color: themeColor.sTabBarActiveTextColor
            }
          },
          height: null
        },
        flex: 0,
        justifyContent: 'center',
        alignSelf: 'stretch',
        paddingRight: themeColor.listItemPadding + 5,
        paddingVertical: themeColor.listItemPadding + 5,
        borderBottomWidth: themeColor.borderWidth,
        borderColor: themeColor.listBorderColor
      },
      '.noBorder': {
        'NativeBase.Body': {
          borderBottomWidth: null
        },
        'NativeBase.Right': {
          borderBottomWidth: null
        }
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null
    },
    '.icon': {
      '.last': {
        'NativeBase.Body': {
          borderBottomWidth: null
        },
        'NativeBase.Right': {
          borderBottomWidth: null
        },
        borderBottomWidth: themeColor.borderWidth,
        borderColor: themeColor.listBorderColor
      },
      'NativeBase.Left': {
        'NativeBase.Button': {
          'NativeBase.IconNB': {
            marginHorizontal: null,
            fontSize: themeColor.iconFontSize - 5
          },
          'NativeBase.Icon': {
            marginHorizontal: null,
            fontSize: themeColor.iconFontSize - 8
          },
          alignSelf: 'center',
          height: 29,
          width: 29,
          borderRadius: 6,
          paddingVertical: null,
          paddingHorizontal: null,
          alignItems: 'center',
          justifyContent: 'center'
        },
        'NativeBase.Icon': {
          width: themeColor.iconFontSize - 5,
          fontSize: themeColor.iconFontSize - 2
        },
        'NativeBase.IconNB': {
          width: themeColor.iconFontSize - 5,
          fontSize: themeColor.iconFontSize - 2
        },
        paddingRight: themeColor.listItemPadding + 5,
        flex: 0,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center'
      },
      'NativeBase.Body': {
        'NativeBase.Text': {
          marginLeft: null,
          fontSize: 17
        },
        flex: 1,
        height: 44,
        justifyContent: 'center',
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: themeColor.listBorderColor
      },
      'NativeBase.Right': {
        'NativeBase.Text': {
          textAlign: 'center',
          color: '#8F8E95',
          fontSize: 17
        },
        'NativeBase.IconNB': {
          color: '#C8C7CC',
          fontSize: themeColor.iconFontSize - 10,
          alignSelf: 'center',
          paddingLeft: 10,
          paddingTop: 3
        },
        'NativeBase.Icon': {
          color: '#C8C7CC',
          fontSize: themeColor.iconFontSize - 10,
          alignSelf: 'center',
          paddingLeft: 10,
          paddingTop: 3
        },
        'NativeBase.Switch': {
          marginRight: Platform.OS === PLATFORM.IOS ? undefined : -5,
          alignSelf: null
        },
        'NativeBase.PickerNB': {
          ...pickerTheme()
        },
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0,
        alignSelf: 'stretch',
        height: 44,
        justifyContent: 'flex-end',
        borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
        borderColor: themeColor.listBorderColor,
        paddingRight: themeColor.listItemPadding + 5
      },
      '.noBorder': {
        'NativeBase.Body': {
          borderBottomWidth: null
        },
        'NativeBase.Right': {
          borderBottomWidth: null
        }
      },
      borderBottomWidth: null,
      paddingVertical: null,
      paddingRight: null,
      height: 44,
      justifyContent: 'center'
    },
    '.noBorder': {
      borderBottomWidth: null
    },
    '.noIndent': {
      marginLeft: null,
      padding: themeColor.listItemPadding,
      paddingLeft: themeColor.listItemPadding + 6
    },
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: themeColor.listItemPadding + 6,
    paddingVertical: themeColor.listItemPadding + 3,
    marginLeft: themeColor.listItemPadding + 6,
    borderBottomWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
    backgroundColor: themeColor.listBg,
    borderColor: themeColor.listBorderColor
  };

  return listItemTheme;
};
