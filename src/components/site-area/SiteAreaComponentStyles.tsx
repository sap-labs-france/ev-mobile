import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
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
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40@s',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.listHeaderBgColor
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '80%'
    },
    subHeaderContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '25@s',
      paddingRight: '5@s',
      paddingLeft: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor
    },
    address: {
      color: commonColor.headerTextColor,
      fontSize: '12@s'
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
      paddingBottom: '12@s',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.brandPrimaryDark
    },
    icon: {
      fontSize: '30@s',
      color: commonColor.headerTextColor
    },
    arrowIcon: {
      fontSize: '30@s'
    },
    iconLeft: {
      marginLeft: '10@s'
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
