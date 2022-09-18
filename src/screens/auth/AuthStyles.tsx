import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    noDisplay: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor,
      paddingTop: getStatusBarHeight() + scale(10),
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
      justifyContent: 'space-evenly',
      alignItems: 'center',
      margin: '10@s'
    },
    logo: {
      width: '90%',
      height: '100@s',
      resizeMode: 'contain'
    },
    appText: {
      color: commonColor.textColor,
      fontSize: '30@s',
      fontWeight: 'bold'
    },
    appVersionText: {
      color: commonColor.textColor,
      alignSelf: 'center',
      fontSize: '15@s'
    },
    appTenant: {
      color: commonColor.textColor,
      fontSize: '15@s',
      alignSelf: 'center'
    },
    appTenantName: {
      color: commonColor.textColor,
      marginTop: '5@s',
      marginBottom: '5@s',
      fontSize: '15@s',
      fontWeight: 'bold',
      alignSelf: 'center'
    },
    formLogin: {
      marginTop: '15@s'
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
      width: '90%',
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: commonColor.buttonBg,
      padding: '10@s',
    },
    linksFooterButton: {
      width: '90%',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: '5@s',
    },
    linkNewUserButton: {
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
      backgroundColor: commonColor.buttonBg
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
