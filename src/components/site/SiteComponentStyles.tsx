import deepmerge from 'deepmerge';
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
      borderBottomColor: themeColor.listBorderColor,
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '40@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.listBorderColor,
      backgroundColor: themeColor.brandBackground,
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
    headerName: {
      marginLeft: '10@s',
      fontSize: '20@s',
      fontWeight: 'bold',
      color: themeColor.headerTextColor
    },
    address: {
      width: '80%',
      color: themeColor.headerTextColor,
    },
    connectorContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: '12@s',
      paddingBottom: '12@s',
      borderBottomWidth: 1,
      borderBottomColor: themeColor.brandPrimaryDark,
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
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
