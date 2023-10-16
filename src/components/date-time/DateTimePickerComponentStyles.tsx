import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    dateTimeContainer: {
      height: '90@s',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      margin: 0,
      padding: '5@s'
    },
    dateContainer: {
      height: '70@s',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      margin: 0,
      padding: '5@s'
    },
    timeContainer: {
      height: '60@s',
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
      width: '100%'
    },
    calendarIconContainer: {
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
      alignItems: 'center',
      width: '100%'
    },
    defaultDateIcon: {
      color: commonColor.disabled
    },
    validDateIcon: {
      color: commonColor.success
    },
    invalidDateIcon: {
      color: commonColor.danger
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
