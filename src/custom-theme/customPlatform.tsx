import { Platform } from 'react-native';
import { PLATFORM } from '../theme/variables/commonColor';

const platform = Platform.OS;

const customPlatform = {
  CheckboxIconMarginTop: platform === PLATFORM.IOS ? 3 : 1,
  CheckboxPaddingLeft: platform === PLATFORM.IOS ? 0 : 0,
  checkboxSize: 23,

  borderRadiusBase: 0
};

export default customPlatform;
