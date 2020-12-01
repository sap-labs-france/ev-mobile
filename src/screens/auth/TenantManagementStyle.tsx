import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modalContainer: {
      flex: 1,
      backgroundColor: commonColor.containerBgColor
    },
    toolBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: '5@s',
      paddingBottom: '5@s',
      borderBottomWidth: 1,
      borderColor: commonColor.textColor,
      borderRadius: 1
    },
    tenantNameView: {
      paddingTop: '15@s',
      backgroundColor: commonColor.containerBgColor,
      height: '50@s'
    },
    tenantNameText: {
      color: commonColor.textColor,
      fontSize: '16@s',
      textAlign: 'center',
    },
    trashIconButton: {
      alignSelf: 'flex-end',
      height: '50@s'
    },
    icon: {
      color: commonColor.textColor
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
