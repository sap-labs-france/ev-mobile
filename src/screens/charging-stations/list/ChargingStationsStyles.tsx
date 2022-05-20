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
    listContainer: {
      height: '100%'
    },
    mapSearchBarComponent: {
      backgroundColor: commonColor.containerBgColor,
      flex: 1,
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
      backgroundColor: commonColor.containerBgColor,
      marginLeft: '10@s'
    },
    listFilterButton: {
      borderRadius: '8@s',
      height: '50@s',
      width: '50@s',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: commonColor.listHeaderBgColor
    },
    content: {
      flex: 1
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    map: {
      height: '100%'
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
    fab: {
      marginTop: '14@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    icon: {
      color: commonColor.light,
      fontSize: '20@s'
    },
    chargingStationMarker: {
      fontSize: '30@s',
    },
    chargingStationsContainer: {
      flex: 1
    },
    qrcodeButton: {
      backgroundColor: commonColor.primary,
      borderRadius: '8@s',
      padding: '10@s',
      width: '45@s',
      height: '45@s',
      alignItems: 'center',
      justifyContent: 'center'
    },
    chargingStationDetailsModalContainer: {
      width: '100%',
      backgroundColor: commonColor.modalBackgroundColor,
      maxHeight: '60%',
      minHeight: '70@s',
      borderTopRightRadius: '20@s',
      borderTopLeftRadius: '20@s'
    },
    chargingStationDetailsModalHeader: {
      height: '50@s',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    chargingStationDetailsModalSpinnerContainer: {
      height: '70@s',
      alignItems: 'center',
      justifyContent: 'center'
    },
    chargingStationDetailsModalSpinner: {
      color: commonColor.disabledDark,
      fontSize: '30@s'
    },
    closeIcon: {
      padding: '8@s',
      fontSize: '35@s',
      color: commonColor.textColor
    },
    activityIndicator: {
      marginTop: '70@s',
      padding: '10@s',
      backgroundColor: commonColor.containerBgColor,
      borderRadius: 100,
      zIndex: 1
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
