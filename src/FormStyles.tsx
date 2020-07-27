import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from './custom-theme/customCommonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    spinner: {
      flex: 1
    },
    formContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    formHeader: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    form: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    button: {
      width: '90%',
      alignSelf: 'center',
      height: '40@s',
      marginBottom: '10@s',
      backgroundColor: commonColor.buttonBg,
    },
    buttonText: {
      width: '100%',
      textAlign: 'center',
      fontSize: '15@s',
      color: commonColor.textColor
    },
    inputGroup: {
      height: '40@s',
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: '10@s',
      marginLeft: 0,
      paddingLeft: '10@s',
      paddingRight: '10@s',
      backgroundColor: commonColor.buttonBg,
      borderColor: 'transparent'
    },
    inputIcon: {
      color: commonColor.textColor,
      alignSelf: 'center',
      textAlign: 'center',
      width: '25@s',
      fontSize: '20@s'
    },
    inputField: {
      flex: 1,
      fontSize: '15@s',
      color: commonColor.textColor
    },
    formErrorText: {
      fontSize: '12@s',
      marginLeft: '20@s',
      color: commonColor.danger,
      alignSelf: 'flex-start',
      top: '-5@s'
    },
    formCheckboxContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '20@s',
      marginTop: '10@s'
    },
    checkbox: {
      marginRight: '15@s',
      borderColor: commonColor.textColor,
      backgroundColor: commonColor.containerBgColor,
    },
    checkboxText: {
      fontSize: '13@s',
      color: commonColor.textColor,
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
