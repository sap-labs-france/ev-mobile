import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../theme/variables/commonColor';

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
    padding: '5@s'
  },
  tabHeader: {},
  cardIcon: {
    textAlign: 'center',
    fontSize: '35@s',
    width: '40@s'
  },
  cardText: {
    fontSize: '20@s',
  },
  cardNote: {
    fontStyle: 'italic'
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  dateValue: {
    color: commonColor.textColor
  },
  contentModal: {
    backgroundColor: 'white',
    padding: '15@s',
    justifyContent: 'flex-end',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonCloseModal: {
    height: '50@s',
  },
  textButtonCloseModal: {
    height: '100%',
    marginTop: '15@s',
    fontSize: '18@s'
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
