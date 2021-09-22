import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    header: {
      height: '45@s',
      width: '100%',
      padding: 0,
      margin: 0,
      borderBottomWidth: 0,
      borderTopWidth: 0,
      backgroundColor: commonColor.listHeaderBackground,
      elevation: 0
    },
    leftHeader: {
      flexDirection: 'row'
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
    titleHeader: {
      width: '90%',
      color: commonColor.textColor,
      fontSize: '19@s',
      textAlign: 'center'
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
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
