// @flow
// copy/paste theme (index.tsx) in here + use custom platform variable
import { merge } from 'lodash';

import buildTheme from '../theme/components';
import textTheme from '../theme/components/Text';
import { ThemeType } from '../types/Theme';
import ThemeManager from './ThemeManager';
import { buildCommonColor } from './customCommonColor';

const theme = (themeType: ThemeType) => {
  // Build the theme
  const themeManager = ThemeManager.getInstance();
  const themeDefinition = themeManager.getThemeDefinition(themeType);
  const commonColor = buildCommonColor(themeDefinition);
  const currentTheme = buildTheme(commonColor);
  // Example of override
  const customTheme = {
    'NativeBase.Text': {
      ...textTheme(),
      '.link': {
        color: commonColor.textColor,
      }
    }
  };

  return merge(currentTheme, customTheme);
}

export default theme;
