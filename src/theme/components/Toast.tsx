import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const platform = themeColor.platform;

  const toastTheme: any = {
    '.danger': {
      backgroundColor: themeColor.brandDanger
    },
    '.warning': {
      backgroundColor: themeColor.brandWarning
    },
    '.success': {
      backgroundColor: themeColor.brandSuccess
    },
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: platform === PLATFORM.IOS ? 5 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    minHeight: 50,
    'NativeBase.Text': {
      color: '#fff',
      flex: 1
    },
    'NativeBase.Button': {
      backgroundColor: 'transparent',
      height: 30,
      elevation: 0,
      'NativeBase.Text': {
        fontSize: 14
      }
    }
  };

  return toastTheme;
};
