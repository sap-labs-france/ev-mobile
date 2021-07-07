import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      width: '97%',
      alignSelf: 'center',
      borderColor: 'transparent',
      backgroundColor: commonColor.listHeaderBgColor,
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62,
      elevation: 11,
      marginBottom: '8@s'
    },
    siteAreaContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      backgroundColor: commonColor.listHeaderBgColor,
      flexDirection: 'row',
      margin: 0,
      flex: 1,
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0
    },
    siteAreaContainer: {
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
      height: '100%',
      flex: 1
    },
    rightContainer: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'center',
      width: '20@s',
      height: '100%'
    },
    statusIndicator: {
      height: '100%',
      width: '5@s'
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
      alignItems: 'center',
      width: '100%',
      paddingRight: '5@s',
      paddingLeft: '5@s'
    },
    address: {
      color: commonColor.headerTextColor,
      width: '80%',
      fontSize: '13@s'
    },
    headerName: {
      marginLeft: '5@s',
      width: '90%',
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
      fontSize: '30@s',
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
