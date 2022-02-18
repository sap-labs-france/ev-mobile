import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'column',
      maxHeight: '100%'
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
      width: '70%',
      paddingRight: '5%'
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
      color: commonColor.textColor,
      fontSize: '12@s',
      flex: 1
    },
    distance: {
      color: commonColor.textColor
    },
    headerName: {
      marginLeft: '5@s',
      fontSize: '20@s',
      fontWeight: 'bold',
      color: commonColor.headerTextColor
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: '10@s',
      width: '30%'
    },
    icon: {
      fontSize: '30@s',
      color: commonColor.headerTextColor
    },
    iconLeft: {
      marginLeft: '10@s',
      fontSize: '30@s'
    },
    iconRight: {
      marginRight: '10@s'
    },
    iconLocation: {
      marginTop: '5@s'
    },
    settingsIcon: {
      fontSize: '30@s'
    },
    heartbeatIcon: {
      color: commonColor.success,
      paddingLeft: '20@s',
      fontSize: '25@s'
    },
    deadHeartbeatIcon: {
      color: commonColor.danger,
      paddingLeft: '20@s',
      fontSize: '25@s'
    },
    connectorsContent: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 'auto'
    },
    connectorsContainer: {
      flexGrow: 0,
      width: '100%'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
