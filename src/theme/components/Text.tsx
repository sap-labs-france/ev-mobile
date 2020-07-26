import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const textTheme: any = {
    fontSize: themeColor.DefaultFontSize,
    fontFamily: themeColor.fontFamily,
    color: themeColor.textColor,
    '.note': {
      color: '#a7a7a7',
      fontSize: themeColor.noteFontSize
    }
  };

  return textTheme;
};
