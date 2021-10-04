import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      height: '100%',
      backgroundColor: commonColor.containerBgColor,
    },
    content: {
      width: '100%',
      height: 'auto',
      paddingTop: '15@s',
      alignItems: 'center'
    },
    scrollview: {
      height: 'auto'
    },
    itemContainer: {
      width: '100%',
      height: '70@s',
      flexDirection: 'row',
      alignItems: 'center'
    },
    noCarIcon: {
      fontSize: '55@s',
      color: commonColor.textColor,
      marginHorizontal: '10@s'
    },
    selectField: {
      width: '100%',
      backgroundColor: commonColor.selectFieldBackgroundColor,
      height: '40@s'
    },
    selectFieldDisabled: {
      opacity: 0.4
    },
    selectFieldText: {
      color: commonColor.textColor,
      textAlign: 'left',
      marginLeft: 0,
      fontSize: '14@s'
    },
    selectDropdown: {
      backgroundColor: commonColor.selectDropdownBackgroundColor
    },
    selectDropdownRow: {
      borderBottomWidth: 0
    },
    selectDropdownRowText: {
      color: commonColor.textColor,
      paddingBottom: '2@s',
      textAlign: 'left',
      fontSize: '14@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    model: {
      marginLeft: '5@s'
    },
    errorText: {
      color: commonColor.dangerLight
    },
    inputLabel: {
      color: commonColor.textColor,
      fontSize: '16@s'
    },
    buttonContainer: {
      width: '95%',
      marginVertical: '20@s'
    },
    buttonDisabled: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primary,
      opacity: 0.4
    },
    buttonText: {
      color: commonColor.light
    },
    defaultContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      marginTop: '15@s',
      marginBottom: '10@s'
    },
    typeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      marginBottom: '5@s'
    },
    defaultCheckbox: {
      marginRight: '15@s',
      color: commonColor.containerBgColor,
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.textColor,
      marginLeft: 0
    },
    carTypeContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      width: '95%',
      marginTop: '15@s'
    },
    radioButton: {
      marginRight: '15@s',
      borderColor: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
