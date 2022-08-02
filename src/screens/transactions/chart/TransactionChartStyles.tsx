import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor,
      paddingBottom: '10@s'
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    spinner: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: commonColor.containerBgColor
    },
    chart: {
      height: '100%'
    },
    chartWithHeader: {
      height: '78%'
    },
    notAuthorizedContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8@s',
      backgroundColor: commonColor.containerBgColor
    },
    headerValue: {
      fontSize: '18@s',
      fontWeight: 'bold'
    },
    subHeaderName: {
      color: commonColor.textColor,
      fontSize: '15@s',
      width: '49%'
    },
    subHeaderNameLeft: {},
    subHeaderNameRight: {
      textAlign: 'right'
    },
    notData: {
      marginTop: '20@s',
      fontSize: '14@s',
      textAlign: 'center',
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    chart: {
      height: '82%'
    },
    chartWithHeader: {
      height: '73%'
    }
  };
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
