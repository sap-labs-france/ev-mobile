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
    height: '45@s',
    backgroundColor: commonColor.headerBgColorLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: '1@s',
    borderBottomColor: commonColor.brandDisabledLight,
  },
  modalTextHeader:{
    width: '100%',
    textAlign: 'center',
    fontSize: '17@s',
  },
  modalContentContainer: {
    padding: '15@s',
    justifyContent: 'flex-start',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: commonColor.headerBgColorLight,
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
    paddingBottom: 10,
    backgroundColor: commonColor.headerBgColorLight,
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
