import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      width: '100%'
    },
    button: {
      width: '95%',
      alignSelf: 'center',
      height: '40@s',
      backgroundColor: commonColor.buttonBg
    },
    buttonDisabled: {
      opacity: 0.5
    },
    buttonEnabled: {
      opacity: 1
    },
    selectionContainer: {
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center'
    },
    inputIcon: {
      fontSize: '25@s',
      color: commonColor.textColor,
      paddingHorizontal: '5@s'
    },
    rightIcon: {
      textAlign: 'right'
    },
    spinner: {
      alignSelf: 'center',
      flex: 1,
      paddingLeft: '7@s',
      color: commonColor.textColor
    },
    selectText: {
      textAlign: 'left'
    },
    buttonText: {
      textAlign: 'center',
      fontSize: '14@s',
      color: commonColor.textColor,
      flex: 1,
      paddingLeft: '7@s'
    },
    modal: {
      backgroundColor: commonColor.containerBgColor,
      margin: 0,
      marginTop: '20%',
      width: '100%',
      borderTopLeftRadius: '20@s',
      borderTopRightRadius: '20@s'
    },
    modalContainer: {
      flexDirection: 'column',
      height: '100%'
    },
    modalHeader: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '5@s',
      backgroundColor: commonColor.listHeaderBackground,
      borderTopLeftRadius: '20@s',
      borderTopRightRadius: '20@s'
    },
    modalTitle: {
      fontSize: '16@s'
    },
    listContainer: {
      width: '100%',
      flex: 1
    },
    bottomButtonContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      height: '80@s',
      alignItems: 'center',
      paddingBottom: '20@s',
      borderTopColor: commonColor.listBorderColor,
      borderTopWidth: 1
    },
    modalButton: {
      marginTop: '15@s',
      alignSelf: 'center',
      width: '40%',
      backgroundColor: commonColor.buttonBg
    },
    itemContainer: {
      width: '100%'
    },
    spinnerContainer: {
      width: '100%'
    },
    buttonContainer: {
      width: '100%'
    },
    label: {
      fontWeight: 'bold',
      fontSize: '14@s',
      color: commonColor.textColor,
      marginLeft: '5%',
      marginBottom: '6@s',
      textAlign: 'left'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
