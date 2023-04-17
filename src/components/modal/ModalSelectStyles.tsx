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
    buttonContainer: {
      width: '48%',
      borderRadius: '8@s'
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
    closeIcon: {
      marginLeft: '10@s',
      color: commonColor.textColor
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
    modalTitle: {
      fontSize: '17@s',
      flexShrink: 1,
      marginRight: '5@s',
      color: commonColor.textColor
    },
    modalSubtitle: {
      fontSize: '17@s',
      color: commonColor.textColor
    },
    modalTitleContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    modalContainer: {
      flexDirection: 'column',
      height: '100%'
    },
    modalHeader: {
      width: '95%',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      paddingBottom: '15@s',
      paddingTop: '25@s',
      backgroundColor: commonColor.containerBgColor,
      borderTopLeftRadius: '20@s',
      borderTopRightRadius: '20@s'
    },
    listContainer: {
      width: '100%',
      flex: 1
    },
    buttonsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopColor: commonColor.listBorderColor,
      paddingHorizontal: '8@s',
      paddingVertical: '10@s'
    },
    itemContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'stretch',
      width: '100%',
    },
    itemButtonContainer: {
      flex: 1
    },
    spinnerContainer: {
      width: '100%',
      height: '90@s',
      marginBottom: '11@s'
    },
    label: {
      fontWeight: 'bold',
      fontSize: '14@s',
      color: commonColor.textColor,
      marginLeft: '5%',
      marginBottom: '6@s',
      textAlign: 'left'
    },
    clearContainer: {
      width: '10%',
      alignContent: 'center',
      justifyContent: 'center',
      padding: '2@s',
      backgroundColor: commonColor.listItemBackground,
      borderRadius: '8@s',
      marginLeft: '3@s'
    },
    clearIcon: {
      fontSize: '25@s',
      color: commonColor.textColor,
      alignSelf: 'center',
      justifyContent: 'center'
    },
    disabledButton: {
      backgroundColor: commonColor.disabledDark,
      borderColor: commonColor.disabledDark,
      opacity: 0.5
    },
    disabledButtonText: {
      color: commonColor.disabled,
      opacity: 0.8
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
