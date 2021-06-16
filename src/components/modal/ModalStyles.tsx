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
      width: '90%',
      alignSelf: 'center',
      height: '40@s',
      marginBottom: '10@s',
      backgroundColor: commonColor.buttonBg
    },
    buttonText: {
      width: '100%',
      textAlign: 'center',
      fontSize: '15@s',
      color: commonColor.textColor
    },
    modal: {
      backgroundColor: commonColor.containerBgColor,
      margin: 0,
      marginTop: '100@s',
      width: '100%'
    },
    modalContainer: {
      flexDirection: 'column',
      height: '100%'
    },
    modalHeader: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      borderTopColor: commonColor.listBorderColor,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      padding: '5@s'
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
      borderTopWidth: 1,
      paddingBottom: '20@s',
      borderTopColor: commonColor.listBorderColor
    },
    modalButton: {
      marginTop: '15@s',
      alignSelf: 'center',
      width: '40%',
      backgroundColor: commonColor.buttonBg
    },
    buttonDisabled: {
      opacity: 0.4
    },
    buttonEnabled: {
      opacity: 1
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
