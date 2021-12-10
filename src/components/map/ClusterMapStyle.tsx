import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonStyles = ScaledSheet.create({
    map: {
      width: '100%',
      height: '100%'
    },
    mapOverlay: {
      width: '50@s',
      position: 'absolute',
      zIndex: 1,
      height: '100%'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
