import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import Utils from '../../utils/Utils';

export default function computeStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    noDisplay: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
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
      color: commonColor.textColor,
      fontSize: '40@s',
      fontWeight: 'bold',
      paddingTop: '5@s'
    },
    appVersionText: {
      color: commonColor.textColor,
      fontSize: '15@s'
    },
    appTenant: {
      color: commonColor.textColor,
      marginTop: '20@s',
      fontSize: '15@s',
      alignSelf: 'center',
    },
    appTenantName: {
      color: commonColor.textColor,
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
      color: commonColor.textColor,
      textDecorationLine: 'underline'
    },
    linksButton: {
      alignSelf: 'center',
      marginBottom: '15@s',
    },
    linksTextButton: {
      fontSize: '13@s',
      fontWeight: 'bold',
      color: commonColor.textColor
    },
    createOrgButton: {
      backgroundColor: commonColor.brandSuccess
    },
    restoreOrgButton: {
      backgroundColor: commonColor.brandWarning
    },
    deleteOrgButton: {
      backgroundColor: commonColor.brandDanger
    },
    fab: {
      backgroundColor: commonColor.buttonBg,
    },
    fabIcon: {
      color: commonColor.textColor
    },
    footer: {
      backgroundColor: commonColor.containerBgColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
