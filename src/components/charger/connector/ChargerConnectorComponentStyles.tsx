import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: commonColor.listBorderColor
  },
  connectorContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%'
  },
  connectorDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    paddingLeft: '5@s',
    paddingRight: '5@s',
    paddingTop: '10@s',
    paddingBottom: '10@s'
  },
  connectorDetail: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60@s',
    width: '80@s',
    color: commonColor.textColor
  },
  connectorDetailAnimated: {
    position: 'absolute',
    alignItems: 'center'
  },
  connectorValues: {
    color: commonColor.textColor,
    marginTop: '-1@s',
    fontSize: '30@s',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  connectorSVG: {
    width: '40@s',
    height: '40@s'
  },
  labelImage: {
    color: commonColor.textColor,
    paddingTop: '2@s',
    fontSize: '10@s'
  },
  label: {
    color: commonColor.textColor,
    fontSize: '10@s',
    marginTop: '-3@s'
  },
  subLabel: {
    color: commonColor.textColor,
    fontSize: '9@s'
  },
  icon: {
    fontSize: '30@s'
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
