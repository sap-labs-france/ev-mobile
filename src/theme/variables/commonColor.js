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
const isIphoneX = platform === PLATFORM.IOS && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

const fiori3Brand = "#0a6ed1";
const fiori3Success = "#16ab54";
const fiori3Error = "#ee0000";
const fiori3Bg = "#f7f7f7";
const fiori3Primary2 = "#0a6ed1";

const dardLightRatio = 0.3;

const primary = fiori3Brand;
const primaryLight = color(primary).lighten(dardLightRatio).hex();
const primaryDark = color(primary).darken(dardLightRatio).hex();
const info = fiori3Primary2;
const infoLight = color(info).lighten(dardLightRatio).hex();;
const infoDark = color(info).darken(dardLightRatio).hex();
const success = fiori3Success;
const successLight = color(success).lighten(dardLightRatio).hex();
const successDark = color(success).darken(dardLightRatio).hex();
const danger = fiori3Error;
const dangerLight = color(danger).lighten(dardLightRatio).hex();
const dangerDark = color(danger).darken(dardLightRatio).hex();
const warning = "#FB8C00";
const warningLight = color(warning).lighten(dardLightRatio).hex();
const warningDark = color(warning).darken(dardLightRatio).hex();
const disabled = "#757575";
const disabledLight = color(disabled).lighten(dardLightRatio).hex();
const disabledDark = color(disabled).darken(dardLightRatio).hex();
const background = fiori3Bg;
const backgroundHeader = "#E7E7E7";
const borderColor = "#ccc";
const transparentBg = "rgba(256, 256, 256, 0.3)";
const dark = "#000";
const light = "#f4f4f4";

