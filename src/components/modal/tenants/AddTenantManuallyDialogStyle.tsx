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
      justifyContent: 'center',
      width: '100%'
    },
    inputError: {
      color: commonColor.dangerLight,
      width: '100%',
      fontSize: '11@s'
    },
    inputLabel: {
      fontSize: '16@s',
      color: commonColor.textColor
    },
    inputContainer: {
      paddingHorizontal: 0, // Override default padding
      width: '100%'
    },
    inputInnerContainer: {
      borderBottomColor: commonColor.textColor,
      borderBottomWidth: 0.5
    },
    inputInnerContainerNoBorder: {
      borderBottomWidth: 0
    },
    inputText: {
      color: commonColor.textColor,
      paddingBottom: 0,
      fontSize: '14@s'
    },
    selectField: {
      backgroundColor: commonColor.selectFieldBackgroundColor,
      flex: 1
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
      fontSize: '14@s',
      flex: 1
    },
    newEntryText: {
      color: commonColor.brandPrimaryLight
    },
    newEntryIcon: {
      marginRight: '5@s',
      flex: 0
    },
    selectDropdownIcon: {
      color: commonColor.textColor
    },
    selectDropdownRowIcon: {
      color: commonColor.textColor,
      marginLeft: '10@s'
    },
    selectDropdownRowIconContainer: {
      height: '100%'
    },
    selectDropdownRowContainer: {
      flexDirection: 'row',
      padding: '2@s',
      alignItems: 'center',
      paddingHorizontal: '5@s',
      justifyContent: 'flex-start'
    },
    selectLabel: {
      marginBottom: '10@s'
    },
    rightIconContainerStyle: {
      width: '15%'
    },
    endpointCreationFormContainer: {
      backgroundColor: commonColor.selectDropdownBackgroundColor,
      padding: '10@s',
      width: '95%'
    },
    endpointCreationFormInputLabel: {
      fontSize: '13@s',
      color: commonColor.textColor
    },
    endpointCreationFormTitle: {
      fontWeight: 'bold'
    },
    endpointCreationFormHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15@s'
    },
    backButton: {
      borderColor: commonColor.textColor
    },
    buttonText: {
      fontSize: '12@s'
    },
    button: {
      padding: '5@s',
      paddingVertical: '8@s',
      borderRadius: '8@s',
      borderWidth: 0.8
    }

  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
