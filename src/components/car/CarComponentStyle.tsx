import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  let commonStyles: any;
  commonStyles = ScaledSheet.create({
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
      alignSelf: 'flex-start',
      fontWeight: 'bold'
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
      marginLeft: '20@s'
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%'
    },
    imageStyle: {
      flex: 1,
      height: '100%',
      padding: 0,
      borderBottomLeftRadius: '8@s'
    },
    noImageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    carImagePlaceholder: {
      fontSize: '75@s'
    },
    carInfos: {
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '60%',
      paddingHorizontal: '5@s'
    },
    userContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginLeft: '21@s',
      marginBottom: '7@s'
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
    columnContainerBorderRight: {
    },
    iconContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    icon: {
      color: commonColor.textColor,
      width: 'auto'
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
