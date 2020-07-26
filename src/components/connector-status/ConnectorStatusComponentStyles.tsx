import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import ThemeManager from '../../theme/ThemeManager';
import ThemeColor from '../../theme/variables/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const darkTheme = ThemeManager.getInstance().isThemeTypeIsDark();
  const connectorSuccessColor = darkTheme ? themeColor.brandSuccessLight : themeColor.brandSuccess;
  const connectorWarningColor = darkTheme ? themeColor.brandWarningLight : themeColor.brandWarning;
  const connectorWarningBorderColor = darkTheme ? themeColor.brandWarning : themeColor.brandWarningDark;
  const connectorDangerColor = darkTheme ? themeColor.brandDangerLight : themeColor.brandDanger;
  const connectorDangerBorderColor = darkTheme ? themeColor.brandDanger : themeColor.brandDangerDark;
  const connectorDisabledColor = darkTheme ? themeColor.brandDisabledLight : themeColor.brandDisabled;
  const connectorDisabledBorderColor = darkTheme ? themeColor.brandDisabled : themeColor.brandDisabledDark;
  const connectorPrimaryColor = darkTheme ? themeColor.brandPrimaryLight : themeColor.brandPrimary;
  const connectorPrimaryBorderColor = darkTheme ? themeColor.brandPrimary : themeColor.brandPrimaryDark;
  const commonStyles = ScaledSheet.create({
    containerWithDescription: {
      height: '60@s',
      width: '100@s',
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
      borderWidth: '4@s',
      borderRadius: '22@s',
      borderColor: themeColor.textColor,
      backgroundColor: 'transparent'
    },
    commonConnectorValue: {
      fontSize: '22@s',
      fontWeight: 'bold',
      color: themeColor.textColor
    },
    commonConnectorDescription: {
      position: 'absolute',
      bottom: '-2@s',
      fontSize: '12@s',
      color: themeColor.textColor
    },
    faultedConnector: {
      backgroundColor: connectorDangerColor,
      borderColor: connectorDangerBorderColor
    },
    faultedConnectorValue: {},
    faultedConnectorDescription: {
      color: connectorDangerColor
    },
    availableConnector: {
      borderColor: connectorSuccessColor
    },
    availableConnectorValue: {
      color: connectorSuccessColor
    },
    availableConnectorDescription: {
      color: connectorSuccessColor
    },
    suspendedConnector: {
      backgroundColor: connectorPrimaryColor,
      borderColor: connectorPrimaryBorderColor
    },
    suspendedConnectorValue: {},
    suspendedConnectorDescription: {
      color: connectorPrimaryColor
    },
    preparingConnector: {
      backgroundColor: connectorWarningColor,
      borderColor: connectorWarningBorderColor
    },
    preparingConnectorValue: {},
    preparingConnectorDescription: {
      color: connectorWarningColor
    },
    finishingConnector: {
      backgroundColor: connectorWarningColor,
      borderColor: connectorWarningBorderColor
    },
    finishingConnectorValue: {},
    finishingConnectorDescription: {
      color: connectorWarningColor
    },
    unavailableConnector: {
      borderColor: connectorDisabledBorderColor
    },
    unavailableConnectorValue: {},
    unavailableConnectorDescription: {
      color: connectorDisabledColor
    },
    reservedConnector: {
      backgroundColor: connectorDisabledColor,
      borderColor: connectorDisabledBorderColor
    },
    reservedConnectorValue: {},
    reservedConnectorDescription: {
      color: connectorDisabledColor
    },
    chargingConnector: {
      backgroundColor: themeColor.brandPrimary,
      borderColor: themeColor.brandInfoLight,
      borderTopColor: themeColor.brandPrimary,
      borderBottomColor: themeColor.brandPrimary
    },
    chargingConnectorValue: {},
    chargingConnectorDescription: {
      color: connectorPrimaryColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
