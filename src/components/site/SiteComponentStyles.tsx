import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    siteContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    siteContent: {
      flex: 1,
      justifyContent: 'space-between',
      padding: '10@s',
      alignItems: 'flex-start'
    },
    statusIndicator: {
      height: '100%',
      width: '5@s',
      borderTopLeftRadius: '8@s',
      borderBottomLeftRadius: '8@s'
    },
    statusNotAvailable: {
      backgroundColor: commonColor.danger
    },
    statusAvailableSoon: {
      backgroundColor: commonColor.warning
    },
    statusAvailable: {
      backgroundColor: commonColor.success
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    subTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      paddingVertical: '3@s',
      width: '100%'
    },
    address: {
      color: commonColor.headerTextColor,
      fontSize: '13@s',
      flex: 1,
      marginRight: '10@s'
    },
    distance: {
      color: commonColor.textColor,
      fontSize: '13@s',
      justifyContent: 'flex-end'
    },
    headerName: {
      marginLeft: '5@s',
      fontSize: '16@s',
      fontWeight: 'bold',
      color: commonColor.headerTextColor
    },
    connectorContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: '12@s'
    },
    icon: {
      color: commonColor.headerTextColor
    },
    arrowIcon: {
      fontSize: '18@s',
      color: commonColor.disabledDark
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
