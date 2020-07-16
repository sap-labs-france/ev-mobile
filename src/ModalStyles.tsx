import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from './theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  modal: {
  },
  modalContainer: {
    backgroundColor: commonColor.headerBgColorLight,
  },
  modalHeaderContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '45@s',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: '1@s',
    borderBottomColor: commonColor.brandDisabledLight,
    borderTopLeftRadius: '5@s',
    borderTopRightRadius: '5@s',
  },
  modalTextHeader:{
    width: '100%',
    textAlign: 'center',
    fontSize: '17@s',
  },
  modalContentContainer: {
    paddingLeft: '15@s',
    paddingRight: '15@s',
    paddingTop: '5@s',
    paddingBottom: '5@s',
    justifyContent: 'flex-start',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '35@s',
    alignItems: 'center',
  },
  modalRowError: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  modalErrorText: {
    fontSize: '12@s',
    color: commonColor.brandDangerLight,
  },
  modalLabel: {
    fontSize: '14@s',
  },
  modalInputField: {
    width: '65%',
    fontSize: '14@s',
    color: commonColor.defaultTextColor
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingTop: '5@s',
    paddingBottom: '5@s',
    borderBottomLeftRadius: '5@s',
    borderBottomRightRadius: '5@s',
  },
  modalButton: {
    height: '40@s',
    width: '40%',
    alignItems: 'center',
    borderRadius: '5@s',
  },
  modalTextButton: {
    height: '100%',
    marginTop: 12,
    fontSize: '14@s',
    fontWeight: 'bold',
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
