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
      justifyContent: 'center',
      height: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    content: {
      backgroundColor: commonColor.headerBgColor
    },
    boxContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      paddingLeft: '10@s'
    },
    inactivity: {
      backgroundColor: color(commonColor.danger).saturate(0.1).mix(Color('white'), 0.5).hex()
    },
    cost: {
      backgroundColor: color(commonColor.success).saturate(0.1).mix(Color('white'), 0.5).hex()
    },
    energy: {
      backgroundColor: color(commonColor.yellow).saturate(0.1).mix(Color('white'), 0.4).hex()
    },
    duration: {
      backgroundColor: color(commonColor.purple).saturate(0.1).mix(Color('white'), 0.5).hex()
    },
    sessions: {
      backgroundColor: color(commonColor.primary).saturate(0.1).mix(Color('white'), 0.5).hex()
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
