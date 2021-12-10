import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from './utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modal: {
      backgroundColor: commonColor.containerTouchableBackgroundColor,
      padding: '20@s',
      margin: 0
    },
    modalContainer: {
      backgroundColor: commonColor.containerBgColor
    },
    modalHeaderContainer: {
      flexDirection: 'row',
      width: '100%',
      height: '45@s',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor
    },
    modalTextHeader: {
      width: '100%',
      textAlign: 'center',
      fontSize: '17@s',
      color: commonColor.textColor
    },
    modalContentContainer: {
      paddingLeft: '5@s',
      paddingRight: '5@s',
      paddingTop: '5@s',
      paddingBottom: '15@s',
      justifyContent: 'flex-start'
    },
    modalRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalInputGroup: {
      height: '35@s',
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: '10@s',
      marginLeft: 0,
      paddingLeft: '15@s',
      paddingRight: '10@s',
      backgroundColor: commonColor.buttonBg,
      borderColor: 'transparent'
    },
    modalPickerGroup: {
      height: '35@s',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: '10@s',
      marginLeft: 0,
      paddingLeft: Platform.OS === 'ios' ? 0 : '10@s',
      backgroundColor: commonColor.buttonBg,
      borderColor: 'transparent'
    },
    modalRowError: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginTop: '3@s',
      marginLeft: '15@s'
    },
    modalErrorText: {
      fontSize: '12@s',
      color: commonColor.brandDangerLight
    },
    modalLabel: {
      fontSize: '14@s',
      color: commonColor.textColor
    },
    modalInputField: {
      width: '100%',
      fontSize: '14@s',
      color: commonColor.textColor
    },
    modalPickerField: {
      marginTop: Platform.OS === 'ios' ? -4 : 0,
      fontSize: '14@s',
      color: commonColor.textColor
    },
    modalPickerPlaceHolder: {
      color: commonColor.placeholderTextColor
    },
    modalPickerModal: {
      backgroundColor: commonColor.listBackgroundHeader
    },
    modalPickerText: {
      color: 'red'
    },
    modalButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      paddingTop: '5@s',
      paddingBottom: '10@s'
    },
    modalButton: {
      height: '40@s',
      width: '40%',
      alignItems: 'center'
    },
    modalTextButton: {
      height: '100%',
      marginTop: Platform.OS === 'ios' ? '12@s' : '7@s',
      fontSize: '14@s',
      fontWeight: 'bold'
    },
    modalBottomHalf: {
      justifyContent: 'flex-end',
      margin: 0
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
