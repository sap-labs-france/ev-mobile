// @flow
// copy/paste theme (index.tsx) in here + use custom platform variable
import { merge } from 'lodash';
import commonColor from '../custom-theme/customCommonColor';
import buildTheme from '../theme/components';

const theme = () => {
  const currentTheme = buildTheme(commonColor);
  const customTheme = {
  };

  return merge(currentTheme, customTheme);
}

export default theme;
