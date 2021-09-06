import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  let commonStyles: any;
  commonStyles = ScaledSheet.create({
    carContainer: {
      width: '100%',
      height: '130@s'
    },
    selected: {
      backgroundColor: commonColor.listItemSelected
    },
    unselected: {
      backgroundColor: commonColor.listItemBackground
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      padding: '5@s',
      paddingRight: '10@s'
    },
    statusNameContainer: {
      flexDirection: 'row',
      flex: 1,
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    headerText: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    carName: {
      alignSelf: 'flex-start'
    },
    defaultContainer: {
      backgroundColor: commonColor.primary,
      borderRadius: '2@s',
      justifyContent: 'center'
    },
    defaultText: {
      fontSize: '10@s',
      color: commonColor.light,
      paddingHorizontal: '3@s'
    },
    licensePlate: {
      textAlign: 'right',
      maxWidth: '25%'
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100%'
    },
    imageStyle: {
      flex: 1,
      height: '100%',
      padding: 0,
      borderBottomLeftRadius: '8@s'
    },
    carInfos: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '60%',
      height: '100%',
      paddingVertical: '10@s',
      paddingHorizontal: '5@s'
    },
    userContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      marginBottom: '5@s',
      alignItems: 'center',
      flex: 1,
      marginLeft: '22@s'
    },
    avatarContainer: {
      justifyContent: 'flex-end',
      flexDirection: 'row'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '13@s',
      width: '100%',
      textAlign: 'center'
    },
    userName: {
      marginRight: '5@s',
      textAlign: 'left',
      flex: 1,
      marginLeft: '5@s'
    },
    powerDetailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%'
    },
    columnContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: '2@s',
      flex: 1
    },
    columnContainerBorderRight: {
      borderRightWidth: 0.3,
      borderColor: commonColor.textColor
    },
    iconContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '20@s',
      width: 'auto'
    },
    currentTypeIcon: {
      fontSize: '10@s'
    },
    powerDetailsText: {
      fontSize: '12@s'
    },
    test: {
      backgroundColor: 'red'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = ScaledSheet.create({});
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
