import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    cluster: {
      backgroundColor: commonColor.listItemBackground,
      padding: '10@s',
      width: '50@s',
      height: '50@s',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50@s',
      borderWidth: 2,
      borderColor: commonColor.mapClusterBorder,
      zIndex: 1
    },
    text: {
      fontSize: '15@s',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
