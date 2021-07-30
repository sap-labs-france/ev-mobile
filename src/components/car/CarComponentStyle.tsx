import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  let commonStyles: any;
  commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      width: '97%',
      alignSelf: 'center',
      borderColor: 'transparent',
      shadowColor: commonColor.cardShadowColor,
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.23,
      shadowRadius: 3.62,
      elevation: 11,
      marginBottom: '8@s'
    },
    carContent: {
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      flexDirection: 'column',
      margin: 0,
      flex: 1,
      paddingLeft: 0,
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0
    },
    selected: {
      backgroundColor: commonColor.listItemSelected
    },
    unselected: {
      backgroundColor: commonColor.listHeaderBgColor
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '5@s'
    },
    carNameContainer: {
      width: '72%'
    },
    licensePlateContainer: {
      width: '28%'
    },
    headerText: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    licensePlate: {
      alignSelf: 'flex-end'
    },
    carName: {
      alignSelf: 'flex-start',
      fontWeight: 'bold'
    },
    carContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '115@s',
      width: '100%'
    },
    carInfos: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '60%',
      height: '100%',
      paddingVertical: '10@s',
      paddingHorizontal: '5@s'
    },
    userContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      marginTop: '5@s'
    },
    avatarContainer: {
      width: '25%',
      justifyContent: 'flex-end',
      flexDirection: 'row'
    },
    userNameContainer: {
      marginLeft: '10@s',
      width: '67%',
      flexWrap: 'wrap',
      flexDirection: 'row'
    },
    userName: {
      marginRight: '5@s'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '13@s',
      textAlign: 'left'
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
      width: '33%',
      paddingHorizontal: '2@s'
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
      fontSize: '25@s'
    },
    currentTypeIcon: {
      fontSize: '10@s',
      color: commonColor.textColor
    },
    imageStyle: {
      width: '40%',
      height: '100%',
      margin: 0,
      padding: 0
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    avatarContainer: {
      width: '20%'
    },
    userNameContainer: {
      width: '80%'
    }
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
