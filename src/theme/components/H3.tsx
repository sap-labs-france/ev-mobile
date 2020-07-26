import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const h3Theme: any = {
    color: themeColor.textColor,
    fontSize: themeColor.fontSizeH3,
    lineHeight: themeColor.lineHeightH3
  };

  return h3Theme;
};
