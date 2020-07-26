import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../theme/variables/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    noDisplay: {
      flex: 1,
      backgroundColor: themeColor.containerBgColor
    },
    container: {
      flex: 1,
      backgroundColor: themeColor.containerBgColor
    },
    keyboardContainer: {
      flex: 1
    },
    scrollContainer: {
      minHeight: '90%'
    },
    header: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    logo: {
      resizeMode: 'contain',
      marginTop: '10@s',
      height: '100@s'
    },
    appText: {
      color: themeColor.textColor,
      fontSize: '40@s',
      fontWeight: 'bold',
      paddingTop: '5@s'
    },
    appVersionText: {
      color: themeColor.textColor,
      fontSize: '15@s'
    },
    appTenant: {
      color: themeColor.textColor,
      marginTop: '20@s',
      fontSize: '15@s',
      alignSelf: 'center',
    },
    appTenantName: {
      color: themeColor.textColor,
      marginTop: '5@s',
      marginBottom: '5@s',
      fontSize: '15@s',
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    formErrorTextEula: {
      alignSelf: 'center',
      marginLeft: 0,
      textDecorationLine: 'none'
    },
    eulaLink: {
      fontSize: '13@s',
      color: themeColor.textColor,
      textDecorationLine: 'underline'
    },
    linksButton: {
      alignSelf: 'center',
      marginBottom: '15@s',
    },
    linksTextButton: {
      fontSize: '13@s',
      fontWeight: 'bold',
      color: themeColor.textColor
    },
    createOrgButton: {
      backgroundColor: themeColor.brandSuccess
    },
    restoreOrgButton: {
      backgroundColor: themeColor.brandWarning
    },
    deleteOrgButton: {
      backgroundColor: themeColor.brandDanger
    },
    fab: {
      backgroundColor: themeColor.brandDisabledDark
    },
    footer: {
      backgroundColor: themeColor.containerBgColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
