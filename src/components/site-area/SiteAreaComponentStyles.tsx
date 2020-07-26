import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      backgroundColor: themeColor.headerBgColor
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '80%',
    },
    subHeaderContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '25@s',
      paddingRight: '5@s',
      paddingLeft: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
    },
    address: {
      width: '80%',
      color: themeColor.headerTextColor,
    },
    headerName: {
      marginLeft: '10@s',
      fontSize: '20@s',
      fontWeight: 'bold',
      color: themeColor.headerTextColor
    },
    connectorContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: '12@s',
      paddingBottom: '12@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.brandPrimaryDark
    },
    icon: {
      fontSize: '30@s',
      color: themeColor.headerTextColor
    },
    iconLeft: {
      marginLeft: '10@s',
    },
    iconRight: {
      marginRight: '10@s',
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
      color: themeColor.textColor,
      marginTop: '-15@s',
      marginRight: '10@s',
      fontSize: '20@s'
    },
    connectorBadge: {
      marginTop: '5@s'
    },
    freeConnectorBadge: {
      backgroundColor: themeColor.brandInfo
    },
    occupiedConnectorBadge: {
      backgroundColor: themeColor.brandDanger
    },
    connectorBadgeTitle: {
      minWidth: '35@s',
      textAlign: 'center',
      fontSize: '25@s',
      paddingTop: Platform.OS === 'ios' ? '3@s' : 0,
      paddingBottom: Platform.OS === 'ios' ? '3@s' : 0,
      fontWeight: 'bold',
      color: themeColor.textColor
    },
    connectorSubTitle: {
      fontSize: '15@s',
      paddingBottom: '5@s',
      marginTop: '5@s',
      marginBottom: '5@s',
      marginLeft: '10@s',
      marginRight: '10@s',
      color: themeColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
