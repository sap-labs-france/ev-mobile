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
      flexDirection: 'column'
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
    actionButton: {},
    actionButtonIcon: {
      color: commonColor.light
    },
    actionButtonText: {
      fontSize: '15@s'
    },
    descriptionContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    label: {
      width: '50%',
      marginLeft: '10@s',
      marginTop: '5@s',
      marginBottom: '5@s',
      fontSize: '12@s',
      fontWeight: 'bold',
      color: commonColor.textColor
    },
    scrollViewValue: {
      marginTop: '5@s',
      marginBottom: '5@s'
    },
    value: {
      fontSize: '12@s',
      marginLeft: '15@s',
      color: commonColor.textColor
    },
    scrollViewValues: {
      flexDirection: 'column',
      marginTop: '5@s'
    },
    values: {
      fontSize: '15@s',
      marginLeft: '15@s',
      marginBottom: '5@s',
      color: commonColor.textColor
    },
    rowBackground: {
      backgroundColor: commonColor.headerBgColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
