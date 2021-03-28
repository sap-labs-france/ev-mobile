import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import { PLATFORM } from '../../theme/variables/commonColor';
import Utils from '../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      borderBottomWidth: 1,
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      padding: '5@s'
    },
    avatarContainer: {
      paddingLeft: '10@s',
      paddingRight: '15@s'
    },
    selected: {
      opacity: 0.5
    },
    userContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      height: '65@s'
    },
    userFullnameStatusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    fullNameContainer: {
      width: '70%'
    },
    fullName: {
      fontSize: '17@s',
      color: commonColor.textColor
    },
    emailRoleContainer: {
      width: '90%'
    },
    email: {
      fontSize: '15@s',
      paddingTop: '5@s',
      color: commonColor.textColor
    },
    role: {
      fontSize: '12@s',
      color: commonColor.textColor
    },
    statusContainer: {},
    status: {
      backgroundColor: commonColor.containerBgColor,
      borderWidth: 1,
      margin: 0,
      height: '21@s'
    },
    statusText: {
      fontSize: '11@s',
      fontWeight: 'bold',
      lineHeight: Platform.OS === PLATFORM.ANDROID ? 1 : 0
    },
    active: {
      borderColor: commonColor.brandSuccess,
      color: commonColor.brandSuccess
    },
    inactive: {
      color: commonColor.brandDanger,
      borderColor: commonColor.brandDanger
    },
    pending: {
      color: commonColor.brandWarning,
      borderColor: commonColor.brandWarning
    },
    role: {
      fontSize: '12@s'
    },
    roleContainer: {
      marginTop: '2@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
