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
      backgroundColor: commonColor.containerBgColor,
      alignItems: 'center'
    },
    content: {
      flex: 1,
      width: '95%'
    },
    searchBar: {
      marginVertical: '10@s'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    userComponentContainer: {
      marginBottom: '11@s'
    },
    filtersContainer: {
      flexDirection: 'row',
      zIndex: 1,
      marginVertical: '10@s',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '95%'
    },
    filterButton: {
      borderRadius: '8@s',
      width: '45@s',
      height: '45@s',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '10@s',
      backgroundColor: commonColor.listHeaderBgColor,
    },
    searchBarComponent: {
      backgroundColor: commonColor.listHeaderBgColor,
      flex: 1,
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
