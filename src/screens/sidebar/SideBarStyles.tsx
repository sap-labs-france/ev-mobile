import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import { PLATFORM } from '../../theme/variables/commonColor';
import Utils from '../../utils/Utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    sidebar: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor,
      paddingVertical: '10@s',
      paddingTop: getStatusBarHeight() + scale(10),
      alignItems: 'center'
    },
    header: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    border: {
      width: '70%',
      borderTopWidth: 0.8,
      borderColor: commonColor.disabledDark,
      marginVertical: '15@s'
    },
    background: {
      flex: 1
    },
    drawerContent: {
      height: 'auto',
      paddingHorizontal: '10@s'
    },
    linkContainer: {
      paddingTop: '10@s'
    },
    logo: {
      resizeMode: 'contain',
      width: '90%',
      height: '50@s',
      alignSelf: 'center',
      margin: '5@s',
      marginBottom: '10@s'
    },
    tenantName: {
      color: commonColor.textColor,
      fontSize: '13@s',
      margin: '2@s',
      alignSelf: 'center',
      textAlign: 'center',
      width: '90%'
    },
    versionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    newVersionContainer: {
      height: '25@s',
      padding: '5@s',
      paddingLeft: '10@s',
      paddingRight: '10@s',
      margin: '5@s',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: commonColor.primary,
      marginBottom: Platform.OS === PLATFORM.IOS ? '10@s' : 0,
      borderRadius: '3@s',
    },
    newVersionText: {
      fontSize: '12@s',
      color: commonColor.light
    },
    newVersionIcon: {
      fontSize: '15@s',
      paddingRight: '5@s',
      color: commonColor.light
    },
    versionText: {
      color: commonColor.textColor,
      fontSize: '12@s',
      margin: '2@s',
      alignSelf: 'center',
      fontWeight: 'bold',
    },
    versionDate: {
      color: commonColor.textColor,
      fontSize: '14@s',
      alignSelf: 'center',
      marginTop: '-5@s',
      marginBottom: '2@s'
    },
    links: {
      borderBottomWidth: 0,
      paddingTop: '13@s',
      paddingBottom: '13@s'
    },
    focused: {
      opacity: 0.7,
      borderTopEndRadius: '8@s',
      borderBottomEndRadius: '8@s'
    },
    linkIcon: {
      fontSize: '22@s',
      color: commonColor.textColor
    },
    linkText: {
      color: commonColor.textColor,
      fontSize: '16@s',
      paddingLeft: '15@s'
    },
    bottomContainer: {
      paddingHorizontal: '10@s',
      flexDirection: 'row',
      marginTop: '5@s',
      paddingVertical: '10@s',
      backgroundColor: commonColor.listItemBackground
    },
    columnAccount: {
      flexDirection: 'column',
      flexGrow: 2,
      flex: 1
    },
    buttonLogout: {
      alignSelf: 'flex-start',
      backgroundColor: 'transparent'
    },
    logoutText: {
      fontSize: '14@s',
      color: commonColor.primary,
      paddingVertical: '3@s'
    },
    userName: {
      paddingTop: '5@s',
      fontSize: '14@s',
      color: commonColor.textColor
    },
    columnThumbnail: {
      flex: 1,
      flexDirection: 'column'
    },
    buttonThumbnail: {
      alignSelf: 'flex-end'
    },
    profilePic: {
      width: '40@s',
      height: '40@s',
      borderRadius: '20@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
