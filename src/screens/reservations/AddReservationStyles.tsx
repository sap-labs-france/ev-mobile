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
      backgroundColor: commonColor.containerBgColor
    },
    headerContainer: {
      marginBottom: '10@s'
    },
    content: {
      width: '100%',
      height: 'auto',
      paddingTop: '15@s',
      alignItems: 'center'
    },
    scrollview: {
      height: 'auto'
    },
    itemContainer: {
      width: '100%',
      height: '70@s',
      flexDirection: 'row',
      alignItems: 'center'
    },
    carPlaceholderContainer: {
      backgroundColor: commonColor.listItemBackground
    },
    selectField: {
      width: '100%',
      height: 'auto',
      minHeight: '40@s',
      paddingHorizontal: 0,
      borderRadius: '18@s',
      backgroundColor: commonColor.listItemBackground
    },
    selectFieldDisabled: {
      opacity: 0.4
    },
    selectFieldText: {
      color: commonColor.textColor,
      textAlign: 'left',
      marginHorizontal: 0,
      fontSize: '14@s',
      paddingTop: 5
    },
    selectFieldTextPlaceholder: {
      color: commonColor.disabledDark
    },
    selectDropdown: {
      backgroundColor: commonColor.listItemBackground
    },
    selectDropdownRow: {
      borderBottomWidth: 0
    },
    selectDropdownRowText: {
      color: commonColor.textColor,
      paddingVertical: 0,
      textAlign: 'left',
      paddingLeft: 0,
      fontSize: '14@s'
    },
    reservationTypeContainer: {
      width: '100%',
      marginVertical: '10@s'
    },
    paddedInputTextContainer: {},
    dropdownIcon: {
      color: commonColor.textColor
    },
    defaultContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '95%',
      marginBottom: '20@s'
    },
    twoItemsContainer: { width: '100%', flexDirection: 'row', justifyContent: 'space-around' }
  });
  const portraitStyles = {};
  const landscapeStyles = {};
  return ResponsiveStylesSheet.createOriented({
    landscape: deepmerge(commonStyles, landscapeStyles) as StyleSheet.NamedStyles<any>,
    portrait: deepmerge(commonStyles, portraitStyles) as StyleSheet.NamedStyles<any>
  });
}
