import color from 'color';
import ThemeDefinition, { ThemeType } from '../types/Theme';



export default class ThemeManager {
  private static instance: ThemeManager;
  private themeType?: ThemeType;

  // SAP Colors
  public colorBrand = '#0a6ed1';
  public colorSuccess = '#16ab54';
  public colorWarning = '#FB8C00';
  public colorError = '#ee0000';
  public colorPrimary = '#0a6ed1';
  public colorDisabled ='#E7E7E7';

  public darkLightRatio = 0.4;

  public primary = this.colorBrand;
  public primaryLight = color(this.primary).lighten(this.darkLightRatio).hex();
  public primaryDark = color(this.primary).darken(this.darkLightRatio).hex();

  public info = this.colorPrimary;
  public infoLight = color(this.info).lighten(this.darkLightRatio).hex();
  public infoDark = color(this.info).darken(this.darkLightRatio).hex();

  public success = this.colorSuccess;
  public successLight = color(this.success).lighten(this.darkLightRatio).hex();
  public successDark = color(this.success).darken(this.darkLightRatio).hex();

  public danger = this.colorError;
  public dangerLight = color(this.danger).lighten(this.darkLightRatio).hex();
  public dangerDark = color(this.danger).darken(this.darkLightRatio).hex();

  public warning = this.colorWarning;
  public warningLight = color(this.warning).lighten(this.darkLightRatio).hex();
  public warningDark = color(this.warning).darken(this.darkLightRatio).hex();

  public disabled = this.colorDisabled;
  public disabledLight = color(this.disabled).lighten(this.darkLightRatio).hex();
  public disabledDark = color(this.disabled).darken(this.darkLightRatio).hex();

  public dark = '#000';
  public darkLight = '#333';

  public light = '#FFF';
  public lightDark = '#CCC';

  // Light theme
  private lightTheme: ThemeDefinition = {
    success: this.success,
    warning: this.warning,
    danger: this.danger,
    info: this.info,
    primary: this.primary,
    disabled: this.disabled,
    backgroundHeader: this.light,
    listBackgroundHeader: this.lightDark,
    background: this.light,
    borderColor: this.dark,
    textColor: this.dark,
    placeholderTextColor: this.disabledDark,
    inverseTextColor: this.light,
    subTextColor: this.disabledDark,
    buttonBg: this.lightDark,
  };

  // Dark theme
  private darkTheme: ThemeDefinition = {
    success: this.successLight,
    warning: this.warningLight,
    danger: this.dangerLight,
    info: this.infoLight,
    primary: this.primaryLight,
    disabled: this.disabledLight,
    backgroundHeader: this.dark,
    listBackgroundHeader: this.darkLight,
    background: this.dark,
    borderColor: this.light,
    textColor: this.light,
    placeholderTextColor: this.disabledDark,
    inverseTextColor: this.dark,
    subTextColor: this.disabledDark,
    buttonBg: this.disabledDark,
  };

  private constructor() {
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public getCurrentThemeDefinition = (): ThemeDefinition => {
    const darkThemeEnabled = ThemeManager.getInstance().isThemeTypeIsDark();
    if (!darkThemeEnabled) {
      return this.darkTheme;
    }
    return this.lightTheme;
  }

  public setThemeType(themeType: ThemeType) {
    this.themeType = themeType;
  }

  public getThemeType(): ThemeType {
    return this.themeType;
  }

  public isThemeTypeIsDark(): boolean {
    return this.themeType === ThemeType.DARK;
  }
}
