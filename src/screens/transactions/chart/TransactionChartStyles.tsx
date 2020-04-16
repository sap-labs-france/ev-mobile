import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

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
  chart: {
    height: '87%'
  },
  chartWithHeader: {
    height: '78%'
  },
  notAuthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8@s',
    backgroundColor: commonColor.headerBgColorLight
  },
  headerValue: {
    fontSize: '18@s',
    fontWeight: 'bold'
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
  notData: {
    marginTop: '20@s',
    fontSize: '14@s',
    textAlign: 'center'
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

export default function computeStyleSheet(): any {
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
