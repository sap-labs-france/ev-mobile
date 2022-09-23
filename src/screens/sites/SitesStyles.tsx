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
    content: {
      flex: 1,
      alignItems: 'center'
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    map: {
      height: '100%',
      width: '100%'
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
    sitesContainer: {
      flex: 1,
      width: '100%'
    },
    filtersContainer: {
      flexDirection: 'row',
      zIndex: 1,
      marginVertical: '10@s',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '95%'
    },
    mapFiltersContainer: {
      position: 'absolute',
    },
    mapSearchBarComponent: {
      backgroundColor: commonColor.containerBgColor,
      flex: 1,
      marginRight: '10@s',
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
      width: '50@s',
      height: '50@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.listHeaderBgColor
    },
    fab: {
      marginTop: '14@s'
    },
    siteComponentContainer: {
      marginBottom: '11@s',
      width: '95%'
    },
    siteDetailsModalContainer: {
      width: '100%',
      backgroundColor: commonColor.containerBgColor,
      maxHeight: '60%',
      minHeight: '70@s',
      borderTopRightRadius: '20@s',
      borderTopLeftRadius: '20@s'
    },
    siteDetailsModalHeader: {
      height: '50@s',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    closeIcon: {
      fontSize: '37@s',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
