import deepmerge from 'deepmerge';
import {StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../../utils/Utils';
import { moderateScale } from 'react-native-size-matters';


export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    rowFilterContainer: {
      flexDirection: 'row',
      width: '100%',
      height: '35@s',
      paddingLeft: '15@s',
      paddingRight: '15@s',
      alignItems: 'center'
    },
    columnFilterContainer: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      height: '100@s',
      alignItems: 'center'
    },
    rowFilterWithBorder: {
      borderTopWidth: 1,
      borderTopColor: commonColor.listBorderColor
    },
    textFilter: {
      fontSize: '15@s',
      color: commonColor.textColor,
      marginRight: '20@s'
    },
    label: {
      fontWeight: 'bold'
    },
    filterValue: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    switchFilter: {
      color: commonColor.textColor,
      transform: [{ scaleX:  moderateScale(1, 2.5) }, { scaleY:
          moderateScale(1, 2.5) }]
    },
    connectorTypeFilterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%'
    },
    connectorTypeButton: {
      width: '50@s',
      height: '50@s'
    },
    connectorTypeSVG: {
      width: '40@s',
      height: '40@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
