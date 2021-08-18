import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modalControlsContainer: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    inputError: {
      color: commonColor.dangerLight
    },
    inputLabel: {
      fontSize: '16@s',
      color: commonColor.textColor
    },
    inputContainer: {
      paddingHorizontal: 0 // Override default padding
    },
    inputInnerContainer: {
      width: '100%',
      borderBottomColor: commonColor.textColor,
      borderBottomWidth: 0.5
    },
    inputText: {
      color: commonColor.textColor,
      paddingBottom: 0,
      fontSize: '14@s'
    },
    selectField: {
      width: '100%',
      backgroundColor: commonColor.selectFieldBackgroundColor
    },
    selectFieldText: {
      color: commonColor.textColor,
      textAlign: 'left',
      fontSize: '14@s',
      marginLeft: 0
    },
    selectDropdown: {
      backgroundColor: commonColor.selectDropdownBackgroundColor
    },
    selectDropdownRow: {
      borderBottomWidth: 0
    },
    selectDropdownRowText: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    selectLabel: {
      marginBottom: '10@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
