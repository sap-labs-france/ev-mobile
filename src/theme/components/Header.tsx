import { PixelRatio, StatusBar } from "react-native";
import { PLATFORM } from "./../variables/commonColor";
import variable from "./../variables/platform";

const buildTheme = (variables: any) => {
  // Forced to break up the theme to avoid typescript infinite run!
  const platformStyle = variables.platformStyle;
  const platform = variables.platform;

  const headerTheme: any = {
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingLeft: platform === PLATFORM.IOS ? 5 : 0,
    paddingRight: platform === PLATFORM.IOS ? 5 : 0,
    justifyContent: "center",
    // paddingTop: platform === PLATFORM.IOS ? 18 : 0,
    borderBottomWidth: platform === PLATFORM.IOS ? 1 / PixelRatio.getPixelSizeForLayoutSize(1) : 0,
    borderBottomColor: variables.toolbarDefaultBorder,
    height:
      variables.platform === PLATFORM.IOS && variables.platformStyle === PLATFORM.MATERIAL
        ? variables.toolbarHeight + 10
        : variables.toolbarHeight,
    top: 0,
    left: 0,
    right: 0
  };

  headerTheme[".span"] = {
    height: 128,
    "NativeBase.Left": {
      alignSelf: "flex-start"
    },
    "NativeBase.Body": {
      alignSelf: "flex-end",
      alignItems: "flex-start",
      justifyContent: "center",
      paddingBottom: 26
    },
    "NativeBase.Right": {
      alignSelf: "flex-start"
    }
  };

  headerTheme[".hasSubtitle"] = {
    "NativeBase.Body": {
      "NativeBase.Title": {
        fontSize: variables.titleFontSize - 2,
        fontFamily: variables.titleFontfamily,
        textAlign: "center",
        fontWeight: "500",
        paddingBottom: 3
      },
      "NativeBase.Subtitle": {
        fontSize: variables.subTitleFontSize,
        fontFamily: variables.titleFontfamily,
        color: variables.subtitleColor,
        textAlign: "center"
      }
    }
  };

  headerTheme[".transparent"] = {
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    elevation: 0,
    shadowColor: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowOpacity: null,
    paddingTop: platform === PLATFORM.ANDROID ? StatusBar.currentHeight : undefined,
    height: platform === PLATFORM.ANDROID ? variables.toolbarHeight + StatusBar.currentHeight : variables.toolbarHeight
  };

  headerTheme[".noShadow"] = {
    elevation: 0,
    shadowColor: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowOpacity: null
  };

  headerTheme[".hasTabs"] = {
    elevation: 0,
    shadowColor: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowOpacity: null,
    borderBottomWidth: null
  };

  headerTheme[".hasSegment"] = {
    elevation: 0,
    shadowColor: null,
    shadowOffset: null,
    shadowRadius: null,
    shadowOpacity: null,
    borderBottomWidth: null,
    "NativeBase.Left": {
      flex: 0.3
    },
    "NativeBase.Right": {
      flex: 0.3
    },
    "NativeBase.Body": {
      flex: 1,
      "NativeBase.Segment": {
        marginRight: 0,
        alignSelf: "center",
        "NativeBase.Button": {
          paddingLeft: 0,
          paddingRight: 0
        }
      }
    }
  };

  headerTheme[".noLeft"] = {
    "NativeBase.Left": {
      width: platform === PLATFORM.IOS ? undefined : 0,
      flex: platform === PLATFORM.IOS ? 1 : 0
    },
    "NativeBase.Body": {
      "NativeBase.Title": {
        paddingLeft: platform === PLATFORM.IOS ? undefined : 10
      },
      "NativeBase.Subtitle": {
        paddingLeft: platform === PLATFORM.IOS ? undefined : 10
      }
    }
  };

  headerTheme["NativeBase.Button"] = {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    ".transparent": {
      "NativeBase.Text": {
        color: variables.toolbarBtnTextColor,
        fontWeight: "600"
      },
      "NativeBase.Icon": {
        color: variables.toolbarBtnColor
      },
      "NativeBase.IconNB": {
        color: variables.toolbarBtnColor
      },
      paddingHorizontal: variables.buttonPadding
    },
    paddingHorizontal: 15
  };

  headerTheme[".searchBar"] = {
    "NativeBase.Item": {
      "NativeBase.Icon": {
        backgroundColor: "transparent",
        color: variables.dropdownLinkColor,
        fontSize: variables.toolbarSearchIconSize,
        alignItems: "center",
        marginTop: 2,
        paddingRight: 10,
        paddingLeft: 10
      },
      "NativeBase.IconNB": {
        backgroundColor: "transparent",
        color: null,
        alignSelf: "center"
      },
      "NativeBase.Input": {
        alignSelf: "center",
        lineHeight: null,
        height: variables.searchBarInputHeight
      },
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "flex-start",
      flex: 1,
      height: variables.searchBarHeight,
      borderColor: "transparent",
      backgroundColor: variables.toolbarInputColor
    },
    "NativeBase.Button": {
      ".transparent": {
        "NativeBase.Text": {
          fontWeight: "500"
        },
        paddingHorizontal: null,
        paddingLeft: platform === PLATFORM.IOS ? 10 : null
      },
      paddingHorizontal: platform === PLATFORM.IOS ? undefined : null,
      width: platform === PLATFORM.IOS ? undefined : 0,
      height: platform === PLATFORM.IOS ? undefined : 0
    }
  };

  headerTheme[".rounded"] = {
    "NativeBase.Item": {
      borderRadius: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? 25 : 3
    }
  };

  headerTheme["NativeBase.Left"] = {
    "NativeBase.Button": {
      ".hasText": {
        marginLeft: -10,
        height: 30,
        "NativeBase.Icon": {
          color: variables.toolbarBtnColor,
          fontSize: variables.iconHeaderSize,
          marginTop: 2,
          marginRight: 5,
          marginLeft: 2
        },
        "NativeBase.Text": {
          color: variables.toolbarBtnTextColor,
          fontSize: platform === PLATFORM.IOS ? 17 : 0,
          marginLeft: 7,
          lineHeight: 19.5
        },
        "NativeBase.IconNB": {
          color: variables.toolbarBtnColor,
          fontSize: variables.iconHeaderSize,
          marginTop: 2,
          marginRight: 5,
          marginLeft: 2
        }
      },
      ".transparent": {
        "NativeBase.Icon": {
          color: variables.toolbarBtnColor,
          fontSize:
            platform === PLATFORM.IOS && variables.platformStyle !== PLATFORM.MATERIAL
              ? variables.iconHeaderSize + 1
              : variables.iconHeaderSize,
          marginTop: 0,
          marginRight: 2,
          marginLeft: 1,
          paddingTop: 1
        },
        "NativeBase.IconNB": {
          color: variables.toolbarBtnColor,
          fontSize:
            platform === PLATFORM.IOS && variables.platformStyle !== PLATFORM.MATERIAL
              ? variables.iconHeaderSize + 1
              : variables.iconHeaderSize - 2,
          marginTop: 0,
          marginRight: 2,
          marginLeft: 1,
          paddingTop: 1
        },
        "NativeBase.Text": {
          color: variables.toolbarBtnTextColor,
          fontSize: platform === PLATFORM.IOS ? 17 : 0,
          top: platform === PLATFORM.IOS ? 1 : -1.5,
          paddingLeft: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? 2 : 5,
          paddingRight: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? undefined : 10
        },
        padding: 0,
        marginLeft: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? -3 : 0,
        backgroundColor: "transparent",
        borderColor: null,
        elevation: 0,
        shadowColor: null,
        shadowOffset: null,
        shadowRadius: null,
        shadowOpacity: null
      },
      "NativeBase.Icon": {
        color: variables.toolbarBtnColor
      },
      "NativeBase.IconNB": {
        color: variables.toolbarBtnColor
      },
      alignSelf: null,
      paddingRight: variables.buttonPadding,
      paddingLeft: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? 4 : 8
    },
    flex: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? 1 : 0.4,
    alignSelf: "center",
    alignItems: "flex-start"
  };

  headerTheme["NativeBase.Body"] = {
    flex: 1,
    alignItems: platform === PLATFORM.IOS && platformStyle !== PLATFORM.MATERIAL ? "center" : "center",
    alignSelf: "center",
    "NativeBase.Segment": {
      borderWidth: 0,
      alignSelf: "flex-end",
      marginRight: platform === PLATFORM.IOS ? -40 : -55
    },
    "NativeBase.Button": {
      alignSelf: "center",
      ".transparent": {
        backgroundColor: "transparent"
      },
      "NativeBase.Icon": {
        color: variables.toolbarBtnColor
      },
      "NativeBase.IconNB": {
        color: variables.toolbarBtnColor
      },
      "NativeBase.Text": {
        color: variables.inverseTextColor,
        backgroundColor: "transparent"
      }
    }
  };

  headerTheme["NativeBase.Right"] = {
    "NativeBase.Button": {
      ".hasText": {
        height: 30,
        "NativeBase.Icon": {
          color: variables.toolbarBtnColor,
          fontSize: variables.iconHeaderSize - 2,
          marginTop: 2,
          marginRight: 2,
          marginLeft: 5
        },
        "NativeBase.Text": {
          color: variables.toolbarBtnTextColor,
          fontSize: platform === PLATFORM.IOS ? 17 : 14,
          lineHeight: 19.5
        },
        "NativeBase.IconNB": {
          color: variables.toolbarBtnColor,
          fontSize: variables.iconHeaderSize - 2,
          marginTop: 2,
          marginRight: 2,
          marginLeft: 5
        }
      },
      ".transparent": {
        "NativeBase.Icon": {
          color: variables.toolbarBtnColor,
          fontSize: variables.iconHeaderSize - 2,
          marginTop: 0,
          marginLeft: 2,
          marginRight: 0
          // paddingTop: 0
        },
        "NativeBase.IconNB": {
          color: variables.toolbarBtnColor,
          fontSize: variables.iconHeaderSize - 2,
          marginTop: 0,
          marginLeft: 2,
          marginRight: 0
          // paddingTop: 0
        },
        "NativeBase.Text": {
          color: variables.toolbarBtnTextColor,
          fontSize: platform === PLATFORM.IOS ? 17 : 14,
          top: platform === PLATFORM.IOS ? 1 : -1.5,
          paddingRight: platform === PLATFORM.IOS && variables.platformStyle !== PLATFORM.MATERIAL ? 0 : undefined
        },
        padding: 0,
        marginLeft: platform === PLATFORM.IOS ? -9 : -5,
        backgroundColor: "transparent",
        borderColor: null,
        elevation: 0,
        shadowColor: null,
        shadowOffset: null,
        shadowRadius: null,
        shadowOpacity: null
      },
      "NativeBase.Icon": {
        color: variables.toolbarBtnColor
      },
      "NativeBase.IconNB": {
        color: variables.toolbarBtnColor
      },
      alignSelf: null,
      paddingHorizontal: variables.buttonPadding
    },
    flex: 1,
    alignSelf: "center",
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end"
  };
  return headerTheme;
};

export default (variables /* : * */ = variable) => {
  return buildTheme(variables);
};
