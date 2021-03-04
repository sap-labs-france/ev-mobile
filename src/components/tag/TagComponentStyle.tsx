import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    selected:{
      opacity: 0.5
    },
    labelValue: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    tagContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderBottomWidth: 1,
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      paddingTop: '5@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      height: '80@s',
      width: '100%'
    },
    columnContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex:0.7,
      paddingLeft: '5@s'
    },
    left: {
      width:'25@s',
      flex:0.2
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      flex:0
    },
    accessory: {
      color: commonColor.textColor,
      opacity:1
    },
    avatarSelected: {
      color: commonColor.textColor,
      opacity:0.3
    },
    avatarTitle: {
      color: commonColor.textColor
    },
    avatar: {
      backgroundColor: 'darkgray'
    },
    firstName:{
      marginRight:'7@s',
      maxWidth:'50%'
    },
    name:{
      flex:1
    },
    email:{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
