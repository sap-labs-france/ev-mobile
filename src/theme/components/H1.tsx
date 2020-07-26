import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const h1Theme: any = {
    color: themeColor.textColor,
    fontSize: themeColor.fontSizeH1,
    lineHeight: themeColor.lineHeightH1
  };

  return h1Theme;
};
