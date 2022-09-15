import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      width: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    HTMLViewContainer: {
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
      backgroundColor: commonColor.containerBgColor
    },
    spinner: {
      flex: 2,
      backgroundColor: commonColor.containerBgColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    button: {
      width: '65%'
    },
    inputIcon: {
      width: '7%'
    },
    inputField: {
      width: '58%'
    }
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
