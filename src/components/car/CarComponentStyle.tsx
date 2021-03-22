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
      opacity: 0.3
    },
    headerText: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    userName: {
      fontSize: '11@s',
      color: commonColor.textColor,
      textAlign: 'center'
    },
    avatar: {
      marginRight: '7@s',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    },
    text: {
      color: commonColor.textColor,
      fontSize: '15@s'
    },
    ac: {
      fontSize: '10@s',
      color: commonColor.textColor,
    },
    make: {
      marginRight: '5@s'
    },
    container: {
      width: '100%',
      flexDirection: 'column',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor
    },
    check: {
      fontSize: '50@s',
      alignSelf: 'center',
      top:0,
      left:0,
      position: 'absolute'
    },
    carContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      height: '125@s',
      width: '100%',
      alignItems: 'center'
    },
    carInfos: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '60%',
      height: '100%',
    },
    carInfosLine: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%',
    },
    carName: {
      flexDirection: 'row',
      width: '75%',
      overflow: 'hidden',
      marginRight: '5%'
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '25@s'
    },
    dcIcon: {
      color: commonColor.textColor,
      fontSize: '15@s'
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    header: {
      flexDirection: 'row',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: commonColor.listHeaderBgColor,
      alignItems: 'center',
      paddingVertical: '5@s',
      paddingHorizontal: '7@s',
      borderBottomWidth: 1,
      justifyContent: 'space-around',
      borderBottomColor: commonColor.listBorderColor,
    },
    licensePlate: {
      width: '25%',
      justifyContent: 'flex-end',
      flexDirection: 'row'
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    line: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%',
      paddingHorizontal: '5@s'
    },
    imageStyle: {
      width: '40%',
      height: '100%',
      margin: 0,
      padding: 0
    },
    userNameContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
