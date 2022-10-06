import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    containerWithDescription: {
      height: '60@s',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    containerWithNoDescription: {
      height: '55@s',
      width: '60@s',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    commonConnector: {
      width: '44@s',
      height: '44@s',
      justifyContent: 'center',
      borderStyle: 'solid',
      alignItems: 'center',
      borderWidth: '2@s',
      borderRadius: '22@s',
      borderColor: commonColor.textColor,
      backgroundColor: 'transparent'
    },
    commonConnectorValue: {
      fontSize: '22@s',
      fontWeight: 'bold',
      padding: '3@s',
      color: commonColor.inverseTextColor
    },
    commonConnectorDescription: {
      position: 'absolute',
      bottom: '-2@s',
      fontSize: '11@s',
      color: commonColor.textColor
    },
    faultedConnector: {
      backgroundColor: commonColor.dangerLight,
      borderColor: commonColor.danger
    },
    faultedConnectorValue: {},
    faultedConnectorDescription: {
      color: commonColor.dangerLight
    },
    availableConnector: {
      borderColor: commonColor.success
    },
    availableConnectorValue: {
      color: commonColor.success
    },
    availableConnectorDescription: {
      color: commonColor.success
    },
    suspendedConnector: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primaryDark
    },
    suspendedConnectorValue: {
      color: commonColor.light
    },
    suspendedConnectorDescription: {
      color: commonColor.primary
    },
    preparingConnector: {
      backgroundColor: commonColor.warning,
      borderColor: commonColor.warningDark
    },
    preparingConnectorValue: {
      color: commonColor.light
    },
    preparingConnectorDescription: {
      color: commonColor.warning
    },
    finishingConnector: {
      backgroundColor: commonColor.warning,
      borderColor: commonColor.warningDark
    },
    finishingConnectorValue: {
      color: commonColor.light
    },
    finishingConnectorDescription: {
      color: commonColor.warning
    },
    unavailableConnector: {
      borderColor: commonColor.disabledDark
    },
    unavailableConnectorValue: {
      color: commonColor.disabledDark
    },
    unavailableConnectorDescription: {
      color: commonColor.disabledDark
    },
    reservedConnector: {
      backgroundColor: commonColor.disabled,
      borderColor: commonColor.disabledDark
    },
    reservedConnectorValue: {
      color: commonColor.disabledDark
    },
    reservedConnectorDescription: {
      color: commonColor.disabledDark
    },
    chargingConnector: {
      backgroundColor: commonColor.primary,
      borderColor: commonColor.primary,
      borderTopColor: commonColor.primaryLight,
      borderBottomColor: commonColor.primaryLight
    },
    chargingConnectorValue: {
      color: commonColor.light
    },
    chargingConnectorDescription: {
      color: commonColor.primary
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
