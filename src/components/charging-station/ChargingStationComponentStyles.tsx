import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.brandPrimaryDark
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '40@s',
    borderBottomWidth: 1,
    borderBottomColor: commonColor.listBorderColor,
    backgroundColor: commonColor.headerBgColor
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '70%',
  },
  subHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '25@s',
    paddingRight: '5@s',
    paddingLeft: '5@s',

  },
  headerName: {
    marginLeft: '10@s',
    fontSize: '20@s',
    fontWeight: 'bold',
    color: commonColor.headerTextColor
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  button: {
  },
  buttonRight: {
    marginRight: '10@s',
  },
  icon: {
    fontSize: '30@s',
    color: commonColor.headerTextColor
  },
  iconLeft: {
    marginLeft: '10@s',
  },
  iconRight: {
    marginRight: '10@s',
  },
  iconLocation: {
    marginTop: '5@s',
  },
  iconSettings: {
    marginTop: Platform.OS === 'ios' ? '-3@s' : 0,
  },
  heartbeatIcon: {
    color: commonColor.brandSuccess,
    paddingLeft: '20@s',
    fontSize: '18@s'
  },
  deadHeartbeatIcon: {
    color: commonColor.brandDanger,
    paddingLeft: '20@s',
    fontSize: '18@s'
  },
  connectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
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
