import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  let commonStyles: any;
  commonStyles = ScaledSheet.create({
    carCatalogContainer: {
      backgroundColor: commonColor.listItemBackground,
      flexDirection: 'row'
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: '5@s',
      marginBottom: '5@s',
      paddingRight: '10@s',
      width: '100%'
    },
    headerText: {
      fontSize: '14@s',
      color: commonColor.textColor
    },
    carName: {
      alignSelf: 'flex-start',
      fontWeight: 'bold'
    },
    rightContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100%'
    },
    imageStyle: {
      width: '35%',
      height: '100%',
      padding: 0,
      borderBottomLeftRadius: '8@s',
      borderTopLeftRadius: '8@s'
    },
    noImageContainer: {
      width: '35%',
      height: 'auto',
      justifyContent: 'center',
      alignItems: 'center'
    },
    carInfos: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: '5@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '13@s',
      width: '100%',
      textAlign: 'center'
    },
    powerDetailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingBottom: '5@s'
    },
    columnContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: '2@s',
      flex: 1
    },
    iconContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      color: commonColor.textColor
    },
    currentTypeIcon: {
      fontSize: '10@s'
    },
    powerDetailsText: {
      fontSize: '12@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = ScaledSheet.create({});
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
