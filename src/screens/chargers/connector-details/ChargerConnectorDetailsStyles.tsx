import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: commonColor.containerBgColor
  },
  spinner: {
    flex: 1,
    color: commonColor.textColor
  },
  backgroundImage: {
    width: '100%',
    height: '125@s'
  },
  lastTransactionContainer: {
    width: '50@s',
    height: '50@s',
    marginTop: '-90@s',
    marginLeft: '-220@s',
    marginBottom: '25@s',
    backgroundColor: 'transparent',
  },
  buttonLastTransaction: {
    width: '50@s',
    height: '50@s',
    borderRadius: '25@s',
    borderStyle: 'solid',
    borderWidth: '4@s',
    borderColor: commonColor.textColor,
    backgroundColor: commonColor.containerBgColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  transactionContainer: {
    width: '100@s',
    height: '100@s',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '-70@s',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  buttonTransaction: {
    width: '100@s',
    height: '100@s',
    borderRadius: '50@s',
    borderStyle: 'solid',
    borderWidth: '4@s',
    borderColor: commonColor.textColor,
    backgroundColor: commonColor.containerBgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noButtonStopTransaction: {
    height: '15@s'
  },
  startTransaction: {
    borderColor: commonColor.brandSuccess
  },
  stopTransaction: {
    borderColor: commonColor.brandDanger
  },
  transactionIcon: {
    fontSize: '75@s'
  },
  lastTransactionIcon: {
    fontSize: '25@s'
  },
  startTransactionIcon: {
    color: commonColor.brandSuccess
  },
  stopTransactionIcon: {
    color: commonColor.brandDanger
  },
  buttonTransactionDisabled: {
    borderColor: commonColor.buttonDisabledBg
  },
  transactionDisabledIcon: {
    color: commonColor.buttonDisabledBg,
    backgroundColor: 'transparent'
  },
  scrollViewContainer: {
    marginTop: '-15@s',
  },
  detailsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10@s',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '90@s',
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  connectorLetter: {
    marginTop: '5@s',
    marginBottom: '5@s'
  },
  label: {
    fontSize: '16@s',
    color: commonColor.brandPrimaryDark,
    alignSelf: 'center'
  },
  labelValue: {
    fontSize: '25@s',
    fontWeight: 'bold'
  },
  labelUser: {
    fontSize: '10@s'
  },
  subLabel: {
    fontSize: '10@s',
    marginTop: Platform.OS === 'ios' ? '0@s' : '-2@s',
    color: commonColor.brandPrimaryDark,
    alignSelf: 'center'
  },
  subLabelStatusError: {
    color: commonColor.brandDanger,
    marginTop: '2@s'
  },
  subLabelUser: {
    fontSize: '8@s',
    marginTop: '0@s'
  },
  icon: {
    fontSize: '25@s'
  },
  userImage: {
    height: '52@s',
    width: '52@s',
    alignSelf: 'center',
    marginBottom: '5@s',
    borderRadius: '26@s',
    borderWidth: '3@s',
    borderColor: commonColor.textColor
  },
  info: {
    color: commonColor.brandPrimaryDark,
    borderColor: commonColor.brandPrimaryDark
  },
  success: {
    color: commonColor.brandSuccess
  },
  warning: {
    color: commonColor.brandWarning
  },
  danger: {
    color: commonColor.brandDanger
  },
  disabled: {
    color: commonColor.buttonDisabledBg,
    borderColor: commonColor.buttonDisabledBg
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
