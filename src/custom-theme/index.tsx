// @flow
// copy/paste theme (index.tsx) in here + use custom platform variable
import { merge } from 'lodash';
import commonColor from '../custom-theme/customCommonColor';
import buildTheme from '../theme/components';
import textTheme from '../theme/components/Text';

const theme = () => {
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
