import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'stretch',
      justifyContent: 'center'
    },
    buttonsContainer: {
      alignItems: 'center',
      marginLeft: '3@s',
      justifyContent: 'center',
      backgroundColor: commonColor.listItemBackground,
      borderRadius: '8@s',
      width: '13%'
    },
    modalContainer: {
      flex: 1
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    buttonsSeparator: {
      borderTopWidth: 0.8,
      borderColor: commonColor.disabledDark,
      width: '80%',
      opacity: 0.6
    },
    buttonIcon: {
      color: commonColor.textColor,
      alignSelf: 'center'
    },
    button: {
      color: commonColor.primaryLight,
      fontSize: '14@s'
    },
    userFilterPlaceholder: {
      backgroundColor: commonColor.listItemBackground,
      width: '100%',
      height: '90@s',
      borderRadius: '8@s',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '5@s'
    },
    userFilterPlaceholderIcon: {
      color: commonColor.textColor
    },
    userFilterPlaceholderText: {
      color: commonColor.textColor,
      fontSize: '12@s',
      flex: 1
    },
    badge: {
      padding: '3@s',
      minHeight: '25@s',
      minWidth: '35@s',
      backgroundColor: commonColor.primary,
      borderColor:  commonColor.primary,
      borderRadius: '10@s',
      alignItems: 'center',
      justifyContent: 'center'
    },
    badgeText: {
      fontSize: '12@s',
      color: commonColor.light
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
