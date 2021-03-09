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
      fontSize: '10@s',
      color: commonColor.textColor,
      textAlign: 'center'
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
      justifyContent: 'space-between',
      paddingTop: '5@s',
      paddingBottom: '5@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
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
      justifyContent: 'space-around'
    },
    carName: {
      flexDirection: 'row',
      width: '75%',
      overflow: 'hidden',
      marginRight: '5%',
      paddingLeft: '5@s'
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
      padding: '5@s',
      borderBottomWidth: 1,
      justifyContent: 'space-around',
      borderBottomColor: commonColor.listBorderColor,
    },
    licensePlate: {
      width: '25%'
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50%'
    },
    imageStyle: {
      width: '40%',
      height: '100%',
      margin: 0,
      padding: 0
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
