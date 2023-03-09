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
      paddingTop : Platform.OS === PLATFORM.IOS ? '5@s' : getStatusBarHeight() + scale(5),
      backgroundColor: commonColor.containerBgColor,
      height: '100%'
    },
    sidebar: {
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    },
    drawerItem: {
      width: '100%',
      paddingVertical: '2@s'
    },
    drawerLabel: {
      color: commonColor.textColor,
      fontSize: '13@s'
    },
    drawerSeparation: {
      width: '80%',
      borderTopWidth: 0.7,
      borderTopColor: Color(commonColor.disabledDark).alpha(0.38).toString(),
      alignSelf: 'flex-end'
    },
    header: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingHorizontal: '10@s',
      paddingBottom: '5@s',
      width: '100%',
      borderBottomWidth: 0.8,
      borderColor
    },
    bottomContainer: {
      paddingHorizontal: '10@s',
      flexDirection: 'row',
      paddingTop: '15@s',
      paddingBottom: Platform.OS === PLATFORM.IOS ? 0 : '15@s',
      backgroundColor: commonColor.listItemBackground,
      width: '100%'
    },
    tenantContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    scrollviewInnerContainer: {
      width: '100%'
    },
    scrollview: {
      width: '100%',
      backgroundColor: commonColor.containerBgColor,
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
    rightContainer: {
      flexDirection: 'column',
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginLeft: '20@s'
    },
    settingsContainer: {
      maxWidth: '40%'
    },
    logoutContainer: {
      flex: 1
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
