import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const iconTheme: any = {
    fontSize: variables.iconFontSize,
    color: variable.textColor
  };

  return iconTheme;
};
