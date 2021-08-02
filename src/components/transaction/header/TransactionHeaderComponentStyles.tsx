import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      width: '100%',
      flexDirection: 'column'
    },
    transactionTimestamp: {
      color: commonColor.headerTextColor,
      fontSize: '18@s',
      fontWeight: 'bold'
    },
    subHeaderName: {
      paddingTop: '2@s',
      color: commonColor.headerTextColor
    },
    chargingStationName: {
      fontSize: '16@s'
    },
    userFullName: {
      fontSize: '13@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
