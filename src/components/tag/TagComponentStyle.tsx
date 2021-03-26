import deepmerge from 'deepmerge';
import { Platform, StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import { PLATFORM } from '../../theme/variables/commonColor';
import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flexDirection: 'column',
      width: '100%'
    },
    selected: {
      opacity: 0.5
    },
    header: {
      padding: '5@s',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.listHeaderBgColor
    },
    userConstainer: {
    },
    text: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    description: {
      textAlign: 'center'
    },
    tagId: {
      marginRight: '7@s',
      maxWidth: '60%'
    },
    tagContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      alignItems: 'center',
      borderBottomColor: commonColor.listBorderColor,
      padding: '10@s',
      height: '60@s',
    },
    labelContainer: {
    },
    statusContainer: {
      alignSelf: 'flex-start',
    },
    status: {
      height: '21@s',
      backgroundColor: commonColor.containerBgColor,
      borderWidth: 1,
      margin: 0,
    },
    statusText: {
      fontSize: '11@s',
      fontWeight: 'bold',
      lineHeight: Platform.OS === PLATFORM.ANDROID ? 1 : 0
    },
    active: {
      borderColor: commonColor.brandSuccess,
      color: commonColor.brandSuccess
    },
    inactive: {
      borderColor: commonColor.brandDanger,
      color: commonColor.brandDanger
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
