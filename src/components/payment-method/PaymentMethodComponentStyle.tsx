import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    paymentMethodContainer: {
      flexDirection: 'row',
      paddingHorizontal: '5@s',
      paddingVertical: '5@s'
    },
    paymentMethodDetailsContainer: {
      justifyContent: 'center',
      flex: 1
    },
    paymentMethodLogoContainer: {
      marginRight: '15@s',
      paddingLeft: '10@s',
      justifyContent: 'center'
    },
    cardSVG: {
      height: '80@s',
      width: '80@s',
      color: commonColor.textColor
    },
    text: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    badgeText: {
      fontSize: '10@s',
      color: commonColor.light,
      paddingVertical: '1@s',
      paddingHorizontal: '3@s'
    },
    expirationDateContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    status: {
      marginLeft: '7@s',
      borderRadius: '2@s'
    },
    cardNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    maskCharacter: {
      width: '5@s',
      height: '5@s',
      borderRadius: '2.5@s',
      backgroundColor: commonColor.textColor,
      marginRight: '1@s'
    },
    maskCharacterSpace: {
      marginRight: '3@s'
    },
    paymentMethodExpired: {
      backgroundColor: commonColor.danger
    },
    paymentMethodExpiringSoon: {
      backgroundColor: commonColor.warning
    },
    paymentMethodValid: {
      backgroundColor: commonColor.success
    },
    defaultContainer: {
      backgroundColor: commonColor.disabledDark,
      marginLeft: '5@s',
      borderRadius: '2@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
