import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const cardTheme: any = {
    '.transparent': {
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      shadowRadius: null,
      elevation: null,
      backgroundColor: 'transparent',
      borderWidth: 0
    },
    '.noShadow': {
      shadowColor: null,
      shadowOffset: null,
      shadowOpacity: null,
      elevation: null
    },
    marginVertical: 5,
    marginHorizontal: 2,
    borderWidth: themeColor.borderWidth,
    borderRadius: themeColor.cardBorderRadius,
    borderColor: themeColor.cardBorderColor,
    flexWrap: 'nowrap',
    backgroundColor: themeColor.cardDefaultBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3
  };

  return cardTheme;
};
