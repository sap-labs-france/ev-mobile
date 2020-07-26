import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const inputTheme: any = {
    '.multiline': {
      height: null
    },
    height: themeColor.inputHeightBase,
    color: themeColor.inputColor,
    paddingLeft: 5,
    paddingRight: 5,
    flex: 1,
    fontSize: themeColor.inputFontSize
  };

  return inputTheme;
};
