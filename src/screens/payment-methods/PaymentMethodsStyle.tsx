import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    content: {
      marginHorizontal: '2.5%',
      width: '95%',
      flex: 1,
      marginTop: '10@s'
    },
    container: {
      alignItems: 'center',
      width: '100%',
      flex: 1
    },
    fab: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: '16@s',
      zIndex: 1,
      elevation: 4,
      backgroundColor: commonColor.primary,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    addPaymentMethodButton: {
      width: '45@s',
      height: '45@s',
      borderRadius: '22.5@s',
      padding: '5@s',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginLeft: '2.5%',
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
    icon: {
      color: commonColor.textColor,
      fontSize: '27@s'
    },
    trashIconButton: {
      width: '80@s',
      height: '100%',
      borderRadius: '8@s',
      marginLeft: '2.5%',
      backgroundColor: commonColor.danger,
      justifyContent: 'center',
      alignItems: 'center'
    },
    trashIcon: {
      color: 'white',
      fontSize: '20@s'
    },
    paymentMethodContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: '11@s'
    },
    paymentMethodItemContainer: {
      backgroundColor: commonColor.containerBgColor,
      width: '100%',
      alignItems: 'center'
    },
    paymentMethodComponentContainer: {
      marginBottom: '11@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
