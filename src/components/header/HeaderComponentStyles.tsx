import deepmerge from 'deepmerge';
import {Platform, StyleSheet} from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet, scale } from 'react-native-size-matters';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Utils from '../../utils/Utils';
import {PLATFORM} from '../../theme/variables/commonColor';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    header: {
      width: '100%',
      paddingHorizontal: '10@s',
      paddingVertical: '4@s',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      margin: 0,
      borderBottomWidth: 0,
      paddingTop : Platform.OS === PLATFORM.IOS ? '5@s' : getStatusBarHeight() + scale(5),
      borderTopWidth: 0,
      backgroundColor: commonColor.containerBgColor,
      elevation: 0
    },
    leftIconContainer: {
      marginRight: '15@s'
    },
    modalHeader: {
      paddingTop: '10@s'
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%'
    },
    titleContainer: {
      flex: 1,
      flexDirection: 'row',
      marginLeft: '2.5@s',
      flexWrap: 'wrap',
      alignItems: 'center',
      alignContent: 'stretch',
      justifyContent: 'flex-start',
      height: '100%'
    },
    title: {
      fontSize: '17@s',
      color: commonColor.textColor,
      marginRight: '5@s'
    },
    subTitle: {
      fontSize: '17@s',
      color: commonColor.textColor
    },
    actionsContainer: {
      flexDirection: 'row',
      marginLeft: '10@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
