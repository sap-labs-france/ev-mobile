import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor,
      paddingBottom: '5@s'
    },
    spinner: {
      flex: 1,
      justifyContent: 'center',
      color: commonColor.textColor
    },
    iconContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    reportErrorIcon: {
      fontSize: '100@s',
      color: commonColor.textColor
    },
    formContainer: {
      flex: 3,
    },
    mobileInput: {
      height: '40@s',
      width: '94%',
      paddingLeft: '10@s',
      paddingRight: '10@s',
      marginLeft: '10@s',
      marginRight: '10@s',
    },
    subjectInput: {
      height: '40@s',
      width: '94%',
      paddingLeft: '10@s',
      paddingRight: '10@s',
      marginLeft: '10@s',
      marginRight: '10@s',
      marginTop: '15@s'
    },
    descriptionInput: {
      width: '94%',
      alignItems: 'flex-start',
      height: '210@s',
      paddingLeft: '10@s',
      marginLeft: '10@s',
      marginRight: '10@s',
      marginTop: '15@s'
    },
    inputText: {
      flex: 1,
      fontSize: '15@s',
      color: commonColor.textColor
    },
    descriptionText: {
      paddingTop: '12@s',
      fontSize: '15@s',
      color: commonColor.textColor
    },
    sendButton: {
      marginTop: '30@s',
      marginLeft: '10@s',
      marginRight: '10@s',
    },
    sendTextButton: {
      color: 'white',
      textAlign: 'center',
      fontSize: '16@s'
    },
    errorMobileText: {
      fontSize: '12@s',
      marginLeft: '20@s',
      color: commonColor.brandDanger,
      alignSelf: 'flex-start',
    },
    errorSubjectText: {
      fontSize: '12@s',
      marginLeft: '20@s',
      color: commonColor.brandDanger,
      alignSelf: 'flex-start',
    },
    errorDescriptionText: {
      fontSize: '12@s',
      marginLeft: '20@s',
      color: commonColor.brandDanger,
      alignSelf: 'flex-start',
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {
    chart: {
      height: '82%'
    },
    chartWithHeader: {
      height: '73%'
    },
  };
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
