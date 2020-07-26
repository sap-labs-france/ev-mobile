import ThemeColor from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const viewTheme: any = {
    '.padder': {
      padding: themeColor.contentPadding
    }
  };

  return viewTheme;
};
