import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';
import color from 'color';
import Color from 'color';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      height: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    activityIndicator: {
      marginTop: '70@s',
      padding: '10@s',
      backgroundColor: commonColor.containerBgColor,
      borderRadius: 100,
      zIndex: 2
    },
    content: {
      backgroundColor: commonColor.containerBgColor,
      flex: 1
    },
    boxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      justifyContent: 'center',
      paddingLeft: '10@s'
    },
    inactivity: {
      backgroundColor: color(commonColor.danger).mix(Color('white'), 0.5).desaturate(0.2).hex()
    },
    cost: {
      backgroundColor: color(commonColor.success).mix(Color('white'), 0.5).desaturate(0.2).hex()
    },
    energy: {
      backgroundColor: color(commonColor.yellow).mix(Color('white'), 0.4).desaturate(0.2).hex()
    },
    duration: {
      backgroundColor: color(commonColor.purple).mix(Color('white'), 0.5).desaturate(0.2).hex()
    },
    sessions: {
      backgroundColor: color(commonColor.primary).mix(Color('white'), 0.5).desaturate(0.2).hex()
    },
    spinnerContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    spinner: {
      flex: 1
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
