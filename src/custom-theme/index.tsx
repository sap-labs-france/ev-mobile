// @flow
// copy/paste theme (index.tsx) in here + use custom platform variable
import { merge } from 'lodash';

import buildTheme from '../theme/components';
import buttonTheme from '../theme/components/Button';
import headerTheme from '../theme/components/Header';
import { ThemeType } from '../types/Theme';
import { buildCommonColor } from './customCommonColor';
import ThemeManager from './ThemeManager';

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
      shadowRadius: 1.2
    },
    'NativeBase.Header': {
      ...headerTheme(commonColor),
      'NativeBase.Body': {
        alignItems: 'center'
      }
    }
  };

  return merge(currentTheme, customTheme);
};

export default theme;
