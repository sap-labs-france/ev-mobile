import { ThemeType } from '../types/Theme';


export default class ThemeManager {
  private static instance: ThemeManager;
  private themeType?: ThemeType;

  private constructor() {
  }

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public setThemeType(themeType: ThemeType) {
    this.themeType = themeType;
  }

  public getThemeType(): ThemeType {
    return this.themeType;
  }

  public isThemeTypeIsDark(): boolean {
    return this.themeType !== ThemeType.DARK;
  }
}
