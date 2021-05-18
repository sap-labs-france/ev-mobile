import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    modalTitle: {
      textAlign: 'center',
      color: commonColor.textColor,
      paddingTop: '10@s',
      fontSize: '15@s'
    },
    cardFieldContainer: {
      height: '50@s',
      width: '100%',
      marginTop: '50@s',
      color: commonColor.textColor,
      alignSelf: 'center'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    },
    button: {
      marginTop: '30@s',
      alignSelf: 'center',
      width: '30%',
      marginBottom: '10@s',
      borderRadius: '20@s'
    },
    buttonDisabled: {
      backgroundColor: commonColor.brandDisabled,
      opacity: 0.3
    },
    buttonEnabled: {
      backgroundColor: commonColor.buttonBg
    },
    buttonText: {
      color: commonColor.textColor,
      padding: '5@s',
      opacity: 1
    },
    spinner: {
      color: commonColor.brandDisabledDark
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
