import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
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
      backgroundColor: themeColor.headerBgColorLight
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '70%',
    },
    subHeaderContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '25@s',
      paddingRight: '5@s',
      paddingLeft: '5@s',
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
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    button: {
    },
    buttonRight: {
      marginRight: '10@s',
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
    iconLocation: {
      marginTop: '5@s',
    },
    iconSettings: {
      marginTop: Platform.OS === 'ios' ? '-3@s' : 0,
    },
    heartbeatIcon: {
      color: themeColor.success,
      paddingLeft: '20@s',
      fontSize: '18@s'
    },
    deadHeartbeatIcon: {
      color: themeColor.danger,
      paddingLeft: '20@s',
      fontSize: '18@s'
    },
    connectorsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
