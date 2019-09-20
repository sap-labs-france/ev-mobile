import variable from "./../variables/platform";

export default (variables /* : * */ = variable) => {
  const h2Theme: any = {
    color: variables.textColor,
    fontSize: variables.fontSizeH2,
    lineHeight: variables.lineHeightH2
  };

  return h2Theme;
};
