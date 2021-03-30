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
      backgroundColor: commonColor.containerBgColor
    },
    toolBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: commonColor.textColor,
      borderRadius: 1,
      height: '40@s',
      padding: '5@s'
    },
    tenantNameView: {
      paddingTop: '15@s',
      backgroundColor: commonColor.containerBgColor,
      height: '50@s'
    },
    tenantNameText: {
      color: commonColor.textColor,
      fontSize: '16@s',
      textAlign: 'center'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '20@s'
    },
    trashIconButton: {
      alignSelf: 'flex-end',
      height: '50@s'
    },
    trashIcon: {
      color: 'white'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
