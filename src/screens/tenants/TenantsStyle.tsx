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
    toolBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderColor: commonColor.textColor,
      borderRadius: 1,
      height: '40@s',
      padding: '5@s'
    },
    createTenantButton: {
      width: '100%',
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
    tenantContainer: {
      height: '50@s'
    },
    tenantNameContainer: {
      backgroundColor: commonColor.containerBgColor,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    tenantNameText: {
      color: commonColor.textColor,
      fontSize: '16@s',
      textAlign: 'center'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '25@s'
    },
    trashIconButton: {
      height: '100%',
      width: '50@s',
      backgroundColor: commonColor.danger,
      justifyContent: 'center',
      alignItems: 'center'
    },
    trashIcon: {
      color: 'white',
      fontSize: '20@s'
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
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