export default {
  platformStyle,
  platform,

  // Color
  brandPrimary: primary,
  brandPrimaryLight: primaryLight,
  brandPrimaryDark: primaryDark,
  brandInfo: info,
  brandInfoLight: infoLight,
  brandInfoDark: infoDark,
  brandSuccess: success,
  brandSuccessLight: successLight,
  brandSuccessDark: successDark,
  brandDanger: danger,
  brandDangerLight: dangerLight,
  brandDangerDark: dangerDark,
  brandWarning: warning,
  brandWarningLight: warningLight,
  brandWarningDark: warningDark,
  brandDisable: disabled,
  brandDisableLight: disabledLight,
  brandDisableDark: disabledDark,
  brandBackground: background,

  brandDark: dark,
  brandLight: light,

  // Accordion
  headerStyle: light,
  iconStyle: dark,
  contentStyle: light,
  expandedIconStyle: dark,
  accordionBorderColor: disabledLight,

  // ActionSheet
  elevation: 4,
  containerTouchableBackgroundColor: "rgba(0,0,0,0.4)",
  innerTouchableBackgroundColor: light,
  listItemHeight: 50,
  listItemBorderColor: "transparent",
  marginHorizontal: -15,
  marginLeft: 14,
  marginTop: 15,
  minHeight: 56,
  padding: 15,
  touchableTextColor: disabled,

  // Android
  androidRipple: true,
  androidRippleColor: transparentBg,
  androidRippleColorDark: "rgba(0, 0, 0, 0.15)",
  buttonUppercaseAndroidText: true,

  // Badge
  badgeBg: light,
  badgeColor: primaryDark,
  badgePadding: platform === PLATFORM.IOS ? 3 : 0,

  // Button
  buttonFontFamily: platform === PLATFORM.IOS ? "System" : "Roboto_medium",
  buttonDisabledBg: disabled,
  buttonBg: transparentBg,
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
  cardDefaultBg: background,
  cardBorderColor: borderColor,
  cardBorderRadius: 2,
  cardItemPadding: platform === PLATFORM.IOS ? 10 : 12,

  // CheckBox
  CheckboxRadius: platform === PLATFORM.IOS ? scale(13) : 0,
  CheckboxBorderWidth: platform === PLATFORM.IOS ? scale(1) : scale(2),
  CheckboxPaddingLeft: platform === PLATFORM.IOS ? scale(4) : scale(2),
  CheckboxPaddingBottom: platform === PLATFORM.IOS ? 0 : scale(5),
  CheckboxIconSize: platform === PLATFORM.IOS ? scale(21) : scale(16),
  CheckboxIconMarginTop: platform === PLATFORM.IOS ? undefined : scale(0),
  CheckboxFontSize: platform === PLATFORM.IOS ? scale(23 / 0.9) : scale(17),
  checkboxBgColor: light,
  checkboxSize: scale(18),
  checkboxTickColor: primaryDark,
  checkboxDefaultColor: "transparent",

  // Container
  containerBgColor: background,

  // Date Picker
  datePickerTextColor: dark,
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
  tabBarTextColor: primaryDark,
  tabBarTextSize: platform === PLATFORM.IOS ? 14 : 11,
  activeTab: platform === PLATFORM.IOS ? primary : light,
  sTabBarActiveTextColor: primaryLight,
  tabBarActiveTextColor: platform === PLATFORM.IOS ? primaryLight : light,
  tabActiveBgColor: platform === PLATFORM.IOS ? primaryLight : primary,

  // Header
  toolbarBtnColor: primaryDark,
  toolbarDefaultBg: primary,
  toolbarHeight: platform === PLATFORM.IOS ? 64 : 56,
  toolbarSearchIconSize: platform === PLATFORM.IOS ? 20 : 23,
  toolbarInputColor: platform === PLATFORM.IOS ? disabledLight : light,
  searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
  searchBarInputHeight: platform === PLATFORM.IOS ? 30 : 50,
  toolbarBtnTextColor: primaryDark,
  iosStatusbar: "dark-content",
  toolbarDefaultBorder: light,
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
  inputBorderColor: borderColor,
  inputSuccessBorderColor: success,
  inputErrorBorderColor: danger,
  inputHeightBase: 50,
  inputGroupBg: transparentBg,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return this.brandDisabledDark;
  },

  // Line Height
  buttonLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  lineHeight: platform === PLATFORM.IOS ? 20 : 24,

  // List
  listBg: "transparent",
  listBorderColor: borderColor,
  listDividerBg: light,
  listBtnUnderlayColor: disabledLight,
  listItemPadding: platform === PLATFORM.IOS ? 10 : 12,
  listNoteColor: disabledDark,
  listNoteSize: 13,
  listItemSelected: platform === PLATFORM.IOS ? info : primary,

  // Progress Bar
  defaultProgressColor: danger,
  inverseProgressColor: dark,

  // Radio Button
  radioBtnSize: platform === PLATFORM.IOS ? 25 : 23,
  radioSelectedColorAndroid: primary,
  radioBtnLineHeight: platform === PLATFORM.IOS ? 29 : 24,
  get radioColor() {
    return primary;
  },

  // Segment
  segmentBackgroundColor: platform === PLATFORM.IOS ? light : primary,
  segmentActiveBackgroundColor: platform === PLATFORM.IOS ? info : light,
  segmentTextColor: platform === PLATFORM.IOS ? info : light,
  segmentActiveTextColor: platform === PLATFORM.IOS ? light : primary,
  segmentBorderColor: platform === PLATFORM.IOS ? info : light,
  segmentBorderColorMain: platform === PLATFORM.IOS ? borderColor : primary,

  // Spinner
  defaultSpinnerColor: primaryDark,
  inverseSpinnerColor: primaryLight,

  // Tab
  tabDefaultBg: primaryDark,
  topTabBarTextColor: disabledLight,
  topTabBarActiveTextColor: light,
  topTabBarBorderColor: platform === PLATFORM.IOS ? borderColor : borderColor,
  topTabBarActiveBorderColor: light,

  // Tabs
  tabBgColor: light,
  tabFontSize: 15,

  // Text
  textColor: primaryDark,
  headerTextColor: primaryDark,
  headerBgColor: backgroundHeader,
  inverseTextColor: light,
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
  dropdownLinkColor: disabledDark,
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
