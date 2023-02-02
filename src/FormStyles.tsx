import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import {scale, ScaledSheet} from 'react-native-size-matters';

import Utils from './utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    formContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    buttonContainer: {
      width: '90%'
    },
    buttonDisabled: {
      backgroundColor: commonColor.disabledDark
    },
    button: {
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.primary,
      borderRadius: '18@s',
      padding: '7@s',
      width: '100%'
    },
    secondaryButton: {
      backgroundColor: commonColor.primaryDark
    },
    buttonText: {
      width: '100%',
      textAlign: 'center',
      fontSize: '15@s',
      color: commonColor.light
    },
    buttonTextDisabled: {
      opacity: 0.8
    },
    inputContainer: {
      width: '90%',
      paddingHorizontal: 0,
      marginBottom: scale(20)
    },
    inputText: {
      color: commonColor.textColor,
      fontSize: scale(13)
    },
    inputTextContainer: {
      height: '45@s',
      flexGrow: 1,
      maxHeight: '400@s',
      width: '100%',
      paddingHorizontal: '10@s',
      backgroundColor: commonColor.listItemBackground,
      borderRadius: '18@s',
      borderBottomWidth: 0
    },
    inputTextContainerError: {
      borderColor: commonColor.danger,
      borderWidth: 0.8,
      borderBottomWidth: 0.8
    },
    inputIcon: {
      color: commonColor.textColor,
      alignSelf: 'center',
      textAlign: 'center',
      width: '25@s'
    },
    inputError: {
      color: commonColor.danger,
      fontSize: scale(10)
    },
    checkboxContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: '10@s',
      backgroundColor: 'transparent',
      borderWidth: 0
    },
    checkbox: {
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      height: '21@s',
      width: '21@s',
      alignItems: 'center',
      marginRight: '10@s'
    },
    checkboxText: {
      fontSize: '13@s',
      color: commonColor.textColor,
      paddingLeft: '10@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
