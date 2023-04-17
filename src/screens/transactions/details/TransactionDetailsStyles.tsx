import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    viewContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    backgroundImage: {
      width: '100%',
      height: '125@s'
    },
    transactionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent'
    },
    headerContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.headerBgColor
    },
    headerRowContainer: {
      width: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    headerName: {
      color: commonColor.headerTextColor,
      fontSize: '18@s',
      marginLeft: '5@s',
      marginRight: '5@s',
      fontWeight: 'bold'
    },
    subHeaderName: {
      color: commonColor.headerTextColor,
      fontSize: '14@s',
      marginLeft: '5@s',
      marginRight: '5@s'
    },
    subSubHeaderName: {
      color: commonColor.headerTextColor,
      fontSize: '12@s',
      marginLeft: '5@s',
      marginRight: '5@s'
    },
    scrollViewContainer: {
      flexDirection: 'column',
      paddingTop: '10@s'
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '100@s'
    },
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50%',
      height: '100@s',
      paddingHorizontal: '5@s'
    },
    connectorLetter: {
      marginTop: '5@s',
      marginBottom: '5@s'
    },
    label: {
      fontSize: '16@s',
      alignSelf: 'center',
      color: commonColor.textColor
    },
    labelValue: {
      fontSize: '25@s',
      fontWeight: 'bold',
      color: commonColor.textColor
    },
    labelUser: {
      fontSize: '11@s',
      paddingTop: '5@s',
      color: commonColor.textColor
    },
    subLabel: {
      fontSize: '10@s',
      marginTop: Platform.OS === 'ios' ? '0@s' : '-5@s',
      color: commonColor.textColor,
      alignSelf: 'center'
    },
    subLabelStatusError: {
      color: commonColor.danger,
      marginTop: '2@s'
    },
    subLabelUser: {
      fontSize: '8@s',
      marginTop: '0@s',
      color: commonColor.textColor
    },
    icon: {
      fontSize: '25@s',
      color: commonColor.textColor
    },
    userImage: {
      height: '52@s',
      width: '52@s',
      alignSelf: 'center',
      marginBottom: '5@s',
      borderRadius: '26@s',
      borderWidth: '3@s',
      borderColor: commonColor.textColor
    },
    info: {
      color: commonColor.textColor,
      borderColor: commonColor.brandPrimaryDark
    },
    success: {
      color: commonColor.success
    },
    warning: {
      color: commonColor.warning
    },
    danger: {
      color: commonColor.danger
    },
    disabled: {
      color: commonColor.disabled,
      borderColor: commonColor.buttonDisabledBg
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
