import I18n from 'i18n-js';
import { Button, CheckBox, Footer, Form, Icon, Item, Left, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions, StackActions } from 'react-navigation';

import computeFormStyleSheet from '../../../FormStyles';
import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
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
  CAPTCHA_SITE_KEY?: string;
  CAPTCHA_BASE_URL?: string;
  captcha?: string;
  loading?: boolean;
  hideRepeatPassword?: boolean;
  hidePassword?: boolean;
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
      CAPTCHA_SITE_KEY: null,
      CAPTCHA_BASE_URL: null,
      captcha: null,
      loading: false,
      hidePassword: true,
      hideRepeatPassword: true,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Init
    const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
    this.setState({
      tenantName: tenant ? tenant.name : '',
      CAPTCHA_SITE_KEY: this.centralServerProvider.getCaptchaSiteKey(),
      CAPTCHA_BASE_URL: this.centralServerProvider.getCAPTCHA_BASE_URL()
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
            case HTTPError.USER_EMAIL_ALREADY_EXIST_ERROR:
              Message.showError(I18n.t('authentication.emailAlreadyExists'));
              break;
            // Invalid Captcha
            case HTTPError.INVALID_CAPTCHA:
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
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const navigation = this.props.navigation;
    const { eula, loading, captcha, tenantName, CAPTCHA_SITE_KEY, CAPTCHA_BASE_URL, hidePassword, hideRepeatPassword } = this.state;
    return (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior='padding'>
            <AuthHeader navigation={this.props.navigation} tenantName={tenantName}/>
            <Form style={formStyle.form}>
              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='person' style={formStyle.inputIcon} />
                <TextInput
                  onSubmitEditing={() => this.firstNameInput.focus()}
                  selectionColor={commonColor.textColor}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.name')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  style={formStyle.inputField}
                  autoCapitalize='characters'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ name: text })}
                  secureTextEntry={false}
                />
              </Item>
              {this.state.errorName &&
                this.state.errorName.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='person' style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.firstNameInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => this.emailInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.firstName')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  style={formStyle.inputField}
                  autoCapitalize='words'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ firstName: text })}
                  secureTextEntry={false}
                />
              </Item>
              {this.state.errorFirstName &&
                this.state.errorFirstName.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='email' type='MaterialCommunityIcons' style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.emailInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  style={formStyle.inputField}
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
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='lock' type='MaterialCommunityIcons' style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => this.repeatPasswordInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  style={formStyle.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ password: text })}
                  secureTextEntry={hidePassword}
                />
                <Icon active={true} name={hidePassword ? 'eye' : 'eye-off'}
                  onPress={() => this.setState({ hidePassword: !hidePassword })}
                  style={formStyle.inputIcon} />
              </Item>
              {this.state.errorPassword &&
                this.state.errorPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='lock' type='MaterialCommunityIcons' style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.repeatPassword')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  style={formStyle.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ repeatPassword: text })}
                  secureTextEntry={hideRepeatPassword}
                />
                <Icon active={true} name={hideRepeatPassword ? 'eye' : 'eye-off'}
                  onPress={() => this.setState({ hideRepeatPassword: !hideRepeatPassword })}
                  style={formStyle.inputIcon} />
              </Item>
              {this.state.errorRepeatPassword &&
                this.state.errorRepeatPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <View style={formStyle.formCheckboxContainer}>
                <CheckBox style={formStyle.checkbox} checked={eula} onPress={() => this.setState({ eula: !eula, captcha: null })} />
                <Text style={formStyle.checkboxText}>
                  {I18n.t('authentication.acceptEula')}
                  <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
                    {I18n.t('authentication.eula')}
                  </Text>
                </Text>
              </View>
              {this.state.errorEula &&
                this.state.errorEula.map((errorMessage, index) => (
                  <Text style={[formStyle.formErrorText, style.formErrorTextEula]} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              {loading || (!captcha && this.state.eula) ? (
                <Spinner style={formStyle.spinner} color='grey'/>
              ) : (
                <Button primary={true} block={true} style={formStyle.button} onPress={() => this.signUp()}>
                  <Text style={formStyle.buttonText} uppercase={false}>{I18n.t('authentication.signUp')}</Text>
                </Button>
              )}
            </Form>
          </KeyboardAvoidingView>
          {this.state.eula && CAPTCHA_SITE_KEY && CAPTCHA_BASE_URL && (
            <ReactNativeRecaptchaV3
              action='RegisterUser'
              onHandleToken={this.recaptchaResponseToken}
              url={CAPTCHA_BASE_URL}
              siteKey={CAPTCHA_SITE_KEY}
            />
          )}
        </ScrollView>
        <Footer style={style.footer}>
          <Left>
            <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.props.navigation.goBack()}>
              <Text style={[style.linksTextButton, style.linksTextButtonLeft]} uppercase={false}>{I18n.t('authentication.backLogin')}</Text>
            </Button>
          </Left>
        </Footer>
      </Animatable.View>
    );
  }
}
