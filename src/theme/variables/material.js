// @flow

import color from "color";
import { Platform, Dimensions, PixelRatio } from "react-native";
import { scale } from "react-native-size-matters";

import { PLATFORM } from "./commonColor";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = PLATFORM.MATERIAL;
const isIphoneX =
  platform === PLATFORM.IOS &&
  (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

const fiori3ShellColor = "#354a5f";
const fiori3Success = "#16ab54";
const fiori3SuccessBorder = "#107e3e";
const fiori3Error = "#ee0000";
const fiori3ErrorBorder = "#bb0000";
const fiori3Bg = "#f7f7f7";
const fiori3Primary = "#354a5f";
const fiori3Primary2 = "#0a6ed1";
const fiori3Active = "#0854a0";
const fiori3ShellInteractiveBorder = "#7996b4";
const fiori3Brand = "#0a6ed1";

const primary = fiori3Brand;
const primaryLight = fiori3Primary2;
const primaryDark = fiori3ShellColor;
const info = "#81C2EA";
const success = fiori3Success;
const successDark = fiori3SuccessBorder;
const danger = fiori3Error;
const dangerDark = fiori3ErrorBorder;
const warning = "#FB8C00";
const warningDark = "#C66F01";
const disable = "#757575";
const disableDark = "#4F4F4F";

export default {
  platformStyle,
  platform,

  // Color
  brandPrimary: primary,
  brandPrimaryLight: primaryLight,
  brandPrimaryDark: primaryDark,
  brandInfo: info,
  brandSuccess: success,
  brandSuccessDark: successDark,
  brandDanger: danger,
  brandDangerDark: dangerDark,
  brandWarning: warning,
  brandWarningDark: warningDark,
  brandDisable: disable,
  brandDisableDark: disableDark,

  brandDark: "#000",
  brandLight: "#f4f4f4",

  // Accordion
  headerStyle: "#edebed",
  iconStyle: "#000",
  contentStyle: "#f5f4f5",
  expandedIconStyle: "#000",
  accordionBorderColor: "#d3d3d3",

  // ActionSheet
  elevation: 4,
  containerTouchableBackgroundColor: "rgba(0,0,0,0.4)",
  innerTouchableBackgroundColor: "#fff",
  listItemHeight: 50,
  listItemBorderColor: "transparent",
  marginHorizontal: -15,
  marginLeft: 14,
  marginTop: 15,
  minHeight: 56,
  padding: 15,
  touchableTextColor: "#757575",

  // Android
  androidRipple: true,
  androidRippleColor: "rgba(256, 256, 256, 0.3)",
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  buttonUppercaseAndroidText: true,

  // Badge
  badgeBg: "#ED1727",
  badgeColor: primaryDark,
  badgePadding: 0,

  // Button
  buttonFontFamily: "Roboto",
  buttonDisabledBg: "#b5b5b5",
  buttonPadding: 6,
  get buttonPrimaryBg() {
    return this.brandPrimary;
  },
  get buttonPrimaryColor() {
    return this.inverseTextColor;
  },
  get buttonInfoBg() {
    return this.brandInfo;
  },
  get buttonInfoColor() {
    return this.inverseTextColor;
  },
  get buttonSuccessBg() {
    return this.brandSuccess;
  },
  get buttonSuccessColor() {
    return this.inverseTextColor;
  },
  get buttonDangerBg() {
    return this.brandDanger;
  },
  get buttonDangerColor() {
    return this.inverseTextColor;
  },
  get buttonWarningBg() {
    return this.brandWarning;
  },
  get buttonWarningColor() {
    return this.inverseTextColor;
  },
  get buttonTextSize() {
    return this.fontSizeBase - 1;
  },
  get buttonTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get buttonTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: fiori3Bg,
  cardBorderColor: "#ccc",
  cardBorderRadius: 2,
  cardItemPadding: platform === PLATFORM.IOS ? 10 : 12,

  // CheckBox
  CheckboxRadius: 0,
  CheckboxBorderWidth: 2,
  CheckboxPaddingLeft: 2,
  CheckboxPaddingBottom: 5,
  CheckboxIconSize: 16,
  CheckboxIconMarginTop: 1,
  CheckboxFontSize: 17,
  checkboxBgColor: "#fff",
  checkboxSize: 20,
  checkboxTickColor: primary,
  checkboxDefaultColor: "transparent",

  containerBgColor: "#fff",

  // Date Picker
  datePickerTextColor: "#000",
  datePickerBg: "transparent",

  // FAB
  fabWidth: 56,

  // Font
  DefaultFontSize: 16,
  fontFamily: "Roboto",
  fontSizeBase: scale(22),
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: 55,
  footerDefaultBg: primaryDark,
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: "#bfc6ea",
  tabBarTextSize: 11,
  activeTab: "#fff",
  sTabBarActiveTextColor: "#007aff",
  tabBarActiveTextColor: "#fff",
  tabActiveBgColor: "#3F51B5",

  // Header
  toolbarBtnColor: primaryDark,
  toolbarDefaultBg: primary,
  toolbarHeight: 56,
  toolbarSearchIconSize: 23,
  toolbarInputColor: "#fff",
  searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
  searchBarInputHeight: platform === PLATFORM.IOS ? 40 : 50,
  toolbarBtnTextColor: primaryDark,
  toolbarDefaultBorder: "#3F51B5",
  iosStatusbar: "light-content",
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // Icon
  iconFamily: "Ionicons",
  iconFontSize: 28,
  iconHeaderSize: 24,

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: "#D9D5DC",
  inputSuccessBorderColor: "#2b8339",
  inputErrorBorderColor: "#ed2f2f",
  inputHeightBase: 50,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return "#575757";
  },

  // Line Height
  buttonLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  lineHeight: 24,

  // List
  listBg: "transparent",
  listBorderColor: "#c9c9c9",
  listDividerBg: "#f4f4f4",
  listBtnUnderlayColor: "#DDD",
  listItemPadding: 12,
  listNoteColor: "#808080",
  listNoteSize: 13,
  listItemSelected: "#3F51B5",

  // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

  // Radio Button
  radioBtnSize: 23,
  radioSelectedColorAndroid: "#3F51B5",
  radioBtnLineHeight: 24,
  get radioColor() {
    return primary;
  },

  // Segment
  segmentBackgroundColor: "#3F51B5",
  segmentActiveBackgroundColor: "#fff",
  segmentTextColor: "#fff",
  segmentActiveTextColor: "#3F51B5",
  segmentBorderColor: "#fff",
  segmentBorderColorMain: "#3F51B5",

  // Spinner
  defaultSpinnerColor: "#45D56E",
  inverseSpinnerColor: "#1A191B",

  // Tab
  tabDefaultBg: primaryDark,
  topTabBarTextColor: "#b3c7f9",
  topTabBarActiveTextColor: "#fff",
  topTabBarBorderColor: "#fff",
  topTabBarActiveBorderColor: "#fff",

  // Tabs
  tabBgColor: "#F8F8F8",
  tabFontSize: 15,

  // Text
  textColor: primaryDark,
  headerTextColor: fiori3Primary,
  inverseTextColor: "#fff",
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: "Roboto",
  titleFontSize: 19,
  subTitleFontSize: 14,
  subtitleColor: primaryDark,
  titleFontColor: primaryDark,

  // Other
  borderRadiusBase: 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  dropdownLinkColor: "#414142",
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,

  // iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21
    }
  }
};
