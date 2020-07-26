import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../theme/variables/commonColor';

export default function computeStyleSheet(): any {
  const commonStyles = ScaledSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      height: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    spinner: {
      flex: 1,
      color: commonColor.textColor
    },
    content: {
      backgroundColor: commonColor.headerBgColor,
    },
    cards: {
      padding: '10@s',
      backgroundColor: commonColor.headerBgColor,
    },
    card: {
      padding: '5@s',
      backgroundColor: commonColor.headerBgColor,
    },
    cardItem: {
      backgroundColor: commonColor.headerBgColor,
    },
    tabHeader: {},
    cardIcon: {
      textAlign: 'center',
      fontSize: '35@s',
      width: '40@s',
      color: commonColor.textColor
    },
    cardText: {
      fontSize: '20@s',
      color: commonColor.textColor
    },
    cardNote: {
      fontSize: '12@s',
      fontStyle: 'italic',
      color: commonColor.subTextColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
