import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    content: {
      flex: 1,
      width: '100%'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    addPaymentMethodButton: {
      width: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '25@s'
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
    trashIconButton: {
      height: '100%',
      width: '80@s',
      backgroundColor: commonColor.brandDanger,
      justifyContent: 'center',
      alignItems: 'center'
    },
    trashIcon: {
      color: 'white',
      fontSize: '20@s'
    },
    swiperContainer: {
      width: '100%'
    },
    swiperChildrenContainer: {
      backgroundColor: commonColor.containerBgColor,
      width: '100%'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
