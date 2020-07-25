import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import CommonColor2 from '../../../theme/variables/CommonColor2';

export default function computeStyleSheet(): any {
  const commonColor = new CommonColor2();
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
      fontSize: '10@s',
      marginTop: '-3@s',
      color: commonColor.textColor,
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
      fontSize: '30@s',
      justifyContent: 'flex-end',
      color: commonColor.textColor,
    },
    labelValue: {
      fontSize: '15@s',
      color: commonColor.textColor,
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
