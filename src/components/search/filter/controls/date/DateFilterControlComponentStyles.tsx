import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../../../utils/Utils';

/**
 *
 */
export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'column',
      width: '100%'
    },
    label: {
      color: commonColor.textColor,
      fontSize: '14@s' ,
      marginBottom: '5@s'
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: '5@s',
      borderWidth: 0.8,
      borderColor: commonColor.textColor,
      borderRadius: '8@s',
    },
    dateText: {
      color: commonColor.textColor,
      flex: 1,
      fontSize: '13@s'
    },
    dateIcon: {
      color: commonColor.textColor
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
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
