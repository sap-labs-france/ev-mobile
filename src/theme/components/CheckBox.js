import variable from "./../variables/platform";

export default (variables = variable) => {
  const checkBoxTheme = {
    ".checked": {
      "NativeBase.Icon": {
        color: variables.checkboxTickColor,
        lineHeight: variables.CheckboxIconSize,
        marginTop: variables.CheckboxIconMarginTop,
        fontSize: variables.CheckboxFontSize
      },
      "NativeBase.IconNB": {
        color: variables.checkboxTickColor,
        lineHeight: variables.CheckboxIconSize,
        marginTop: variables.CheckboxIconMarginTop,
        fontSize: variables.CheckboxFontSize
      }
    },
    "NativeBase.Icon": {
      color: "transparent",
      lineHeight: variables.CheckboxIconSize,
      marginTop: variables.CheckboxIconMarginTop,
      fontSize: variables.CheckboxFontSize
    },
    "NativeBase.IconNB": {
      color: "transparent",
      lineHeight: variables.CheckboxIconSize,
      marginTop: variables.CheckboxIconMarginTop,
      fontSize: variables.CheckboxFontSize
    },
    borderRadius: variables.CheckboxRadius,
    overflow: "hidden",
    width: variables.checkboxSize,
    height: variables.checkboxSize,
    borderWidth: variables.CheckboxBorderWidth,
    paddingLeft: variables.CheckboxPaddingLeft - 1,
    paddingBottom: variables.CheckboxPaddingBottom,
    left: 10
  };

  return checkBoxTheme;
};
