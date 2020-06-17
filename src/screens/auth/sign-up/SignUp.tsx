import I18n from 'i18n-js';
import { Button, CheckBox, Footer, Form, Icon, Item, Left, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, Text as TextRN, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions, StackActions } from 'react-navigation';

import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';

export interface Props extends BaseProps {
}

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  name?: string;
  firstName?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  eula?: boolean;
  captchaSiteKey?: string;
  captchaBaseUrl?: string;
  captcha?: string;
  loading?: boolean;
  errorEula?: object[];
  errorPassword?: object[];
  errorTenant?: object[];
  errorEmail?: object[];
  errorName?: object[];
  errorFirstName?: object[];
  errorRepeatPassword?: object[];
}

export default class SignUp extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private passwordInput: TextInput;
  private firstNameInput: TextInput;
  private emailInput: TextInput;
  private repeatPasswordInput: TextInput;
  private formValidationDef = {
    name: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryName')
      }
    },
    firstName: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryFirstName')
      }
    },
    email: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryEmail')
      },
      email: {
        message: '^' + I18n.t('authentication.invalidEmail')
      }
    },
    password: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryPassword')
      },
      equality: {
        attribute: 'ghost',
        message: '^' + I18n.t('authentication.passwordRule'),
        comparator(password: string, ghost: string) {
          // True if EULA is checked
          return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#@:;,<>\/''\$%\^&\*\.\?\-_\+\=\(\)])(?=.{8,})/.test(password);
        }
      }
    },
    repeatPassword: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryPassword')
      },
      equality: {
        attribute: 'password',
        message: '^' + I18n.t('authentication.passwordNotMatch')
      }
    },
    eula: {
      equality: {
        attribute: 'ghost',
        message: I18n.t('authentication.eulaNotAccepted'),
        comparator(eula: boolean, ghost: boolean) {
          // True if EULA is checked
          return eula;
        }
      }
    }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.navigation, 'tenantSubDomain', ''),
      tenantName: '',
      name: '',
      firstName: '',
      email: Utils.getParamFromNavigation(this.props.navigation, 'email', ''),
      password: '',
      repeatPassword: '',
      eula: false,
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      loading: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Init
    const tenant = this.centralServerProvider.getTenant(this.state.tenantSubDomain);
    this.setState({
      tenantName: tenant ? tenant.name : '',
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
    // Disable Auto Login
    this.centralServerProvider.setAutoLoginDisabled(true);
  }

  public recaptchaResponseToken = (captcha: string) => {
    this.setState({ captcha });
  };

  public signUp = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    if (formIsValid) {
      const { tenantSubDomain, name, firstName, email, password, repeatPassword, eula, captcha } = this.state;
      try {
        // Loading
        this.setState({ loading: true });
        // Register
        await this.centralServerProvider.register(tenantSubDomain, name, firstName, email, Utils.getDeviceDefaultSupportedLocale(), { password, repeatPassword }, eula, captcha);
        // Reset
        this.setState({ loading: false });
        // Show
        Message.showSuccess(I18n.t('authentication.registerSuccess'));
        // Navigate
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Login',
                params: {
                  tenantSubDomain: this.state.tenantSubDomain,
                  email: this.state.email
                }
              })
            ]
          })
        );
      } catch (error) {
        // Reset
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Email already exists
            case 510:
              Message.showError(I18n.t('authentication.emailAlreadyExists'));
              break;
            // Invalid Captcha
            case 530:
              Message.showError(I18n.t('authentication.invalidCaptcha'));
              break;
            default:
              // Other common Error
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
                'authentication.registerUnexpectedError');
          }
        } else {
          Message.showError(I18n.t('authentication.registerUnexpectedError'));
        }
      }
    }
  };

  public onBack = (): boolean => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('Login');
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { eula, loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl } = this.state;
    return (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior='padding'>
            <AuthHeader navigation={this.props.navigation} tenantName={tenantName} />
            <Form style={style.form}>
              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='person' style={style.inputIcon} />
                <TextInput
                  onSubmitEditing={() => this.firstNameInput.focus()}
                  selectionColor={commonColor.inverseTextColor}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.name')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={style.inputField}
                  autoCapitalize='characters'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ name: text })}
                  secureTextEntry={false}
                />
              </Item>
              {this.state.errorName &&
                this.state.errorName.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='person' style={style.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.firstNameInput = ref)}
                  selectionColor={commonColor.inverseTextColor}
                  onSubmitEditing={() => this.emailInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.firstName')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={style.inputField}
                  autoCapitalize='words'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ firstName: text })}
                  secureTextEntry={false}
                />
              </Item>
              {this.state.errorFirstName &&
                this.state.errorFirstName.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='mail' style={style.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.emailInput = ref)}
                  selectionColor={commonColor.inverseTextColor}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={style.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  onChangeText={(text) => this.setState({ email: text })}
                  secureTextEntry={false}
                />
              </Item>
              {this.state.errorEmail &&
                this.state.errorEmail.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='unlock' style={style.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  selectionColor={commonColor.inverseTextColor}
                  onSubmitEditing={() => this.repeatPasswordInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={style.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ password: text })}
                  secureTextEntry={true}
                />
              </Item>
              {this.state.errorPassword &&
                this.state.errorPassword.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='unlock' style={style.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
                  selectionColor={commonColor.inverseTextColor}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.repeatPassword')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={style.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ repeatPassword: text })}
                  secureTextEntry={true}
                />
              </Item>
              {this.state.errorRepeatPassword &&
                this.state.errorRepeatPassword.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <View style={style.eulaContainer}>
                <CheckBox style={style.eulaCheckbox} checked={eula} onPress={() => this.setState({ eula: !eula })} />
                <Text style={style.eulaText}>
                  {I18n.t('authentication.acceptEula')}
                  <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
                    {I18n.t('authentication.eula')}
                  </Text>
                </Text>
              </View>
              {this.state.errorEula &&
                this.state.errorEula.map((errorMessage, index) => (
                  <Text style={[style.formErrorText, style.formErrorTextEula]} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              {loading || (!captcha && this.state.eula) ? (
                <Spinner style={style.spinner} color='white' />
              ) : (
                  <Button rounded={true} primary={true} block={true} style={style.button} onPress={() => this.signUp()}>
                    <TextRN style={style.buttonText}>{I18n.t('authentication.signUp')}</TextRN>
                  </Button>
                )}
            </Form>
          </KeyboardAvoidingView>
          {this.state.eula && captchaSiteKey && captchaBaseUrl && (
            <ReactNativeRecaptchaV3
              action='RegisterUser'
              onHandleToken={this.recaptchaResponseToken}
              url={captchaBaseUrl}
              siteKey={captchaSiteKey}
            />
          )}
        </ScrollView>
        <Footer style={style.footer}>
          <Left>
            <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.props.navigation.goBack()}>
              <TextRN style={[style.linksTextButton, style.linksTextButtonLeft]}>{I18n.t('authentication.backLogin')}</TextRN>
            </Button>
          </Left>
        </Footer>
      </Animatable.View>
    );
  }
}
