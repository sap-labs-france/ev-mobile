import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  visibleContainer: {
    paddingLeft: '10@s',
    paddingRight: '10@s',
    justifyContent: 'flex-start',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: commonColor.containerBgColor
  },
  visibleExpandedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: commonColor.listBorderColor,
    backgroundColor: commonColor.containerBgColor
  },
  visibleExpandedIcon: {
    fontSize: '25@s'
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
