import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    cardFieldContainer: {
      height: '50@s',
      width: '95%',
      color: commonColor.textColor,
      alignSelf: 'center'
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    },
    button: {
      marginTop: '30@s',
      alignSelf: 'center',
      width: '30%',
      height: '40@s',
      marginBottom: '10@s',
      borderRadius: '20@s',
      backgroundColor: commonColor.buttonBg
    },
    spinner: {
      color: commonColor.disabledDark,
      paddingTop: '15@s'
    },
    buttonDisabled: {
      opacity: 0.4
    },
    buttonEnabled: {
      opacity: 1
    },
    eulaContainer: {
      marginTop: '10@s',
      width:'95%'
    },
    checkbox: {
      color: commonColor.textColor,
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      marginRight: '10@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '12@s'
    },
    eulaText: {
      textAlign: 'justify',
      fontSize: '11@s',
      fontStyle: 'italic',
      padding: '7@s'
    },
    checkboxText: {
      textAlign: 'left',
      marginTop: '10@s',
      paddingHorizontal: '10@s',
      fontSize: '12@s',
      color: commonColor.textColor
    },
    buttonText: {
      color: commonColor.textColor,
      padding: '5@s',
      fontSize: '12@s',
      opacity: 1
    },
    checkboxContainer: {
      marginBottom: '15@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
