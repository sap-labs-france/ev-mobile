import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    selected: {
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
    avatar: {
      margin: 0,
      alignSelf: 'center',
      justifyContent: 'center',
      width: '25%',
      flexDirection: 'row'
    },
    description: {
      textAlign: 'center'
    },
    tagContent: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      paddingTop: '5@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      paddingBottom: '5@s',
      height: '60@s',
      width: '100%'
    },
    id: {
      marginRight: '7@s',
      maxWidth: '60%'
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
    user: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1
    },
    label: {
      width: '70%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    status: {
      width: '30%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: '100%'
    },
    tagActive: {
      borderColor: commonColor.brandSuccess,
      color: commonColor.brandSuccess
    },
    tagInactive: {
      borderColor: commonColor.brandDanger,
      color: commonColor.brandDanger
    },
    tagText: {
      fontSize: '13@s',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      fontWeight: 'bold'
    },
    tag: {
      backgroundColor: commonColor.containerBgColor,
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
