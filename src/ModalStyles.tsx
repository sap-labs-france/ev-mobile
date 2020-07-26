import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from './theme/variables/commonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    modal: {
    },
    modalContainer: {
      backgroundColor: commonColor.containerBgColor,
    },
    modalHeaderContainer: {
      flexDirection: 'row',
      width: '100%',
      height: '45@s',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
    },
    modalTextHeader:{
      width: '100%',
      textAlign: 'center',
      fontSize: '17@s',
      color: commonColor.textColor,
    },
    modalContentContainer: {
      paddingLeft: '15@s',
      paddingRight: '15@s',
      paddingTop: '5@s',
      paddingBottom: '5@s',
      justifyContent: 'flex-start',
    },
    modalRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalIinputGroup: {
      height: '35@s',
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
    modalRowError: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    modalErrorText: {
      fontSize: '12@s',
      color: commonColor.brandDangerLight,
    },
    modalLabel: {
      fontSize: '14@s',
      color: commonColor.textColor,
    },
    modalInputField: {
      width: '65%',
      fontSize: '14@s',
      color: commonColor.textColor,
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      paddingTop: '5@s',
      paddingBottom: '10@s',
    },
    modalButton: {
      height: '40@s',
      width: '40%',
      alignItems: 'center',
    },
    modalTextButton: {
      height: '100%',
      marginTop: '12@s',
      fontSize: '14@s',
      fontWeight: 'bold',
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
