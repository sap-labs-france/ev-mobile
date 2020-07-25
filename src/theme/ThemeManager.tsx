import { ThemeType } from '../types/Theme';


export default class ThemeManager {
  private static instance: ThemeManager;
  private themeType?: ThemeType;

  private constructor() {
  }

  public static async getInstance(): Promise<ThemeManager> {
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
}
