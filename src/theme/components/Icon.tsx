import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const iconTheme: any = {
    fontSize: themeColor.iconFontSize,
    color: themeColor.textColor
  };

  return iconTheme;
};
