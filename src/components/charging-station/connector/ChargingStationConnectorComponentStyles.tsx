import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'stretch',
      borderStyle: 'solid'
    },
    borderedBottomContainer: {
      borderBottomWidth: 1,
      borderBottomColor: commonColor.listBorderColor
    },
    connectorContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '100%'
    },
    connectorDetailContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flex: 1,
      alignItems: 'center',
      paddingLeft: '5@s',
      paddingRight: '5@s',
      paddingTop: '10@s',
      paddingBottom: '10@s'
    },
    connectorDetail: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '60@s',
      color: commonColor.textColor
    },
    connectorDetailAnimated: {
      position: 'absolute',
      alignItems: 'center'
    },
    connectorValues: {
      color: commonColor.textColor,
      marginTop: '-1@s',
      fontSize: '30@s',
      fontWeight: 'bold',
      textAlign: 'center'
    },
    connectorSVG: {
      width: '40@s',
      height: '40@s'
    },
    labelImage: {
      color: commonColor.textColor,
      paddingTop: '2@s',
      fontSize: '10@s'
    },
    label: {
      color: commonColor.textColor,
      fontSize: '10@s',
      marginTop: '-3@s'
    },
    subLabel: {
      color: commonColor.textColor,
      fontSize: '9@s'
    },
    icon: {
      fontSize: '30@s',
      color: commonColor.textColor
    },
    iconContainer: {
      width: '30@s'
    },
    arrowIcon: {
      color: commonColor.disabledDark
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
