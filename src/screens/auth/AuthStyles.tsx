import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    noDisplay: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    container: {
      height: '100%',
      backgroundColor: commonColor.containerBgColor,
      paddingTop: getStatusBarHeight() + scale(10),
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    applicationTitle: {
      fontSize: scale(35),
      color: commonColor.textColor,
      fontWeight: 'bold'
    },
    tenantSelectionContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: scale(20)
    },
    tenantName: {
      fontSize: scale(15),
      color: commonColor.textColor,
      textAlign: 'right'
    },
    dropdownIcon: {
      color: commonColor.textColor
    },
    loginFormContainer: {
      width: '100%',
      alignItems: 'center'
    },
    forgotPasswordContainer: {
      width: '90%',
      alignItems: 'flex-end',
      marginTop: scale(5)
    },
    forgotPasswordText: {
      fontSize: scale(12),
      color: commonColor.textColor
    },
    buttonSeparatorLine: {
      width: '50%',
      borderTopWidth: 0.5,
      borderTopColor: commonColor.disabledDark,
      marginVertical: scale(20)
    },
    appVersionText: {
      fontSize: scale(10),
      color: commonColor.textColor,
      width: '90%',
      textAlign: 'right',
      paddingVertical: scale(5)
    },
    keyboardContainer: {
      flex: 1
    },
    scrollContainer: {
      height: '100%',
      width: '100%'
    },
    header: {
     // flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    tenantLogoContainer: {
      padding: scale(10)
    },
    tenantLogo: {
      height: scale(50),
      width: scale(100),
      resizeMode: 'contain'
    },
    appText: {
      color: commonColor.textColor,
      fontSize: '26@s',
      fontWeight: 'bold'
    },
    appTenant: {
      color: commonColor.textColor,
      marginTop: '20@s',
      fontSize: '15@s',
      alignSelf: 'center'
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
      marginBottom: '15@s'
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
      backgroundColor: commonColor.buttonBg
    },
    fabIcon: {
      color: commonColor.textColor
    },
    footer: {
      backgroundColor: commonColor.containerBgColor
    },
    qrCodeContainer: {
      marginBottom: '15@s',
      marginLeft: '15@s',
      width: '50@s'
    },
    qrCodeButton: {
      width: '50@s',
      height: '50@s',
      borderRadius: '35@s',
      backgroundColor: commonColor.buttonBg,
      justifyContent: 'center',
      alignItems: 'center'
    },
    qrCodeIcon: {
      fontSize: '25@s',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    qrCodeContainer: {
      marginTop: '5%'
    }
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
