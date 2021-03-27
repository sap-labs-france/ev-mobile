import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      height: '100%',
      backgroundColor: commonColor.containerBgColor
    },

    qrCodeContainer: {
      justifyContent: 'center',
      paddingTop: '10@s',
      paddingLeft: '4@s',
      flex: 0.2,
    },

    qrCodeTouchableOpacity: {
      marginBottom: '15@s',
      marginLeft: '10@s',
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
    },

    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    tabHeader: {}
  });
  const portraitStyles = {};
  const landscapeStyles = {
    qrCodeContainer: {
      marginTop: '3%',
      paddingTop: '2%',
      paddingLeft: '5%'
    },
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
