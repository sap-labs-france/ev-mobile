import { scale } from 'react-native-size-matters';
import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const darkCommon = {
    'NativeBase.Text': {
      color: themeColor.brandDark
    },
    'NativeBase.Icon': {
      color: themeColor.brandDark
    },
    'NativeBase.IconNB': {
      color: themeColor.brandDark
    }
  };
  const lightCommon = {
    'NativeBase.Text': {
      color: themeColor.brandLight
    },
    'NativeBase.Icon': {
      color: themeColor.brandLight
    },
    'NativeBase.IconNB': {
      color: themeColor.brandLight
    }
  };
  const primaryCommon = {
    'NativeBase.Text': {
      color: themeColor.buttonPrimaryBg
    },
    'NativeBase.Icon': {
      color: themeColor.buttonPrimaryBg
    },
    'NativeBase.IconNB': {
      color: themeColor.buttonPrimaryBg
    }
  };
  const successCommon = {
    'NativeBase.Text': {
      color: themeColor.buttonSuccessBg
    },
    'NativeBase.Icon': {
      color: themeColor.buttonSuccessBg
    },
    'NativeBase.IconNB': {
      color: themeColor.buttonSuccessBg
    }
  };
  const infoCommon = {
    'NativeBase.Text': {
      color: themeColor.buttonInfoBg
    },
    'NativeBase.Icon': {
      color: themeColor.buttonInfoBg
    },
    'NativeBase.IconNB': {
      color: themeColor.buttonInfoBg
    }
  };
  const warningCommon = {
    'NativeBase.Text': {
      color: themeColor.buttonWarningBg
    },
    'NativeBase.Icon': {
      color: themeColor.buttonWarningBg
    },
    'NativeBase.IconNB': {
      color: themeColor.buttonWarningBg
    }
  };
  const dangerCommon = {
    'NativeBase.Text': {
      color: themeColor.buttonDangerBg
    },
    'NativeBase.Icon': {
      color: themeColor.buttonDangerBg
    },
    'NativeBase.IconNB': {
      color: themeColor.buttonDangerBg
    }
  };
  const buttonTheme: any = {
    '.disabled': {
      '.transparent': {
        backgroundColor: 'transparent',
        'NativeBase.Text': {
          color: themeColor.buttonDisabledBg
        },
        'NativeBase.Icon': {
          color: themeColor.buttonDisabledBg
        },
        'NativeBase.IconNB': {
          color: themeColor.buttonDisabledBg
        }
      },
      'NativeBase.Text': {
        color: themeColor.brandDisabledDark,
      },
      'NativeBase.Icon': {
        color: themeColor.brandLight
      },
      'NativeBase.IconNB': {
        color: themeColor.brandLight
      },
      backgroundColor: themeColor.buttonDisabledBg
    },
    '.bordered': {
      '.dark': {
        ...darkCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.brandDark,
        borderWidth: themeColor.borderWidth * 2
      },
      '.light': {
        ...lightCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.brandLight,
        borderWidth: themeColor.borderWidth * 2
      },
      '.primary': {
        ...primaryCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonPrimaryBg,
        borderWidth: themeColor.borderWidth * 2
      },
      '.success': {
        ...successCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonSuccessBg,
        borderWidth: themeColor.borderWidth * 2
      },
      '.info': {
        ...infoCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonInfoBg,
        borderWidth: themeColor.borderWidth * 2
      },
      '.warning': {
        ...warningCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonWarningBg,
        borderWidth: themeColor.borderWidth * 2
      },
      '.danger': {
        ...dangerCommon,
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonDangerBg,
        borderWidth: themeColor.borderWidth * 2
      },
      '.disabled': {
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonDisabledBg,
        borderWidth: themeColor.borderWidth * 2,
        'NativeBase.Text': {
          color: themeColor.buttonDisabledBg
        }
      },
      ...primaryCommon,
      borderWidth: themeColor.borderWidth * 2,
      elevation: null,
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      shadowRadius: null,
      backgroundColor: 'transparent'
    },

    '.dark': {
      '.bordered': {
        ...darkCommon
      },
      backgroundColor: themeColor.brandDark
    },

    '.light': {
      '.transparent': {
        ...lightCommon,
        backgroundColor: 'transparent'
      },
      '.bordered': {
        ...lightCommon
      },
      ...darkCommon,
      backgroundColor: themeColor.brandLight
    },

    '.primary': {
      '.bordered': {
        ...primaryCommon
      },
      backgroundColor: themeColor.buttonPrimaryBg
    },

    '.success': {
      '.bordered': {
        ...successCommon
      },
      backgroundColor: themeColor.buttonSuccessBg
    },

    '.info': {
      '.bordered': {
        ...infoCommon
      },
      backgroundColor: themeColor.buttonInfoBg
    },

    '.warning': {
      '.bordered': {
        ...warningCommon
      },
      backgroundColor: themeColor.buttonWarningBg
    },

    '.danger': {
      '.bordered': {
        ...dangerCommon
      },
      backgroundColor: themeColor.buttonDangerBg
    },

    '.block': {
      justifyContent: 'center',
      alignSelf: 'stretch'
    },

    '.full': {
      justifyContent: 'center',
      alignSelf: 'stretch',
      borderRadius: 0
    },

    '.rounded': {
      borderRadius: themeColor.borderRadiusLarge
    },

    '.transparent': {
      backgroundColor: 'transparent',
      elevation: 0,
      shadowColor: null,
      shadowOffset: null,
      shadowRadius: null,
      shadowOpacity: null,
      ...primaryCommon,
      '.dark': {
        ...darkCommon
      },
      '.danger': {
        ...dangerCommon
      },
      '.warning': {
        ...warningCommon
      },
      '.info': {
        ...infoCommon
      },
      '.primary': {
        ...primaryCommon
      },
      '.success': {
        ...successCommon
      },
      '.light': {
        ...lightCommon
      },
      '.disabled': {
        backgroundColor: 'transparent',
        borderColor: themeColor.buttonDisabledBg,
        borderWidth: themeColor.borderWidth * 2,
        'NativeBase.Text': {
          color: themeColor.buttonDisabledBg
        },
        'NativeBase.Icon': {
          color: themeColor.buttonDisabledBg
        },
        'NativeBase.IconNB': {
          color: themeColor.buttonDisabledBg
        }
      }
    },

    '.small': {
      height: 30,
      'NativeBase.Text': {
        fontSize: 14
      },
      'NativeBase.Icon': {
        fontSize: 20,
        paddingTop: 0
      },
      'NativeBase.IconNB': {
        fontSize: 20,
        paddingTop: 0
      }
    },

    '.large': {
      height: 60,
      'NativeBase.Text': {
        fontSize: 22
      }
    },

    '.capitalize': {},

    '.vertical': {
      flexDirection: 'column',
      height: null
    },

    'NativeBase.Text': {
      fontFamily: themeColor.buttonFontFamily,
      marginLeft: 0,
      marginRight: 0,
      color: themeColor.inverseTextColor,
      fontSize: themeColor.buttonTextSize,
      paddingHorizontal: 16,
      backgroundColor: 'transparent'
    },

    'NativeBase.Icon': {
      color: themeColor.inverseTextColor,
      fontSize: 24,
      // marginHorizontal: 16,
      paddingTop: themeColor.platform === PLATFORM.IOS ? 2 : undefined
    },

    'NativeBase.IconNB': {
      color: themeColor.inverseTextColor,
      fontSize: 24,
      // marginHorizontal: 16,
      paddingTop: themeColor.platform === PLATFORM.IOS ? 2 : undefined
    },

    '.iconLeft': {
      'NativeBase.Text': {
        marginLeft: 0
      },
      'NativeBase.IconNB': {
        marginRight: 0,
        marginLeft: 16
      },
      'NativeBase.Icon': {
        marginRight: 0,
        marginLeft: 16
      }
    },
    '.iconRight': {
      'NativeBase.Text': {
        marginRight: 0
      },
      'NativeBase.IconNB': {
        marginLeft: 0,
        marginRight: 16
      },
      'NativeBase.Icon': {
        marginLeft: 0,
        marginRight: 16
      }
    },
    '.picker': {
      'NativeBase.Text': {
        '.note': {
          fontSize: 16,
          lineHeight: null
        }
      }
    },
    paddingVertical: themeColor.buttonPadding,
    backgroundColor: themeColor.buttonBg,
    borderColor: themeColor.buttonPrimaryBg,
    borderWidth: null,
    height: scale(35),
    flexDirection: 'row',
    elevation: 2,
    shadowColor: themeColor.brandDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,
    alignItems: 'center',
    justifyContent: 'space-between'
  };
  return buttonTheme;
};
