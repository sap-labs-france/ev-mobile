import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    listContainer: {
      flex: 1,
      marginTop: '10@s'
    },
    tenantContainer: {
      marginBottom: '11@s',
      marginHorizontal: '2.5%'
    },
    tenantNameContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    tenantNameText: {
      color: commonColor.textColor,
      fontSize: '16@s',
      textAlign: 'center'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '27@s'
    },
    rightActionsContainer: {
      flexDirection: 'row',
      marginLeft: '2.5%'
    },
    trashIconButton: {
      width: '60@s',
      backgroundColor: commonColor.danger,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '8@s',
      marginRight: '5@s'
    },
    actionIcon: {
      color: 'white',
      fontSize: '20@s'
    },
    editIconButton: {
      width: '60@s',
      backgroundColor: commonColor.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '8@s'
    },
    modalPrimaryButton: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primary,
      color: commonColor.light
    },
    modalOutlinedButton: {
      backgroundColor: commonColor.modalBackgroundColor,
      borderColor: commonColor.textColor,
      color: commonColor.textColor
    },
    spinner: {
      flex: 1
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
