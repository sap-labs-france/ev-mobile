import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export function computeActionSheetStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const actionSheetStyles = ScaledSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0.4,
      backgroundColor: commonColor.disabled
    },
    wrapper: {
      flex: 1,
      flexDirection: 'row'
    },
    body: {
      flex: 1,
      alignSelf: 'flex-end',
      backgroundColor: commonColor.containerBgColor
    },
    titleBox: {
      height: '40@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    titleText: {
      color: commonColor.placeholderTextColor,
      fontSize: '16@s'
    },
    messageBox: {
      height: '30@s',
      paddingLeft: '10@s',
      paddingRight: '10@s',
      paddingBottom: '10@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    messageText: {
      color: commonColor.disabled,
      fontSize: '12@s'
    },
    buttonBox: {
      height: '45@s',
      marginTop: 0,
      alignItems: 'center',
      justifyContent: 'center',
      color: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor
    },
    buttonText: {
      fontSize: '20@s'
    },
    cancelButtonBox: {
      height: '40@s',
      marginTop: '6@s',
      marginBottom: Platform.OS === 'ios' ? '15@s' : '10@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    }
  });
  return actionSheetStyles;
};

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
      width: '75%',
      height: '100@s',
      marginTop: '10@s',
      resizeMode: 'contain',
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
      color: commonColor.textColor,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    qrCodeContainer: {
      marginTop: '5%',
    }
  };
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
};
