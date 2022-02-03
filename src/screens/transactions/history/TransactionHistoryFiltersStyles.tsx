import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonStyles = ScaledSheet.create({
    dateFiltersContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '20@s'
    },
    dateFilterComponentContainer: {
      width: '48%'
    },
    switchFilterComponentContainer: {
      marginBottom: '20@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
