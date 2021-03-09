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
    text: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '30@s'
    },
    description: {
      textAlign: 'center'
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
      paddingBottom: '5@s',
      height: '80@s',
      width: '100%'
    },
    container: {
      flexDirection: 'column',
      width: '100%'
    },
    header: {
      width: '100%',
      padding: '5@s',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.listHeaderBgColor
    },
    column: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '33%',
      justifyContent: 'center'
    },
    firstName:{
      marginRight:'7@s',
      maxWidth:'50%'
    },
    user: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
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
