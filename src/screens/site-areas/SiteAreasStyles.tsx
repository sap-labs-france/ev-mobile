import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    siteAreasContainer: {
      flex: 1
    },
    content: {
      flex: 1,
      width: '100%'
    },
    searchBar: {
      marginVertical: '10@s'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    map: {
      flex: 1
    },
    noRecordFound: {
      flex: 1,
      paddingTop: '10@s',
      alignSelf: 'center'
    },
    fabContainer: {
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      right: 0,
      margin: '12@s',
      flexDirection: 'column',
      alignItems: 'center',
      padding: 0
    },
    imageStyle: {
      height: '100%',
      width: '100%',
      padding: 0,
      borderRadius: '60@s',
    },
    outlinedImage: {
      borderColor: commonColor.listItemBackground,
      borderWidth: 2
    },
    siteAreaMarker: {
      fontSize: '40@s'
    },
    filtersContainer: {
      flexDirection: 'row',
      zIndex: 1,
      marginVertical: '10@s',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginHorizontal: '7.5@s'
    },
    mapFiltersContainer: {
      position: 'absolute',
    },
    mapSearchBarComponent: {
      backgroundColor: commonColor.containerBgColor,
      flex: 1,
      marginRight: '10@s',
      height: '50@s',
      elevation: 4,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62,
    },
    listSearchBarComponent: {
      backgroundColor: commonColor.listHeaderBgColor,
      flex: 1,
      marginRight: '10@s',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapFilterButton: {
      borderRadius: '8@s',
      height: '50@s',
      width: '50@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    listFilterButton: {
      borderRadius: '8@s',
      width: '45@s',
      height: '45@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.listHeaderBgColor
    },
    fab: {
      marginTop: '14@s'
    },
    siteAreaComponentContainer: {
      marginBottom: '11@s',
      width: '95%'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
