import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../../utils/Utils';
import { PLATFORM } from '../../../../theme/variables/commonColor';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      height: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    headerContainer: {
      marginBottom: '10@s'
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
    carPlaceholderContainer: {
      backgroundColor: commonColor.listItemBackground
    },
    noCarIcon: {
      fontSize: '55@s',
      color: commonColor.textColor,
      marginHorizontal: '10@s'
    },
    noCarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    noTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderColor: commonColor.dangerLight,
      borderTopWidth: 0.8,
      borderLeftWidth: 0.8,
      borderRightWidth: 0.8,
      borderBottomWidth: 0.8
    },
    noTagIcon: {
      color: commonColor.dangerLight,
      fontSize: '50@s',
      marginHorizontal: '10@s'
    },
    column: {
      flexDirection: 'column',
      flex: 1
    },
    messageText: {
      textAlign: 'left',
      fontSize: '13@s',
      color: commonColor.textColor
    },
    addItemContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    linkText: {
      color: commonColor.brandPrimaryLight,
      alignItems: 'center'
    },
    linkLabel: {
      flex: 1
    },
    plusSign: {
      fontSize: '15@s',
      color: commonColor.brandPrimaryLight,
      marginRight: '5@s'
    },
    noItemContainer: {
      minHeight: '90@s',
      padding: '10@s',
      marginBottom: '11@s',
      justifyContent: 'flex-start'
    },
    inputContainer: {
      borderBottomColor: commonColor.textColor,
      borderBottomWidth: 0.7,
      marginLeft: 0,
      paddingBottom: 0
    },
    inputContainerDisabled: {
      borderBottomWidth: 1,
      borderBottomColor: commonColor.disabledDark
    },
    selectField: {
      width: '100%',
      height: 'auto',
      minHeight: '40@s',
      paddingHorizontal: 0,
      borderRadius: '18@s',
      backgroundColor: commonColor.listItemBackground
    },
    selectFieldDisabled: {
      opacity: 0.4
    },
    selectFieldText: {
      color: commonColor.textColor,
      textAlign: 'left',
      marginHorizontal: 0,
      fontSize: '14@s'
    },
    selectFieldTextPlaceholder: {
      color: commonColor.disabledDark
    },
    selectDropdown: {
      backgroundColor: commonColor.listItemBackground
    },
    selectDropdownRow: {
      borderBottomWidth: 0
    },
    selectDropdownRowText: {
      color: commonColor.textColor,
      paddingVertical: 0,
      textAlign: 'left',
      paddingLeft: 0,
      fontSize: '14@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    model: {
      marginLeft: '3@s',
      color: commonColor.disabledDark
    },
    errorText: {
      color: commonColor.dangerLight
    },
    inputLabel: {
      color: commonColor.textColor,
      fontSize: '16@s'
    },
    disabledInputLabel: {
      color: commonColor.disabledDark
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
    radioButton: {
      marginRight: '15@s',
      borderColor: commonColor.textColor
    },
    switch: {
      marginRight: '15@s',
      color: 'red',
      transform: Platform.OS === PLATFORM.IOS ? [] : [{ scaleX: moderateScale(1, 3.5) }, { scaleY: moderateScale(1, 3.5) }]
    },
    paddedInputTextContainer: {},
    dropdownIcon: {
      color: commonColor.textColor
    },
    expiryDateContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: '10@s'
    },
    expiryDateInputContainer: {
      flexDirection: 'row',
      width: '95%',
      alignItems: 'center',
      padding: '5@s'
    },
    expiryDateText: {
      fontSize: '14@s',
      color: commonColor.textColor,
      marginStart: '10@s'
    },
    dateIcon: {
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
