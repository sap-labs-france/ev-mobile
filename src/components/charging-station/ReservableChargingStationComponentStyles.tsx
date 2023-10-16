import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    selected: {
      backgroundColor: commonColor.listItemSelected
    },
    unselected: {
      backgroundColor: commonColor.listHeaderBgColor
    },
    chargingStationContainer: {
      height: '90@s',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      margin: 0,
      padding: '5@s'
    },
    contentContainer: {
      height: '100%',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingVertical: '5@s',
      flex: 1
    },
    evIconContainer: {
      marginLeft: '20@s',
      height: '100%',
      paddingRight: '20@s',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '13@s'
    },
    title: {
      fontSize: '14@s',
      width: '100%',
      fontWeight: 'bold'
    },
    bottomLine: {
      flexDirection: 'row',
      alignItems: 'flex-start'
    },
    evStationIcon: {
      color: commonColor.success,
      paddingLeft: '20@s',
      fontSize: '25@s'
    },
    deadEvStationIcon: {
      color: commonColor.danger,
      paddingLeft: '20@s',
      fontSize: '25@s'
    },
    defaultContainer: {
      borderRadius: '2@s',
      justifyContent: 'center',
      marginRight: '5@s',
      marginTop: '5@s'
    },
    defaultText: {
      fontSize: '10@s',
      color: commonColor.light,
      paddingHorizontal: '3@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
