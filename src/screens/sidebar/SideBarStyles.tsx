import Color from 'color';
import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import { PLATFORM } from '../../theme/variables/commonColor';
import Utils from '../../utils/Utils';

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
      justifyContent: 'center',
      height: '100%'
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
      paddingVertical: '2@s',
      width: '100%'
    },
    tenantContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    safeArea:{
      width: '100%'
    },
    scrollviewInnerContainer: {
      width: '100%'
    },
    scrollview: {
      width: '100%',
      height: 'auto',
      backgroundColor: commonColor.containerBgColor
    },
    tenantName: {
      color: commonColor.textColor,
      fontSize: '15@s',
    },
    logo: {
      width: '90%',
      height: '60@s',
      resizeMode: 'contain',
      margin: '5@s',
    },
    versionContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      flexDirection: 'row',
      marginTop: '5@s'
    },
    newVersionContainer: {
      paddingTop: '5@s',
      paddingBottom: '5@s',
      paddingLeft: '15@s',
      paddingRight: '15@s',
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
      fontSize: '12@s',
      paddingRight: '5@s',
      color: commonColor.light
    },
    versionText: {
      color: commonColor.textColor,
      fontSize: '12@s',
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
