import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const textAreaTheme: any = {
    '.underline': {
      borderBottomWidth: themeColor.borderWidth,
      marginTop: 5,
      borderColor: themeColor.inputBorderColor
    },
    '.bordered': {
      borderWidth: 1,
      marginTop: 5,
      borderColor: themeColor.inputBorderColor
    },
    color: themeColor.textColor,
    paddingLeft: 10,
    paddingRight: 5,
    fontSize: 15,
    textAlignVertical: 'top'
  };

  return textAreaTheme;
};
