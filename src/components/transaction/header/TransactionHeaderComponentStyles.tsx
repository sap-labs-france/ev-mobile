import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5@s',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.headerBgColor
  },
  headerName: {
    color: commonColor.headerTextColor,
    fontSize: '18@s',
    marginLeft: '5@s',
    marginRight: '5@s',
    fontWeight: 'bold'
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5@s',
    paddingLeft: '8@s',
    paddingRight: '8@s',
    backgroundColor: commonColor.headerBgColorLight
  },
  subHeaderName: {
    color: commonColor.headerTextColor,
    fontSize: '15@s',
    width: '49%'
  },
  subHeaderNameLeft: {},
  subHeaderNameRight: {
    textAlign: 'right'
  },
  transactionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    paddingLeft: '5@s',
    paddingRight: '5@s',
    height: '80@s',
    width: '100%'
  },
  label: {
    color: commonColor.textColor,
    fontSize: '10@s',
    marginTop: '-3@s'
  },
  info: {
    color: commonColor.brandPrimaryDark
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
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    color: commonColor.textColor,
    fontSize: '30@s',
    justifyContent: 'flex-end'
  },
  labelValue: {
    fontSize: '15@s'
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
