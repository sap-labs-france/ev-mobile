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
    searchBar: {
      marginVertical: '10@s'
    },
    content: {
      flex: 1
    },
    spinner: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    map: {
      flex: 1
    },
    filtersExpanded: {
      opacity: 1,
      height: '140@s'
    },
    filtersHidden: {
      opacity: 0,
      height: '0@s'
    },
    fab: {
      zIndex: 1,
      elevation: 4,
      backgroundColor: commonColor.primary,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62,
      marginTop: '15@s',
      width: '55@s',
      height: '55@s',
      borderRadius: '55@s',
      alignItems: 'center',
      justifyContent: 'center'
    },
    fabContainer: {
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      right: 0,
      margin: '14@s',
      flexDirection: 'column'
    },
    imageStyle: {
      height: '100%',
      width: '100%',
      padding: 0,
      borderRadius: '60@s'
    },
    cluster: {
      backgroundColor: commonColor.containerBgColor,
      padding: '10@s',
      width: '50@s',
      height: '50@s',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50@s',
      borderWidth: 1,
      borderColor: commonColor.textColor,
      zIndex: 1
    },
    text: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '20@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
