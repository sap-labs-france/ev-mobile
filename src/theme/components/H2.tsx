import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const h2Theme: any = {
    color: themeColor.textColor,
    fontSize: themeColor.fontSizeH2,
    lineHeight: themeColor.lineHeightH2
  };

  return h2Theme;
};
