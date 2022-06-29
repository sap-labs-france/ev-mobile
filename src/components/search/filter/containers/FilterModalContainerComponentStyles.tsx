import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../../utils/Utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modal: {
      width: '100%',
      height: '100%',
      margin: 0
    },
    modalContent: {
      width: '100%',
      height: '100%',
      padding: '5@s',
      paddingHorizontal: '10@s',
      paddingTop: getStatusBarHeight() + scale(10),
      alignItems: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    closeIcon: {
      color: commonColor.textColor,
      fontSize: '37@s'
    },
    buttonsContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginTop: '20@s'
    },
    buttonContainer: {
      width: '48%',
      borderRadius: '8@s'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginBottom: '40@s'
    },
    title: {
      color: commonColor.textColor,
      fontSize: '22@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
