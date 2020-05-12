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
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  viewContainer: {
    flex: 1,
    marginTop: '5@s',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  spinner: {
    flex: 1,
    color: commonColor.textColor
  },
  actionContainer: {
    width: '90%',
    marginTop: '5@s',
    justifyContent: 'center'
  },
  actionButton: {
    height: '40@s',
    justifyContent: 'center'
  },
  actionButtonIcon: {
    fontSize: '20@s',
  },
  actionButtonText: {
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
