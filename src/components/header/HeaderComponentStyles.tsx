import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    header: {
      width: '100%',
      padding: '5@s',
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 0,
      borderBottomWidth: 0,
      borderTopWidth: 0,
      paddingTop: scale(10) + getStatusBarHeight(),
      backgroundColor: commonColor.containerBgColor,
      elevation: 0
    },
    icon: {
      color: commonColor.textColor,
      fontSize: '20@s'
    },
    leftIcon: {
      marginLeft: '2.5%',
      marginRight: '13@s'
    },
    modalHeader: {
      paddingTop: '10@s'
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 1
    },
    title: {
      color: commonColor.textColor,
      fontSize: '17@s',
      textAlign: 'left',
      marginLeft: '2.5%',
      flex: 1
    },
    actionsContainer: {
      flexDirection: 'row',
      marginRight: '2.5%',
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
