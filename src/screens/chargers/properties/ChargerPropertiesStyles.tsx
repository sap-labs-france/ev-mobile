import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonColor.containerBgColor
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
    color: commonColor.textColor
  },
  descriptionContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  label: {
    width: '150@s',
    marginLeft: '10@s',
    fontSize: '15@s',
    fontWeight: 'bold',
    color: commonColor.textColor,
  },
  scrollViewValue: {
    marginTop: '5@s',
    marginBottom: '5@s'
  },
  value: {
    fontSize: '15@s',
    marginLeft: '15@s',
    color: commonColor.textColor
  },
  scrollViewValues: {
    flexDirection: 'column'
  },
  values: {
    fontSize: '15@s',
    marginLeft: '15@s',
    marginBottom: '5@s',
    color: commonColor.textColor
  },
  rowBackground: {
    backgroundColor: commonColor.listEvenRowBg
  },
});

const portraitStyles = {};

const landscapeStyles = {};

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
