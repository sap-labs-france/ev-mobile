import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    header: {
      width: '100%',
      padding: '5@s',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      margin: 0,
      borderBottomWidth: 0,
      borderTopWidth: 0,
      paddingTop: scale(10) + getStatusBarHeight(),
      backgroundColor: commonColor.containerBgColor,
      elevation: 0
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '30@s',
      paddingTop: '2@s'
    },
    leftIcon: {
      marginLeft: '2.5%',
      marginRight: '13@s'
    },
    rightIcon: {
      marginLeft: '13@s',
      marginRight: '2.5%'
    },
    modalHeader: {
      paddingTop: '10@s'
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start'
    },
    titleContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      alignContent: 'stretch',
      justifyContent: 'flex-start',
    },
    title: {
      fontSize: '17@s',
      color: commonColor.textColor,
      marginRight: '5@s',
    },
    subTitle: {
      fontSize: '17@s',
      color: commonColor.textColor,
    },
    actionsContainer: {
      flexDirection: 'row',
      marginLeft: '10@s'
    },
    action: {
      marginHorizontal: '5@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
