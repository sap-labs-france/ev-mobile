// @flow
// copy/paste theme (index.tsx) in here + use custom platform variable
import { merge } from 'lodash';

import buildTheme from '../theme/components';
import buttonTheme from '../theme/components/Button';
import { ThemeType } from '../types/Theme';
import ThemeManager from './ThemeManager';
import { buildCommonColor } from './customCommonColor';

const theme = (themeType: ThemeType) => {
  // Build the theme
  const themeManager = ThemeManager.getInstance();
  const themeDefinition = themeManager.getThemeDefinition(themeType);
  const commonColor = buildCommonColor(themeDefinition);
  const currentTheme = buildTheme(commonColor);
  const customTheme = {
    'NativeBase.Button': {
      ...buttonTheme(commonColor),
      shadowColor: commonColor.brandDark,
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 1.2,
    }
  };

  return merge(currentTheme, customTheme);
}

export default theme;
