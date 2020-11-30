import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';

import Utils from '../../utils/Utils';

export default function computeStyleSheet(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    modalContainer: {
      flex: 0.8,
      backgroundColor: commonColor.containerBgColor
    },
    titleView: {
      paddingBottom: '10@s',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 2,
      borderColor: 'white',
      borderRadius: 2
    },
    titleText: {
      paddingTop: '8@s',
      fontSize: '16@s',
      color: commonColor.placeholderTextColor
    },
    toolBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: '10@s',
      paddingBottom: '10@s',
      borderBottomWidth: 2,
      borderColor: 'white',
      borderRadius: 2
    },
    createTenantButton: {
      borderRadius: 4
    },
    createTenantText: {
      color: commonColor.disabled,
    },
    restoreTenantButton: {
      borderRadius: 4
    },
    restoreTenantText: {
      color: commonColor.disabled,
    },
    tenantNameText: {
      color: commonColor.disabled,
      fontSize: '15@s',
      textAlign: 'center',
      paddingTop: '15@s',
    },
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles),
    portrait: deepmerge(commonStyles, portraitStyles)
  });
}
