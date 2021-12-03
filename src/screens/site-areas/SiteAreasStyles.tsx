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
      flex: 1
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
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
