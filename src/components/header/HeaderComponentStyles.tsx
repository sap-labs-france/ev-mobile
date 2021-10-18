import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { scale, ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';
import { PLATFORM } from '../../theme/variables/commonColor';
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
      paddingTop: Platform.OS === PLATFORM.IOS ? scale(20) + getStatusBarHeight() : scale(10) + getStatusBarHeight(),
      backgroundColor: commonColor.containerBgColor,
      elevation: 0
    },
    modalHeader: {
      paddingTop: '10@s'
    },
    leftHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
    },
    rightHeader: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    bodyHeader: {
      flex: 4,
      paddingLeft: Platform.OS === 'ios' ? 0 : '40@s',
      height: '100%',
      justifyContent: 'center'
    },
    title: {
      color: commonColor.textColor,
      width: '90%',
      fontSize: '17@s',
      textAlign: 'left',
      marginLeft: '5@s'
    },
    titleHeaderWithSubTitle: {
      fontSize: '16@s'
    },
    subTitleHeader: {
      color: commonColor.textColor,
      fontWeight: 'bold',
      fontSize: '12@s',
      marginTop: Platform.OS === 'ios' ? 0 : '-3@s'
    },
    logoHeader: {
      width: '60@s',
      height: '45@s',
      marginLeft: '5@s',
      resizeMode: 'contain'
    },
    iconLeftHeader: {
      fontSize: '30@s',
      color: commonColor.textColor,
      width: '35@s'
    },
    mapListIcon: {
      fontSize: '25@s',
      color: commonColor.textColor,
      width: '35@s'
    },
    iconRightHeader: {
      fontSize: '30@s',
      color: commonColor.textColor,
      width: '35@s'
    },
    actionsContainer: {
      flexDirection: 'row'
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
