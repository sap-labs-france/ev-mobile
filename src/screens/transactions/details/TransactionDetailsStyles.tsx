import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColor.containerBgColor
  },
  viewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  spinner: {
    flex: 1,
    color: commonColor.textColor
  },
  backgroundImage: {
    width: '100%',
    height: '125@s'
  },
  transactionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5@s',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.headerBgColor
  },
  headerRowContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerName: {
    color: commonColor.headerTextColor,
    fontSize: '18@s',
    marginLeft: '5@s',
    marginRight: '5@s',
    fontWeight: 'bold'
  },
  subHeaderName: {
    color: commonColor.headerTextColor,
    fontSize: '14@s',
    marginLeft: '5@s',
    marginRight: '5@s',
  },
  subSubHeaderName: {
    color: commonColor.headerTextColor,
    fontSize: '12@s',
    marginLeft: '5@s',
    marginRight: '5@s',
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100@s'
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%'
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
    marginTop: Platform.OS === 'ios' ? '0@s' : '-5@s',
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
