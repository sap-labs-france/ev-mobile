import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../theme/variables/commonColor';
import { Platform } from 'react-native';

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
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '10@s'
  },
  button: {
    width: '50%',
    alignSelf: 'center',
    height: '30@s',
    marginBottom: '10@s',
    backgroundColor: commonColor.buttonBg
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    fontSize: '13@s',
    color: commonColor.textColor
  },
  inputGroup: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '10@s',
    marginLeft: 0,
    paddingLeft: '10@s',
    paddingRight: '10@s',
    backgroundColor: commonColor.inputGroupBg,
    borderColor: commonColor.inputBorderColor,

  },
  inputIcon: {
    color: commonColor.iconStyle,
    alignSelf: 'center',
    textAlign: 'center',
    width: '25@s',
    fontSize: Platform.OS === 'ios' ? '20@s' : '15@s'
  },
  inputField: {
    fontSize: '15@s',
    color: 'black'
  },
  formErrorText: {
    fontSize: '12@s',
    marginLeft: '20@s',
    color: commonColor.brandDangerLight,
    alignSelf: 'flex-start',
    top: '-5@s'
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
