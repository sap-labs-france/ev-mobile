import color from 'color';
import { Dimensions, PixelRatio, Platform } from 'react-native';
import { scale } from 'react-native-size-matters';
import ThemeColors from 'types/Theme';
import ThemeManager from '../ThemeManager';

export const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  MATERIAL: 'material',
  WEB: 'web'
};

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle: any = undefined;
const isIphoneX = platform === PLATFORM.IOS && (deviceHeight === 812 || deviceWidth === 812 || deviceHeight === 896 || deviceWidth === 896);

const colorBrand = '#0a6ed1';
const colorSuccess = '#16ab54';
const colorWarning = '#FB8C00';
const colorError = '#ee0000';
const colorPrimary = '#0a6ed1';
const colorDisabled ='#E7E7E7';

const darkLightRatio = 0.4;

const primary = colorBrand;
const primaryLight = color(primary).lighten(darkLightRatio).hex();
const primaryDark = color(primary).darken(darkLightRatio).hex();
const info = colorPrimary;
const infoLight = color(info).lighten(darkLightRatio).hex();
const infoDark = color(info).darken(darkLightRatio).hex();
const success = colorSuccess;
const successLight = color(success).lighten(darkLightRatio).hex();
const successDark = color(success).darken(darkLightRatio).hex();
const danger = colorError;
const dangerLight = color(danger).lighten(darkLightRatio).hex();
const dangerDark = color(danger).darken(darkLightRatio).hex();
const warning = colorWarning;
const warningLight = color(warning).lighten(darkLightRatio).hex();
const warningDark = color(warning).darken(darkLightRatio).hex();
const disabled = colorDisabled;
const disabledLight = color(disabled).lighten(darkLightRatio).hex();
const disabledDark = color(disabled).darken(darkLightRatio).hex();
const dark = '#333';
const light = '#f4f4f4';

// Dark
const darkTheme: ThemeColors = {
  backgroundHeader: dark,
  background: dark,
  borderColor: light,
  textColor: light,
  placeholderTextColor: dark,
  inverseTextColor: dark,
  subTextColor: disabledDark,
  buttonBg: disabledDark,
  fontSize: scale(22),
  fontSizeIconBase: platform === PLATFORM.IOS ? 30 : 28,
  success: successLight,
  warning: warningLight,
  danger: dangerLight,
  info: infoLight,
  primary: primaryLight,
  disabled: disabledLight,
};

const lightTheme: ThemeColors = {
  backgroundHeader: primaryDark,
  background: primary,
  borderColor: dark,
  textColor: dark,
  placeholderTextColor: disabledDark,
  inverseTextColor: light,
  subTextColor: disabledLight,
  buttonBg: disabledLight,
  fontSize: scale(22),
  fontSizeIconBase: platform === PLATFORM.IOS ? 30 : 28,
  success: successDark,
  warning: warningDark,
  danger: dangerDark,
  info: infoDark,
  primary: primaryDark,
  disabled: disabledDark,
};


// tslint:disable-next-line: cyclomatic-complexity
export default class CommonColor2 {
  public platformStyle = platformStyle;
  public platform = platform;

  // Color
  public brandPrimary = primary;
  public brandPrimaryLight = primaryLight;
  public brandPrimaryDark = primaryDark;
  public brandInfo = info;
  public brandInfoLight = infoLight;
  public brandInfoDark = infoDark;
  public brandSuccess = success;
  public brandSuccessLight = successLight;
  public brandSuccessDark = successDark;
  public brandDanger = danger;
  public brandDangerLight = dangerLight;
  public brandDangerDark = dangerDark;
  public brandWarning = warning;
  public brandWarningLight = warningLight;
  public brandWarningDark = warningDark;
  public brandDisabled = disabled;
  public brandDisabledLight = disabledLight;
  public brandDisabledDark = disabledDark;
  public brandBackground = this.getCurrentTheme().background;

  public success = this.getCurrentTheme().success;
  public warning = this.getCurrentTheme().warning;
  public danger = this.getCurrentTheme().danger;
  public info = this.getCurrentTheme().info;
  public primary = this.getCurrentTheme().primary;
  public disabled = this.getCurrentTheme().disabled;

  public brandDark = dark;
  public brandLight = light;

  // Accordion
  public headerStyle = light;
  public iconStyle = dark;
  public contentStyle = light;
  public expandedIconStyle = dark;
  public accordionBorderColor = disabledLight;

  // ActionSheet
  public elevation = 4;
  public containerTouchableBackgroundColor = 'rgba(0,0,0,0.4)';
  public innerTouchableBackgroundColor = light;
  public listItemHeight = 50;
  public listItemBorderColor = 'transparent';
  public marginHorizontal = -15;
  public marginLeft = 14;
  public marginTop = 15;
  public minHeight = 56;
  public padding = 15;
  public touchableTextColor = disabled;

