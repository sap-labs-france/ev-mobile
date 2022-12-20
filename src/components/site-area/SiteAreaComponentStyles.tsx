import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    siteAreaContainer: {
      justifyContent: 'space-between',
      flexDirection: 'row'
    },
    siteAreaContent: {
      flex: 1,
      justifyContent: 'space-between',
      padding: '10@s',
      alignItems: 'center',
    },
    statusIndicator: {
      height: '100%',
      width: '5@s',
      borderTopLeftRadius: '8@s',
      borderBottomLeftRadius: '8@s'
    },
    statusNotAvailable: {
      backgroundColor: commonColor.brandDanger
    },
    statusAvailableSoon: {
      backgroundColor: commonColor.brandWarning
    },
    statusAvailable: {
      backgroundColor: commonColor.brandSuccess
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
      paddingVertical: '3@s'
    },
    address: {
      color: commonColor.headerTextColor,
      fontSize: '13@s',
      flex: 1,
      marginRight: '10@s'
    },
    distance: {
      color: commonColor.textColor,
      fontSize: '13@s'
    },
    headerName: {
      marginLeft: '5@s',
      width: '90%',
      fontSize: '16@s',
      fontWeight: 'bold',
      color: commonColor.headerTextColor
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
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
      color: commonColor.disabledDark,
      marginLeft: '20@s'
    },
    iconHidden: {
      opacity: 0
    },
    detailedContent: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    badgeContainer: {
      paddingTop: '5@s',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    badgeSuccessContainer: {},
    badgeOccupiedContainer: {},
    connectorText: {
      color: commonColor.textColor,
      marginTop: '-15@s',
      marginRight: '10@s',
      fontSize: '20@s'
    },
    connectorBadge: {
      marginTop: '5@s'
    },
    freeConnectorBadge: {
      backgroundColor: commonColor.brandInfo
    },
    occupiedConnectorBadge: {
      backgroundColor: commonColor.brandDanger
    },
    connectorBadgeTitle: {
      minWidth: '35@s',
      textAlign: 'center',
      fontSize: '25@s',
      paddingTop: Platform.OS === 'ios' ? '3@s' : 0,
      paddingBottom: Platform.OS === 'ios' ? '3@s' : 0,
      fontWeight: 'bold',
      color: commonColor.textColor
    },
    connectorSubTitle: {
      fontSize: '15@s',
      paddingBottom: '5@s',
      marginTop: '5@s',
      marginBottom: '5@s',
      marginLeft: '10@s',
      marginRight: '10@s',
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
