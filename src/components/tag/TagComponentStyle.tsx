import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

/**
 *
 */
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
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5@s',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
      backgroundColor: commonColor.listHeaderBgColor
    },
    tagIdConstainer: {
      width: '40%'
    },
    userConstainer: {
      width: '60%'
    },
    text: {
      fontSize: '15@s',
      color: commonColor.textColor
    },
    description: {},
    tagId: {
      // width: '50%'
      alignSelf: 'flex-start'
    },
    fullName: {
      // width: '25%',
      alignSelf: 'flex-end'
    },
    tagContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor,
      padding: '10@s',
      height: '60@s'
    },
    labelContainer: {
      width: '75%'
    },
    statusContainer: {
      alignSelf: 'flex-start',
      height: '22@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
