import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const checkBoxTheme: any = {
    '.checked': {
      'NativeBase.Icon': {
        color: themeColor.checkboxTickColor,
      },
      'NativeBase.IconNB': {
        color: themeColor.checkboxTickColor
      }
    },
    'NativeBase.Icon': {
      color: 'transparent',
      lineHeight: themeColor.CheckboxIconSize,
      marginTop: themeColor.CheckboxIconMarginTop,
      fontSize: themeColor.CheckboxFontSize
    },
    'NativeBase.IconNB': {
      color: 'transparent',
      lineHeight: themeColor.CheckboxIconSize,
      marginTop: themeColor.CheckboxIconMarginTop,
      fontSize: themeColor.CheckboxFontSize
    },
    borderRadius: themeColor.CheckboxRadius,
    overflow: 'hidden',
    width: themeColor.checkboxSize,
    height: themeColor.checkboxSize,
    borderWidth: themeColor.CheckboxBorderWidth,
    borderColor: themeColor.CheckboxBorderColor,
    paddingLeft: themeColor.CheckboxPaddingLeft,
    paddingBottom: themeColor.CheckboxPaddingBottom,
    left: 10
  };

  return checkBoxTheme;
};
