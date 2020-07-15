import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from './theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  modalContainer: {
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '35@s',
    backgroundColor:commonColor.toolbarBtnColor,
    justifyContent: 'center',
  },
  modalTextHeader:{
    width: '100%',
    textAlign: 'center',
    fontSize: '20@s',
    color: commonColor.headerBgColorLight
  },
  modalFiltersContainer: {
    backgroundColor: 'white',
    padding: '15@s',
    justifyContent: 'flex-start',
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    width: '100%'
  },
  modalButton: {
    height: '40@s',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTextButton: {
    color: commonColor.inverseTextColor,
    height: '100%',
    marginTop: '12@s',
    fontSize: '16@s'
  },
  inputFieldModal: {
    width: '79%',
    fontSize: '15@s',
    color: commonColor.defaultTextColor
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
