import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modalContainer: {
      backgroundColor: commonColor.listHeaderBgColor, //'#383838',
      paddingTop: '5@s',
      padding: '10@s',
      paddingVertical: '20@s',
      borderRadius: '3@s',
      alignItems: 'center'
    },
    closeButtonContainer: {
      width: '100%'
    },
    closeButton: {
      alignSelf: 'flex-end',
      fontSize: '19@s'
    },
    title: {
      fontSize: '16@s'
    },
    text: {
      color: commonColor.textColor,
      textAlign: 'center'
    },
    description: {
      fontSize: '13@s',
      marginTop: '10@s'
    },
    horizontalButtonsContainer: {
      flexDirection: 'row'
    },
    verticalButtonsContainer: {
      flexDirection: 'column'
    },
    buttonsContainer: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '30@s'
    },
    button: {
      padding: '5@s',
      paddingVertical: '10@s',
      borderWidth: 0.8
    },
    buttonText: {
      fontSize: '12@s',
      textAlign: 'center'
    },
    cancelButton: {
      borderColor: commonColor.textColor
    },
    horizontalButton: {
      width: '49%'
    },
    verticalButton: {
      width: '100%',
      marginBottom: '7@s'
    },
    cancelButtonText: {
      color: commonColor.textColor
    },
    icon: {
      fontSize: '65@s',
      alignSelf: 'center'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
