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
    paymentMethodContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      height: '70@s',
      paddingHorizontal: '5@s'
    },
    paymentMethodDetailsContainer: {
      justifyContent: 'center',
      flex: 1
    },
    paymentMethodLogoContainer: {
      marginRight: '15@s',
      paddingLeft: '10@s'
    },
    cardSVG: {
      height: '70@s',
      width: '70@s',
      color: commonColor.textColor
    },
    text: {
      color: commonColor.textColor,
      fontSize: '15@s'
    },
    badgeText: {
      fontSize: '11@s',
      color: commonColor.brandLight,
      paddingVertical: '1@s',
      paddingHorizontal: '3@s'
    },
    expirationDateContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    status: {
      marginLeft: '7@s',
      borderRadius: 0
    },
    cardNumberContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    maskCharacter: {
      width: '6@s',
      height: '6@s',
      borderRadius: '3@s',
      backgroundColor: commonColor.textColor,
      marginRight: '1@s'
    },
    maskCharacterSpace: {
      marginRight: '3@s'
    },
    paymentMethodExpired: {
      backgroundColor: commonColor.brandDanger
    },
    paymentMethodExpiringSoon: {
      backgroundColor: commonColor.brandWarning
    },
    paymentMethodValid: {
      backgroundColor: commonColor.brandSuccess
    },
    defaultContainer: {
      backgroundColor: commonColor.brandDisabledDark,
      marginLeft: '5@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
