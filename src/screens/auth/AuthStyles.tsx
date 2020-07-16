import deepmerge from 'deepmerge';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet';
import { ScaledSheet } from 'react-native-size-matters';
import commonColor from '../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  noDisplay: {
    flex: 1,
    backgroundColor: commonColor.brandPrimaryDark
  },
  container: {
    flex: 1,
    backgroundColor: commonColor.brandPrimaryDark
  },
  keyboardContainer: {
    flex: 1
  },
  scrollContainer: {
    minHeight: '90%'
  },
  header: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    resizeMode: 'contain',
    marginTop: '10@s',
    height: '100@s'
  },
  appText: {
    color: commonColor.inverseTextColor,
    fontSize: '40@s',
    fontWeight: 'bold',
    paddingTop: '5@s'
  },
  appVersionText: {
    color: commonColor.inverseTextColor,
    fontSize: '15@s'
  },
  appTenant: {
    color: commonColor.inverseTextColor,
    marginTop: '20@s',
    fontSize: '15@s',
    alignSelf: 'center',
  },
  appTenantName: {
    color: commonColor.inverseTextColor,
    marginTop: '5@s',
    marginBottom: '5@s',
    fontSize: '15@s',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputIconLock: {
    fontSize: '20@s'
  },
  formErrorTextEula: {
    alignSelf: 'center',
    marginLeft: 0,
    textDecorationLine: 'none'
  },
  eulaLink: {
    fontSize: '13@s',
    color: commonColor.inverseTextColor,
    textDecorationLine: 'underline'
  },
  linksButton: {
    alignSelf: 'center',
    marginBottom: '15@s',
  },
  linksTextButton: {
    fontSize: '13@s',
    fontWeight: 'bold',
    color: commonColor.inverseTextColor
  },
  createOrgButton: {
    backgroundColor: commonColor.brandSuccess
  },
  restoreOrgButton: {
    backgroundColor: commonColor.brandWarning
  },
  deleteOrgButton: {
    backgroundColor: commonColor.brandDanger
  },
  fab: {
    backgroundColor: commonColor.buttonBg
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
