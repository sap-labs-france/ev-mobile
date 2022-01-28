import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../../utils/Utils';
import { moderateScale } from 'react-native-size-matters';
import { PLATFORM } from '../../../../theme/variables/commonColor';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    rowFilterContainer: {
      flexDirection: 'row',
      width: '100%',
      height: '35@s',
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
      transform: Platform.OS === PLATFORM.IOS ? [] : [{ scaleX:  moderateScale(1, 3.5) }, { scaleY: moderateScale(1, 3.5) }]
    },
    connectorTypeFilterContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%'
    },
    connectorContainer: {
      width: '80@s',
      borderWidth: 0.8,
      padding: '2@s',
      height: '80@s',
      borderColor: commonColor.textColor,
      borderRadius: '8@s',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '10@s'
    },
    selectedConnectorContainer: {
      borderWidth: 3.5
    },
    connectorLabel: {
      fontSize: '12@s',
      color: commonColor.textColor
    },
    connectorTypeButton: {
      width: '50@s',
      height: '50@s'
    },
    connectorTypeSVG: {
      width: '40@s',
      height: '40@s'
    },
    transactionsInProgressUserSwitchContainer: {
      marginLeft: '5@s',
      marginVertical: '10@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