  // Android
  public androidRipple = true;
  public androidRippleColor = 'rgba(256,256,256,0.3)';
  public androidRippleColorDark = 'rgba(0,0,0,0.15)';
  public buttonUppercaseAndroidText = true;

  // Badge
  public badgeBg = light;
  public badgeColor = primaryDark;
  public badgePadding = platform === PLATFORM.IOS ? 3 : 0;

  // Button
  public buttonFontFamily = platform === PLATFORM.IOS ? 'System' : 'Roboto_medium';
  public buttonDisabledBg = disabled;
  public buttonBg = this.getCurrentTheme().buttonBg;
  public buttonPadding = 6;
  public buttonPrimaryBg = primaryDark;
  public buttonPrimaryColor = light;
  public buttonInfoBg = info;
  public buttonInfoColor = light;
  public buttonSuccessBg = success;
  public buttonSuccessColor = light;
  public buttonDangerBg = danger;
  public buttonDangerColor = light;
  public buttonWarningBg = warning;
  public buttonWarningColor = light;
  public buttonTextSize = platform === PLATFORM.IOS ? this.getCurrentTheme().fontSize * 1.1 : this.getCurrentTheme().fontSize - 1;
  public buttonTextSizeLarge = this.getCurrentTheme().fontSize * 1.5;
  public buttonTextSizeSmall = this.getCurrentTheme().fontSize * 0.8;
  public borderRadiusLarge = this.getCurrentTheme().fontSize * 3.8;
  public iconSizeLarge = this.getCurrentTheme().fontSizeIconBase * 1.5;
  public iconSizeSmall = this.getCurrentTheme().fontSizeIconBase * 0.6;

  // Card
  public cardDefaultBg = this.getCurrentTheme().background;
  public cardBorderColor = this.getCurrentTheme().borderColor;
  public cardBorderRadius = 2;
  public cardItemPadding = platform === PLATFORM.IOS ? 10 : 12;

  // CheckBox
  public CheckboxRadius = platform === PLATFORM.IOS ? scale(13) : 0;
  public CheckboxBorderWidth = platform === PLATFORM.IOS ? scale(1) : scale(2);
  public CheckboxPaddingLeft = platform === PLATFORM.IOS ? 0 : 0;
  public CheckboxPaddingBottom = platform === PLATFORM.IOS ? 0 : scale(5);
  public CheckboxIconSize = platform === PLATFORM.IOS ? scale(20) : scale(17);
  public CheckboxIconMarginTop = platform === PLATFORM.IOS ? undefined : 0;
  public CheckboxFontSize = platform === PLATFORM.IOS ? scale(19) : scale(17);
  public checkboxBgColor = light;
  public checkboxSize = scale(20);
  public checkboxTickColor = primaryDark;
  public checkboxDefaultColor = 'transparent';

  // Container
  public containerBgColor = this.getCurrentTheme().background;

  // Date Picker
  public datePickerTextColor = dark;
  public datePickerBg = 'transparent';

  // FAB
  public fabWidth = 56;

  // Font
  public DefaultFontSize = 16;
  public fontFamily = platform === PLATFORM.IOS ? 'System' : 'Roboto';
  public fontSizeBase = this.getCurrentTheme().fontSize;
  public fontSizeH1 = this.getCurrentTheme().fontSize * 1.8;
  public fontSizeH2 = this.getCurrentTheme().fontSize * 1.6;
  public fontSizeH3 = this.getCurrentTheme().fontSize * 1.4;

  // Footer
  public footerHeight = scale(40);
  public footerDefaultBg = primaryDark;
  public footerPaddingBottom = 0;

  // FooterTab
  public tabBarTextColor = primaryDark;
  public tabBarTextSize = platform === PLATFORM.IOS ? 14 : 11;
  public activeTab = platform === PLATFORM.IOS ? primary : light;
  public sTabBarActiveTextColor = primaryLight;
  public tabBarActiveTextColor = platform === PLATFORM.IOS ? primaryLight : light;
  public tabActiveBgColor = platform === PLATFORM.IOS ? primaryLight : primary;

  // Header
  public toolbarBtnColor = primaryDark;
  public toolbarDefaultBg = primary;
  public toolbarHeight = platform === PLATFORM.IOS ? 64 : 56;
  public toolbarSearchIconSize = platform === PLATFORM.IOS ? 20 : 23;
  public toolbarInputColor = platform === PLATFORM.IOS ? disabledLight : light;
  public searchBarHeight = platform === PLATFORM.IOS ? 30 : 40;
  public searchBarInputHeight = platform === PLATFORM.IOS ? 30 : 50;
  public toolbarBtnTextColor = primaryDark;
  public iosStatusbar = 'dark-content';
  public toolbarDefaultBorder = light;
  public statusBarColor = color(primary).darken(0.2).hex();
  public darkenHeader = color(light).darken(0.03).hex();

