import ThemeColor, { PLATFORM } from '../variables/ThemeColor';

export default (themeColor: ThemeColor) => {
  const platform = themeColor.platform;

  const segmentTheme: any = {
    height: 45,
    borderColor: themeColor.segmentBorderColorMain,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: themeColor.segmentBackgroundColor,
    'NativeBase.Button': {
      alignSelf: 'center',
      borderRadius: 0,
      paddingTop: 3,
      paddingBottom: 3,
      height: 30,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderColor: themeColor.segmentBorderColor,
      elevation: 0,
      '.active': {
        backgroundColor: themeColor.segmentActiveBackgroundColor,
        'NativeBase.Text': {
          color: themeColor.segmentActiveTextColor
        },
        'NativeBase.Icon': {
          color: themeColor.segmentActiveTextColor
        }
      },
      '.first': {
        borderTopLeftRadius: platform === PLATFORM.IOS ? 5 : undefined,
        borderBottomLeftRadius: platform === PLATFORM.IOS ? 5 : undefined,
        borderLeftWidth: 1
      },
      '.last': {
        borderTopRightRadius: platform === PLATFORM.IOS ? 5 : undefined,
        borderBottomRightRadius: platform === PLATFORM.IOS ? 5 : undefined
      },
      'NativeBase.Text': {
        color: themeColor.segmentTextColor,
        fontSize: 14
      },
      'NativeBase.Icon': {
        fontSize: 22,
        paddingTop: 0,
        color: themeColor.segmentTextColor
      }
    }
  };

  return segmentTheme;
};
