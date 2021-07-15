import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

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
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    logo: {
      width: '75%',
      height: '100@s',
      marginTop: '10@s',
      resizeMode: 'contain'
    },
    appText: {
      color: commonColor.textColor,
      fontSize: '35@s',
      fontWeight: 'bold',
      marginTop: '15@s'
    },
    appVersionText: {
      color: commonColor.textColor,
      alignSelf: 'center',
      fontSize: '15@s'
    },
    appTenant: {
      color: commonColor.textColor,
      marginTop: '20@s',
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
