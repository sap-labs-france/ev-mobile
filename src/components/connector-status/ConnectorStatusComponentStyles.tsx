import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../theme/variables/commonColor';

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
    borderColor: commonColor.textColor,
    backgroundColor: 'transparent'
  },
  commonConnectorValue: {
    fontSize: '22@s',
    fontWeight: 'bold',
    color: commonColor.inverseTextColor
  },
  commonConnectorDescription: {
    position: 'absolute',
    bottom: '-2@s',
    fontSize: '12@s',
    color: commonColor.textColor
  },
  faultedConnector: {
    backgroundColor: commonColor.brandDanger,
    borderColor: commonColor.brandDangerDark
  },
  faultedConnectorValue: {},
  faultedConnectorDescription: {
    color: commonColor.brandDanger
  },
  availableConnector: {
    borderColor: commonColor.brandSuccess
  },
  availableConnectorValue: {
    color: commonColor.brandSuccess
  },
  availableConnectorDescription: {
    color: commonColor.brandSuccess
  },
  suspendedConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandPrimaryDark
  },
  suspendedConnectorValue: {},
  suspendedConnectorDescription: {
    color: commonColor.brandPrimaryDark
  },
  preparingConnector: {
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  preparingConnectorValue: {},
  preparingConnectorDescription: {
    color: commonColor.brandWarning
  },
  finishingConnector: {
    backgroundColor: commonColor.brandWarning,
    borderColor: commonColor.brandWarningDark
  },
  finishingConnectorValue: {},
  finishingConnectorDescription: {
    color: commonColor.brandWarning
  },
  unavailableConnector: {
    backgroundColor: commonColor.brandDisabled,
    borderColor: commonColor.brandDisabledDark
  },
  unavailableConnectorValue: {},
  unavailableConnectorDescription: {
    color: commonColor.brandDisabled
  },
  reservedConnector: {
    backgroundColor: commonColor.brandDisabled,
    borderColor: commonColor.brandDisabledDark
  },
  reservedConnectorValue: {},
  reservedConnectorDescription: {
    color: commonColor.brandDisabled
  },
  chargingConnector: {
    backgroundColor: commonColor.brandPrimary,
    borderColor: commonColor.brandInfoLight,
    borderTopColor: commonColor.brandPrimary,
    borderBottomColor: commonColor.brandPrimary
  },
  chargingConnectorValue: {},
  chargingConnectorDescription: {
    color: commonColor.brandPrimaryDark
  }
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
