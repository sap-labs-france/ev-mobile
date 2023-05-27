import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      height: '100%',
      backgroundColor: commonColor.containerBgColor,
      alignItems: 'center'
    },
    scrollView: {
      width: '100%',
      flex: 1
    },
    scrollViewContentContainer: {
      flexGrow: 1,
      width: '100%',
      alignItems: 'center',
      paddingVertical: '5@s'
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    applicationTitle: {
      fontSize: scale(35),
      color: commonColor.textColor,
      fontWeight: 'bold'
    },
    tenantSelectionContainer: {
      maxWidth: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: scale(20)
    },
    tenantName: {
      fontSize: scale(15),
      color: commonColor.textColor,
      textAlign: 'left',
      flexShrink: 1
    },
    dropdownIcon: {
      color: commonColor.textColor,
      width: '30@s'
    },
    forgotPasswordContainer: {
      alignItems: 'flex-end',
      marginTop: scale(5),
      height: '30@s',
      marginRight: '5%',
      alignSelf: 'flex-end'
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
    appVersionTextContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '100%'
    },
    appVersionText: {
      fontSize: scale(10),
      color: commonColor.textColor,
      width: '95%',
      textAlign: 'right',
      paddingVertical: scale(5)
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 1
    },
    tenantLogo: {
      height: scale(50),
      width: scale(100),
      resizeMode: 'contain'
    },
    eulaLink: {
      fontSize: '13@s',
      color: commonColor.textColor,
      textDecorationLine: 'underline'
    },
    checkboxContainer: {
      justifyContent: 'center',
      marginBottom: '15@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
