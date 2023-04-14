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
    scrollView: {
      width: '100%',
      flex: 1
    },
    scrollViewContentContainer: {
      flexGrow: 1,
      width: '100%',
      alignItems: 'center',
      paddingVertical: '5@s'
    },
    buttonContainer: {
      width: '95%',
      borderRadius: scale(18)
    },
    buttonDisabled: {
      backgroundColor: commonColor.disabledDark
    },
    button: {
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.primary,
      borderRadius: '18@s',
      paddingHorizontal: '7@s',
      paddingVertical: '8@s',
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
      opacity: 0.9
    },
    inputContainer: {
      width: '95%',
      paddingHorizontal: 0,
      marginBottom: scale(20)
    },
    inputText: {
      color: commonColor.textColor,
      fontSize: scale(13)
    },
    inputTextContainer: {
      minHeight: '45@s',
      flexGrow: 1,
      maxHeight: '400@s',
      width: '100%',
      paddingVertical: 0,
      paddingHorizontal: '10@s',
      backgroundColor: commonColor.listItemBackground,
      borderRadius: '18@s',
      borderBottomWidth: 0
    },
    inputTextMultilineContainer: {
      height: '90@s'
    },
    inputTextContainerError: {
      borderColor: commonColor.danger,
      borderWidth: 0.8,
      borderBottomWidth: 0.8
    },
    inputIcon: {
      color: commonColor.textColor,
      alignSelf: 'center',
      textAlign: 'center'
    },
    inputError: {
      color: commonColor.danger,
      fontSize: scale(10)
    },
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: '10@s',
      paddingVertical: 0,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      borderWidth: 0,
      width: '95%'
    },
    checkbox: {
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
      alignItems: 'center'
    },
    checkboxText: {
      fontSize: '12@s',
      color: commonColor.textColor,
      paddingLeft: '10@s',
      fontWeight: 'normal'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
