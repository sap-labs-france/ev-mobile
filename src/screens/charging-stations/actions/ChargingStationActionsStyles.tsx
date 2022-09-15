import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    scrollViewContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    viewContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    actionContainer: {
      width: '90%',
      marginTop: '5@s',
      justifyContent: 'center'
    },
    actionButton: {
      height: '45@s',
      justifyContent: 'center'
    },
    actionButtonIcon: {
      color: commonColor.light
    },
    actionButtonText: {
      fontSize: '18@s',
      color: commonColor.light
    },
    resetButton: {
      backgroundColor: commonColor.danger
    },
    warningButton: {
      backgroundColor: commonColor.warning
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
