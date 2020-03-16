import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  modalContainer: {
    // justifyContent: 'flex-end',
    // margin: 0
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
  visibleContainer: {
    paddingLeft: '10@s',
    paddingRight: '10@s',
    justifyContent: 'flex-start',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: commonColor.containerBgColor
  },
  visibleExpandContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: commonColor.listBorderColor,
    backgroundColor: commonColor.containerBgColor
  },
  visbleExpandIcon: {
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
