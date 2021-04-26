import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

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
      alignItems: 'center',
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
    userFullNameStatusContainer: {
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
      color: commonColor.textColor
    },
    role: {
      fontSize: '12@s',
      paddingTop: '3@s',
      color: commonColor.textColor
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
