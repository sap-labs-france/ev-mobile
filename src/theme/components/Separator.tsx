import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const theme: any = {
    '.group': {
      height: 50,
      paddingVertical: themeColor.listItemPadding - 8,
      paddingTop: themeColor.listItemPadding + 12,
      '.bordered': {
        height: 50,
        paddingVertical: themeColor.listItemPadding - 8,
        paddingTop: themeColor.listItemPadding + 12
      }
    },
    '.bordered': {
      '.noTopBorder': {
        borderTopWidth: 0
      },
      '.noBottomBorder': {
        borderBottomWidth: 0
      },
      height: 35,
      paddingTop: themeColor.listItemPadding + 2,
      paddingBottom: themeColor.listItemPadding,
      borderBottomWidth: themeColor.borderWidth,
      borderTopWidth: themeColor.borderWidth,
      borderColor: themeColor.listBorderColor
    },
    'NativeBase.Text': {
      fontSize: themeColor.tabBarTextSize - 2,
      color: '#777'
    },
    '.noTopBorder': {
      borderTopWidth: 0
    },
    '.noBottomBorder': {
      borderBottomWidth: 0
    },
    height: 38,
    backgroundColor: '#F0EFF5',
    flex: 1,
    justifyContent: 'center',
    paddingLeft: themeColor.listItemPadding + 5
  };

  return theme;
};
