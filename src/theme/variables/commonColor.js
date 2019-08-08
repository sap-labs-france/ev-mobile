import color from "color";
import { Platform, Dimensions, PixelRatio } from "react-native";
import { scale } from "react-native-size-matters";

export const PLATFORM = {
  ANDROID: "android",
  IOS: "ios",
  MATERIAL: "material",
  WEB: "web"
};

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;
const platformStyle = undefined;
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
const primaryLight = fiori3ShellInteractiveBorder;
const primaryDark = fiori3ShellColor;
const info = "#81C2EA";
const success = fiori3Success;
const successDark = fiori3SuccessBorder;
const danger = fiori3Error;
const dangerDark = fiori3ErrorBorder;
const dangerLight = "#FFA9A9";
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
  brandDangerLight: dangerLight,
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
  innerTouchableBackgroundColor: "#f7f7f7",
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
  badgePadding: platform === PLATFORM.IOS ? 3 : 0,

  // Button
  buttonFontFamily: platform === PLATFORM.IOS ? "System" : "Roboto_medium",
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
    return platform === PLATFORM.IOS ? this.fontSizeBase * 1.1 : this.fontSizeBase - 1;
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
  CheckboxRadius: platform === PLATFORM.IOS ? 13 : 0,
  CheckboxBorderWidth: platform === PLATFORM.IOS ? 1 : 2,
  CheckboxPaddingLeft: platform === PLATFORM.IOS ? 4 : 2,
  CheckboxPaddingBottom: platform === PLATFORM.IOS ? 0 : 5,
  CheckboxIconSize: platform === PLATFORM.IOS ? 21 : 16,
  CheckboxIconMarginTop: platform === PLATFORM.IOS ? undefined : 1,
  CheckboxFontSize: platform === PLATFORM.IOS ? 23 / 0.9 : 17,
  checkboxBgColor: "#fff",
  checkboxSize: 20,
  checkboxTickColor: primaryDark,
  checkboxDefaultColor: "transparent",

  // Container
  containerBgColor: "#f7f7f7",

  // Date Picker
  datePickerTextColor: "#000",
  datePickerBg: "transparent",

  // FAB
  fabWidth: 56,

  // Font
  DefaultFontSize: 16,
  fontFamily: platform === PLATFORM.IOS ? "System" : "Roboto",
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
  tabBarTextSize: platform === PLATFORM.IOS ? 14 : 11,
  activeTab: platform === PLATFORM.IOS ? "#007aff" : "#fff",
  sTabBarActiveTextColor: "#007aff",
  tabBarActiveTextColor: platform === PLATFORM.IOS ? "#2874F0" : "#fff",
  tabActiveBgColor: platform === PLATFORM.IOS ? "#cde1f9" : "#3F51B5",

  // Header
  toolbarBtnColor: primaryDark,
  toolbarDefaultBg: primary,
  toolbarHeight: platform === PLATFORM.IOS ? 64 : 56,
  toolbarSearchIconSize: platform === PLATFORM.IOS ? 20 : 23,
  toolbarInputColor: platform === PLATFORM.IOS ? "#CECDD2" : "#fff",
  searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
  searchBarInputHeight: platform === PLATFORM.IOS ? 30 : 50,
  toolbarBtnTextColor: primaryDark,
  iosStatusbar: "dark-content",
  toolbarDefaultBorder: platform === PLATFORM.IOS ? "#a7a6ab" : "#3F51B5",
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
  iconFontSize: platform === PLATFORM.IOS ? 30 : 28,
  iconHeaderSize: platform === PLATFORM.IOS ? 33 : 24,

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
  lineHeight: platform === PLATFORM.IOS ? 20 : 24,

  // List
  listBg: "transparent",
  listBorderColor: "#c9c9c9",
  listDividerBg: "#f4f4f4",
  listBtnUnderlayColor: "#DDD",
  listItemPadding: platform === PLATFORM.IOS ? 10 : 12,
  listNoteColor: "#808080",
  listNoteSize: 13,
  listItemSelected: platform === PLATFORM.IOS ? "#007aff" : "#3F51B5",

  // Progress Bar
  defaultProgressColor: "#E4202D",
  inverseProgressColor: "#1A191B",

  // Radio Button
  radioBtnSize: platform === PLATFORM.IOS ? 25 : 23,
  radioSelectedColorAndroid: "#3F51B5",
  radioBtnLineHeight: platform === PLATFORM.IOS ? 29 : 24,
  get radioColor() {
    return primary;
  },

  // Segment
  segmentBackgroundColor: platform === PLATFORM.IOS ? "#F8F8F8" : "#3F51B5",
  segmentActiveBackgroundColor: platform === PLATFORM.IOS ? "#007aff" : "#fff",
  segmentTextColor: platform === PLATFORM.IOS ? "#007aff" : "#fff",
  segmentActiveTextColor: platform === PLATFORM.IOS ? "#fff" : "#3F51B5",
  segmentBorderColor: platform === PLATFORM.IOS ? "#007aff" : "#fff",
  segmentBorderColorMain: platform === PLATFORM.IOS ? "#a7a6ab" : "#3F51B5",

  // Spinner
  defaultSpinnerColor: "#45D56E",
  inverseSpinnerColor: "#1A191B",

  // Tab
  tabDefaultBg: primaryDark,
  topTabBarTextColor: "#b3c7f9",
  topTabBarActiveTextColor: "#fff",
  topTabBarBorderColor: platform === PLATFORM.IOS ? "#a7a6ab" : "#fff",
  topTabBarActiveBorderColor: platform === PLATFORM.IOS ? "#007aff" : "#fff",

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
  titleFontfamily: platform === PLATFORM.IOS ? "System" : "Roboto_medium",
  titleFontSize: platform === PLATFORM.IOS ? 17 : 19,
  subTitleFontSize: platform === PLATFORM.IOS ? 11 : 14,
  subtitleColor: primaryDark,
  titleFontColor: primaryDark,

  // Other
  borderRadiusBase: platform === PLATFORM.IOS ? 5 : 2,
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
