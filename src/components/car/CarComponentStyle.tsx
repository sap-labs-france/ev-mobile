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
      width: '100%',
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor
    },
    selected: {
      opacity: 0.3
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: commonColor.listHeaderBgColor,
      borderBottomColor: commonColor.listBorderColor,
      padding: '5@s',
      borderBottomWidth: 1
    },
    carNameContainer: {
      width: '72%'
    },
    licensePlateContainer: {
      width: '28%',
    },
    headerText: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    licensePlate: {
      alignSelf: 'flex-end'
    },
    carName: {
      alignSelf: 'flex-start'
    },
    carContent: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100@s',
      width: '100%',
    },
    carInfos: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '60%',
      height: '100%',
      paddingVertical: '5@s'
    },
    userContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: '5@s'
    },
    avatarContainer: {
      marginRight: '7@s',
    },
    userNameContainer: {
      flexDirection: 'row',
      maxWidth: '80%',
      flexWrap: 'wrap',
      justifyContent: 'flex-start'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '12@s'
    },
    powerDetailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      // To allow ellipsis truncation
      maxWidth: '33%'
    },
    iconContainer: {
      flexDirection: 'row',
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
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
