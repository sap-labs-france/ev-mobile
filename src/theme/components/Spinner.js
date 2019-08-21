// @flow
import { scale } from "react-native-size-matters";

export default () => {
  const spinnerTheme = {
    width: scale(20),
    height: scale(20)
  };

  return spinnerTheme;
};