  // Icon
  public iconFamily = 'Ionicons';
  public iconFontSize = this.getCurrentTheme().fontSizeIconBase;
  public iconHeaderSize = platform === PLATFORM.IOS ? 33 : 24;

  // InputGroup
  public inputFontSize = 17;
  public inputBorderColor = this.getCurrentTheme().borderColor;
  public inputSuccessBorderColor = success;
  public inputErrorBorderColor = danger;
  public inputHeightBase = 50;
  public inputGroupBg = this.getCurrentTheme().buttonBg;
  public placeholderTextColor = this.getCurrentTheme().borderColor;
  public inputColor = primaryDark;
  public inputColorPlaceholder = this.getCurrentTheme().placeholderTextColor;

  // Line Height
  public buttonLineHeight = 19;
  public lineHeightH1 = 32;
  public lineHeightH2 = 27;
  public lineHeightH3 = 22;
  public lineHeight = platform === PLATFORM.IOS ? 20 : 24;

  // List
  public listBg = 'transparent';
  public listBorderColor = this.getCurrentTheme().borderColor;
  public listDividerBg = light;
  public listBtnUnderlayColor = disabledLight;
  public listItemPadding = platform === PLATFORM.IOS ? 10 : 12;
  public listNoteColor = disabledDark;
  public listNoteSize = 13;
  public listItemSelected = platform === PLATFORM.IOS ? info : primary;

  // Progress Bar
  public defaultProgressColor = danger;
  public inverseProgressColor = dark;

  // Radio Button
  public radioBtnSize = platform === PLATFORM.IOS ? 25 : 23;
  public radioSelectedColorAndroid = primary;
  public radioBtnLineHeight = platform === PLATFORM.IOS ? 29 : 24;
  public radioColor = primary;

  // Segment
  public segmentBackgroundColor = platform === PLATFORM.IOS ? light : primary;
  public segmentActiveBackgroundColor = platform === PLATFORM.IOS ? info : light;
  public segmentTextColor = platform === PLATFORM.IOS ? info : light;
  public segmentActiveTextColor = platform === PLATFORM.IOS ? light : primary;
  public segmentBorderColor = platform === PLATFORM.IOS ? info : light;
  public segmentBorderColorMain = platform === PLATFORM.IOS ? this.getCurrentTheme().borderColor : primary;

  // Spinner
  public defaultSpinnerColor = primaryDark;
  public inverseSpinnerColor = primaryLight;

  // Tab
  public tabDefaultBg = primaryDark;
  public topTabBarTextColor = disabledLight;
  public topTabBarActiveTextColor = light;
  public topTabBarBorderColor = platform === PLATFORM.IOS ? this.getCurrentTheme().borderColor : this.getCurrentTheme().borderColor;
  public topTabBarActiveBorderColor = this.getCurrentTheme().borderColor;

  // Tabs
  public tabBgColor = light;
  public tabFontSize = 15;

  // Text
  public textColor = this.getCurrentTheme().textColor;
  public headerTextColor = this.getCurrentTheme().textColor;
  public headerBgColor = this.getCurrentTheme().backgroundHeader;
  public headerBgColorLight = color(this.getCurrentTheme().backgroundHeader).lighten(0.025).hex();
  public headerBgColorDark = color(this.getCurrentTheme().backgroundHeader).darken(0.025).hex();
  public inverseTextColor = this.getCurrentTheme().inverseTextColor;
  public noteFontSize = 14;
  public defaultTextColor = this.getCurrentTheme().textColor;
  public subTextColor = this.getCurrentTheme().subTextColor;

  // Title
  public titleFontfamily = platform === PLATFORM.IOS ? 'System' : 'Roboto_medium';
  public titleFontSize = platform === PLATFORM.IOS ? 17 : 19;
  public subTitleFontSize = platform === PLATFORM.IOS ? 11 : 14;
  public subtitleColor = primaryDark;
  public titleFontColor = primaryDark;

  // Other
  public borderRadiusBase = platform === PLATFORM.IOS ? 5 : 2;
  public borderWidth = 1 / PixelRatio.getPixelSizeForLayoutSize(1);
  public contentPadding = 10;
  public dropdownLinkColor = disabledDark;
  public inputLineHeight = 24;
  public deviceWidth = deviceWidth;
  public deviceHeight = deviceHeight;
  public isIphoneX = isIphoneX;

  public inputGroupRoundedBorderRadius = 30;

  // iPhoneX SafeArea
  public Inset = {
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

  public getCurrentTheme(): ThemeColors {
    const darkThemeEnabled = ThemeManager.getInstance().isThemeTypeIsDark();
    if (darkThemeEnabled) {
      return darkTheme;
    }
    return lightTheme;
  }
};


