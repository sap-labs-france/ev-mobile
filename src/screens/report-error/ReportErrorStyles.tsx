import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      height: '100%',
      backgroundColor: commonColor.containerBgColor,
      paddingBottom: '15@s'
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
    headerContainer: {
      marginBottom: '10@s'
    },
    clearButton: {
      width: '90%',
      marginVertical: '5@s'
    },
    clearButtonText: {
      fontSize: '12@s',
      color: commonColor.primary,
      width: '100%',
      textAlign: 'right',
      padding: '5@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    input: {
      width: '80%'
    },
    descriptionInput: {
      width: '80%'
    },
    buttonContainer: {
      width: '80%'
    }
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
