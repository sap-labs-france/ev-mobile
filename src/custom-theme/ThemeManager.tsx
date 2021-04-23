import ThemeDefinition, { ThemeType } from '../types/Theme';
import themeDark from './theme/theme-dark';
import themeLight from './theme/theme-light';

export default class ThemeManager {
  private static instance: ThemeManager;
  private themeType?: ThemeType;

  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public getCurrentThemeDefinition = (): ThemeDefinition => {
    const darkThemeEnabled = this.isThemeTypeIsDark();
    if (darkThemeEnabled) {
      return themeDark;
    }
    return themeLight;
  };

  public getThemeDefinition = (themeType: ThemeType): ThemeDefinition => {
    switch (themeType) {
      case ThemeType.DARK:
        return themeDark;
      default:
        return themeLight;
    }
  };

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
