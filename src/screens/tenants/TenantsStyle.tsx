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
    toolBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 1,
      height: '40@s',
      padding: '5@s',
      marginVertical: '10@s'
    },
    tenantContainer: {
      height: '60@s',
      marginBottom: '8@s',
      marginHorizontal: '2.5%'
    },
    tenantNameContainer: {
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
      fontSize: '27@s'
    },
    addTenantButton: {
      width: '35@s',
      height: '35@s',
      borderRadius: '8@s',
      padding: '5@s',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: commonColor.listItemBackground,
      elevation: 4,
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62
    },
    rightActionsContainer: {
      flexDirection: 'row',
      marginLeft: '2.5%'
    },
    trashIconButton: {
      height: '100%',
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
      height: '100%',
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
    fab: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: '18@s',
      zIndex: 1,
      elevation: 4,
      backgroundColor: commonColor.primary,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
