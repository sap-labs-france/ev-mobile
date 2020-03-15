import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  contentModalFilter: {
    backgroundColor: 'white',
    padding: '15@s',
    justifyContent: 'flex-start',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentVisibleFilter: {
    backgroundColor: 'white',
    paddingLeft: '10@s',
    paddingRight: '10@s',
    justifyContent: 'flex-start',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentButton: {
    flexDirection: 'row',
    width: '100%'
  },
  buttonFilter: {
    height: '40@s',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textButtonFilter: {
    color: commonColor.inverseTextColor,
    height: '100%',
    marginTop: '12@s',
    fontSize: '16@s'
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0
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
