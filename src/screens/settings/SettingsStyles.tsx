import deepmerge from 'deepmerge';
import { StyleSheet } from 'react-native';
import ResponsiveStylesSheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import Utils from '../../utils/Utils';

export default function computeStyleSheet(): StyleSheet.NamedStyles<any> {
  const commonColor = Utils.getCurrentCommonColor();
  const commonStyles = ScaledSheet.create({
    container: {
      height: '100%',
      width: '100%',
      backgroundColor: commonColor.containerBgColor
    },
    content: {
      flex: 1,
      alignItems: 'center',
      width: '100%'
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    settingSection: {
      width: '90%'
    },
    selectDropdownButton: {
      backgroundColor: commonColor.selectFieldBackgroundColor,
      width: '100%',
      borderRadius: '8@s',
      borderColor: commonColor.textColor,
      borderWidth: 0.8,
      height: '40@s'
    },
    selectDropdownButtonText: {
      color: commonColor.textColor,
      fontSize: '14@s'
    },
    selectDropdown: {
      backgroundColor: commonColor.selectFieldBackgroundColor
    },
    selectDropdownRow: {
      borderBottomWidth: 0
    },
    selectDropdownRowContainer: {
      paddingHorizontal: '5@s'
    },
    selectDropdownRowText: {
      color: commonColor.textColor,
      fontSize: '14@s',
      textAlign: 'center'
    },
    settingLabel: {
      fontSize: '14@s',
      color: commonColor.textColor,
      fontWeight: 'bold',
      paddingVertical: '4@s'
    }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
