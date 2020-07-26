import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import ThemeColor from '../../../custom-theme/ThemeColor';

export default function computeStyleSheet(): any {
  const themeColor = new ThemeColor();
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColor.containerBgColor
    },
    scrollViewContainer: {
      flexDirection: 'column'
    },
    viewContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    spinner: {
      flex: 1,
      color: themeColor.textColor
    },
    actionButton: {
      backgroundColor: themeColor.buttonBg,
      color: themeColor.textColor
    },
    actionButtonIcon: {
      fontSize: '20@s'
    },
    actionButtonText: {
      fontSize: '15@s'
    },
    descriptionContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    label: {
      width: '50%',
      marginLeft: '10@s',
      marginTop: '5@s',
      marginBottom: '5@s',
      fontSize: '12@s',
      fontWeight: 'bold',
      color: themeColor.textColor,
    },
    scrollViewValue: {
      marginTop: '5@s',
      marginBottom: '5@s'
    },
    value: {
      fontSize: '12@s',
      marginLeft: '15@s',
      color: themeColor.textColor
    },
    scrollViewValues: {
      flexDirection: 'column',
      marginTop: '5@s'
    },
    values: {
      fontSize: '15@s',
      marginLeft: '15@s',
      marginBottom: '5@s',
      color: themeColor.textColor
    },
    rowBackground: {
      backgroundColor: themeColor.headerBgColor
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
