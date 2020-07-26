import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'stretch',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'transparent',
      borderTopColor: themeColor.listBorderColor
    },
    connectorContainer: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%'
    },
    connectorDetailContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      paddingTop: '10@s',
      paddingBottom: '10@s'
    },
    connectorDetail: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60@s',
      width: '80@s',
      color: themeColor.textColor
    },
    connectorDetailAnimated: {
      position: 'absolute',
      alignItems: 'center'
    },
    connectorValues: {
      color: themeColor.textColor,
      marginTop: '-1@s',
      fontSize: '30@s',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    connectorSVG: {
      width: '40@s',
      height: '40@s'
    },
    labelImage: {
      color: themeColor.textColor,
      paddingTop: '2@s',
      fontSize: '10@s'
    },
    label: {
      color: themeColor.textColor,
      fontSize: '10@s',
      marginTop: '-3@s'
    },
    subLabel: {
      color: themeColor.textColor,
      fontSize: '9@s'
    },
    icon: {
      fontSize: '30@s',
      color: themeColor.textColor,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
