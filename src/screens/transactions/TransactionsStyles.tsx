import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    content: {
      flex: 1
    },
    searchBar: {
      marginVertical: '10@s'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    filtersContainer: {
      flexDirection: 'row',
      zIndex: 1,
      marginVertical: '10@s',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: '5@s'
    },
    filterButton: {
      borderRadius: '8@s',
      width: '50@s',
      height: '50@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.listHeaderBgColor,
    },
    searchBarComponent: {
      backgroundColor: commonColor.listHeaderBgColor,
      flex: 1,
      marginRight: '10@s',
      alignItems: 'center',
      justifyContent: 'center',
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
