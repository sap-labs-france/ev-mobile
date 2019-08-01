// @flow

import variable from "./../variables/platform";

export default (variables /* : * */ = variable) => {
  const iconTheme = {
    fontSize: variables.iconFontSize,
    color: variable.textColorApp
  };

  return iconTheme;
};
