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
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      padding: '5@s',
      alignItems: 'center',
      height: '100%'
    },
    leftContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flex: 1
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      width: '20@s'
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
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%'
    },
    subTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      width: '100%',
      paddingRight: '5@s',
      paddingLeft: '5@s'
    },
    address: {
      color: commonColor.headerTextColor,
      fontSize: '13@s',
      width: '85%'
    },
    distance: {
      color: commonColor.textColor,
      fontSize: '13@s'
    },
    headerName: {
      marginLeft: '5@s',
      fontSize: '20@s',
      fontWeight: 'bold',
      color: commonColor.headerTextColor
    },
    connectorContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: '12@s',
      paddingBottom: '12@s'
    },
    icon: {
      color: commonColor.headerTextColor
    },
    arrowIcon: {
      fontSize: '30@s'
    },
    iconLeft: {
      fontSize: '30@s'
    },
    iconRight: {
      marginRight: '10@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
