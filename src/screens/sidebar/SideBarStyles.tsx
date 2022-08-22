import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import { PLATFORM } from '../../theme/variables/commonColor';
import Utils from '../../utils/Utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Color from 'color';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const borderColor = Color(commonColor.disabledDark).alpha(0.38).toString();
  const commonStyles = ScaledSheet.create({
    container: {
      paddingTop: getStatusBarHeight() + scale(10),
      backgroundColor: commonColor.containerBgColor
    },
    sidebar: {
      backgroundColor: commonColor.listItemBackground,
      alignItems: 'center',
      justifyContent: 'center'
    },
    header: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: commonColor.containerBgColor,
      paddingHorizontal: '10@s',
      paddingBottom: '5@s',
      width: '100%',
      borderBottomWidth: 0.8,
      borderColor
    },
    sidebarSection: {
      borderColor,
      borderBottomWidth: 0.8,
      paddingVertical: '2@s'
    },
    tenantContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    safeArea:{
      width: '100%'
    },
    background: {
      flex: 1
    },
    drawerContent: {
      width: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    linkContainer: {
      marginBottom: '10@s',
      flex: 1
    },
    logo: {
      resizeMode: 'contain',
      width: '30%',
      height: '60@s',
      marginLeft: '8@s'
    },
    tenantName: {
      color: commonColor.textColor,
      fontSize: '13@s',
      marginLeft: '10@s',
      flex: 1
    },
    versionContainer: {
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      marginTop: '5@s'
    },
    newVersionContainer: {
      paddingLeft: '5@s',
      paddingRight: '5@s',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: commonColor.primary,
      marginBottom: Platform.OS === PLATFORM.IOS ? '10@s' : 0,
      borderRadius: '3@s',
    },
    newVersionText: {
      fontSize: '9@s',
      color: commonColor.light
    },
    newVersionIcon: {
      fontSize: '10@s',
      paddingRight: '5@s',
      color: commonColor.light
    },
    versionText: {
      color: commonColor.textColor,
      fontSize: '10@s',
      textAlign: 'right',
      paddingHorizontal: '5@s'
    },
    links: {
      borderBottomWidth: 0,
      paddingTop: '13@s',
      paddingBottom: '13@s',
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: '20@s',
    },
    focused: {
      opacity: 0.7,
      borderTopEndRadius: '8@s',
      borderBottomEndRadius: '8@s'
    },
    linkText: {
      color: commonColor.textColor,
      fontSize: '14@s',
      marginLeft: '22@s',
      opacity: 1
    },
    bottomContainer: {
      paddingHorizontal: '10@s',
      flexDirection: 'row',
      marginTop: '10@s',
      paddingVertical: '15@s',
      backgroundColor: commonColor.listItemBackground
    },
    rightContainer: {
      flexDirection: 'column',
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginLeft: '20@s'
    },
    logoutContainer: {
      alignSelf: 'flex-start',
      backgroundColor: 'transparent'
    },
    logoutText: {
      fontSize: '13@s',
      color: commonColor.primary,
      paddingVertical: '3@s'
    },
    userName: {
      paddingTop: '5@s',
      fontSize: '13@s',
      color: commonColor.textColor
    },
    avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
