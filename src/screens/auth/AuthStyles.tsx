import deepmerge from 'deepmerge';
import { Platform } from 'react-native';
import ResponsiveStylesheet from 'react-native-responsive-stylesheet'
import { ScaledSheet } from 'react-native-size-matters';

import commonColor from '../../theme/variables/commonColor';

const commonStyles = ScaledSheet.create({
  noDisplay: {
    flex: 1,
    backgroundColor: commonColor.brandPrimaryDark
  },
  spinner: {
    flex: 1
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
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
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
  button: {
    width: '90%',
    alignSelf: 'center',
    height: '40@s',
    marginBottom: '10@s',
    backgroundColor: commonColor.buttonBg
  },
  iconContainer: {
    flexDirection: 'row',
    width: '83%',
    justifyContent: 'flex-end'
  },
  buttonText: {
    width: '100%',
    textAlign: 'center',
    fontSize: '15@s',
    color: commonColor.inverseTextColor
  },
  inputGroup: {
    height: '40@s',
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: '10@s',
    marginLeft: 0,
    paddingLeft: '10@s',
    paddingRight: '10@s',
    backgroundColor: commonColor.inputGroupBg,
    borderColor: 'transparent'
  },
  inputIcon: {
    color: commonColor.inverseTextColor,
    alignSelf: 'center',
    textAlign: 'center',
    width: '25@s',
    fontSize: Platform.OS === 'ios' ? '20@s' : '15@s'
  },
  inputIconLock: {
    fontSize: '20@s'
  },
  inputField: {
    flex: 1,
    fontSize: '15@s',
    color: commonColor.inverseTextColor
  },
  formErrorText: {
    fontSize: '12@s',
    marginLeft: '20@s',
    color: commonColor.brandDangerLight,
    alignSelf: 'flex-start',
    top: '-5@s'
  },
  formErrorTextEula: {
    alignSelf: 'center',
    marginLeft: 0,
    textDecorationLine: 'none'
  },
  eulaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: '0@s',
    marginBottom: '20@s',
    marginTop: '10@s'
  },
  eulaCheckbox: {
    marginRight: '15@s'
  },
  eulaText: {
    fontSize: '13@s',
    color: commonColor.inverseTextColor
  },
  eulaLink: {
    fontSize: '13@s',
    color: commonColor.inverseTextColor,
    textDecorationLine: 'underline'
  },
  linksButton: {
    alignSelf: 'center',
  },
  linksTextButton: {
    fontSize: '13@s',
    fontWeight: 'bold',
    color: commonColor.inverseTextColor
  },
  footer: {
    elevation: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent'
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
