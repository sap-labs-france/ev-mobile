import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  rowFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '40@s',
    alignItems: 'center',
  },
  columnFilterContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: '100@s',
    alignItems: 'center',
  },
  rowFilterWithBorder: {
    borderTopWidth: 1,
    borderTopColor: commonColor.listBorderColor
  },
  textFilter: {
    fontSize: '16@s',
  },
  filterValue: {
    fontSize: '16@s',
    color: commonColor.textColor
  },
  switchFilter: {
  },
  connectorTypeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  connectorTypeButton: {
    width: '50@s',
    height: '50@s',
  },
  connectorTypeSVG: {
    width: '40@s',
    height: '40@s',
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
