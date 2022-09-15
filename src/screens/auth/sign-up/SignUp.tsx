import { CommonActions } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { Button, Checkbox, FormControl, IIconProps, Icon, Spinner, Stack } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import computeFormStyleSheet from '../../../FormStyles';
import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import { TenantConnection } from '../../../types/Tenant';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';

export interface Props extends BaseProps {}

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  tenantLogo?: string;
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
  hideRepeatPassword?: boolean;
  performSignUp?: boolean;
  hidePassword?: boolean;
  errorEula?: Record<string, unknown>[];
  errorPassword?: Record<string, unknown>[];
  errorTenant?: Record<string, unknown>[];
  errorEmail?: Record<string, unknown>[];
  errorName?: Record<string, unknown>[];
  errorFirstName?: Record<string, unknown>[];
  errorRepeatPassword?: Record<string, unknown>[];
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

  public constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      tenantName: '',
      tenantLogo: null,
      name: '',
      firstName: '',
      email: Utils.getParamFromNavigation(this.props.route, 'email', '') as string,
      password: '',
      repeatPassword: '',
      eula: false,
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      loading: false,
      hidePassword: true,
      hideRepeatPassword: true,
      performSignUp: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async setTenantLogo(tenant: TenantConnection): Promise<void> {
    try {
      if (tenant) {
        const tenantLogo = await this.centralServerProvider.getTenantLogoBySubdomain(tenant);
        this.setState({tenantLogo});
      }
    } catch (error) {
      switch ( error?.request?.status ) {
        case StatusCodes.NOT_FOUND:
          return null;
        default:
          await Utils.handleHttpUnexpectedError(
            this.centralServerProvider,
            error,
            null,
            null,
            null,
            async (redirectedTenant: TenantConnection) => this.setTenantLogo(redirectedTenant)
          );
          break;
      }
    }
    return null;
  }

  public async componentDidMount(): Promise<void> {
    // Call parent
    await super.componentDidMount();
    // Init
    const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
    await this.setTenantLogo(tenant);
    this.setState({
      tenantName: tenant ? tenant.name : '',
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
    // Disable Auto Login
    this.centralServerProvider.setAutoLoginDisabled(true);
  }

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
    const tenant = await this.centralServerProvider.getTenant(tenantSubDomain.toString());
    await this.setTenantLogo(tenant);
  }

  public onCaptchaCreated = (captcha: string) => {
    this.setState({ captcha }, this.state.performSignUp ? async () => this.signUp() : () => {});
  };

  public async signUp(): Promise<void> {
    // Check field
    const { tenantSubDomain, name, firstName, email, password, eula, captcha } = this.state
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    // Force captcha regeneration for next signUp click
    if (formIsValid && captcha && eula) {
      try {
        // Register
        await this.centralServerProvider.register(
          tenantSubDomain,
          name,
          firstName,
          email,
          Utils.getDeviceDefaultSupportedLocale(),
          password,
          eula,
          captcha
        );
        // Reset
        this.setState({ loading: false, performSignUp: false });
        // Show
        Message.showSuccess(I18n.t('authentication.registerSuccess'));
        // Navigate
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
                params: {
                  tenantSubDomain: this.state.tenantSubDomain,
                  email: this.state.email
                }
              }
            ]
          })
        );
      } catch (error) {
        // Reset
        this.setState({ loading: false, performSignUp: false });
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
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.registerUnexpectedError', null, null, async () => this.signUp());
          }
        } else {
          Message.showError(I18n.t('authentication.registerUnexpectedError'));
        }
      }
    }
    this.setState({loading: false, performSignUp: false})
  };

  public onBack(): boolean {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('Login', {
      tenantSubDomain: this.state.tenantSubDomain
    });
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const navigation = this.props.navigation;
    const { eula, loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl, hidePassword, hideRepeatPassword, tenantLogo } = this.state;
    const InputIcon = (props: IIconProps) => <Icon size={scale(20)} {...props} />;
    // Get logo
    return (
      <View style={style.container}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
            <AuthHeader navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} />
            <FormControl style={formStyle.form}>
              <Stack style={formStyle.inputGroup}>
                <InputIcon as={MaterialIcons} name="person" style={formStyle.inputIcon} />
                <TextInput
                  onSubmitEditing={() => this.firstNameInput.focus()}
                  selectionColor={commonColor.textColor}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.name')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="characters"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ name: text })}
                  secureTextEntry={false}
                />
              </Stack>
              {this.state.errorName &&
                this.state.errorName.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Stack style={formStyle.inputGroup}>
                <InputIcon as={MaterialIcons} name="person" style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.firstNameInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => this.emailInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.firstName')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="words"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ firstName: text })}
                  secureTextEntry={false}
                />
              </Stack>
              {this.state.errorFirstName &&
                this.state.errorFirstName.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Stack style={formStyle.inputGroup}>
                <InputIcon  name="email" as={MaterialCommunityIcons} style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.emailInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  onChangeText={(text) => this.setState({ email: text })}
                  secureTextEntry={false}
                  value={this.state.email}
                />
              </Stack>
              {this.state.errorEmail &&
                this.state.errorEmail.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}

              <Stack style={formStyle.inputGroup}>
                <InputIcon name="lock" as={MaterialCommunityIcons} style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => this.repeatPasswordInput.focus()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ password: text })}
                  secureTextEntry={hidePassword}
                />
                <InputIcon
                  name={hidePassword ? 'eye' : 'eye-off'}
                  as={MaterialCommunityIcons}
                  onPress={() => this.setState({ hidePassword: !hidePassword })}
                  style={formStyle.inputIcon}
                />
              </Stack>
              {this.state.errorPassword &&
                this.state.errorPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Stack style={formStyle.inputGroup}>
                <InputIcon name="lock" as={MaterialCommunityIcons} style={formStyle.inputIcon} />
                <TextInput
                  ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
                  selectionColor={commonColor.textColor}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  returnKeyType={'next'}
                  placeholder={I18n.t('authentication.repeatPassword')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  onChangeText={(text) => this.setState({ repeatPassword: text })}
                  secureTextEntry={hideRepeatPassword}
                />
                <InputIcon
                  name={hideRepeatPassword ? 'eye' : 'eye-off'}
                  as={MaterialCommunityIcons}
                  onPress={() => this.setState({ hideRepeatPassword: !hideRepeatPassword })}
                  style={formStyle.inputIcon}
                />
              </Stack>
              {this.state.errorRepeatPassword &&
                this.state.errorRepeatPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <TouchableOpacity onPress={() => this.setState({ eula: !eula})} style={formStyle.formCheckboxContainer}>
                <Checkbox _icon={{color: commonColor.textColor}} value={'checkbox'} style={formStyle.checkbox} isChecked={eula} onChange={() => this.setState({ eula: !eula})} />
                <Text style={formStyle.checkboxText}>
                  {I18n.t('authentication.acceptEula')}
                  <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
                    {I18n.t('authentication.eula')}
                  </Text>
                </Text>
              </TouchableOpacity>
              {this.state.errorEula &&
                this.state.errorEula.map((errorMessage, index) => (
                  <Text style={[formStyle.formErrorText, style.formErrorTextEula]} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              {loading ? (
                <Spinner style={formStyle.spinner} color="grey" />
              ) : (
                <Button disabled={!eula} primary block style={[formStyle.button, !eula && formStyle.buttonDisabled]} onPress={async () => this.setState({captcha: null, performSignUp: true, loading: true })}>
                  <Text style={formStyle.buttonText} uppercase={false}>
                    {I18n.t('authentication.signUp')}
                  </Text>
                </Button>
              )}
            </FormControl>
          </KeyboardAvoidingView>
          {!captcha && captchaSiteKey && captchaBaseUrl && (
            <ReactNativeRecaptchaV3
              action="RegisterUser"
              onHandleToken={(captcha) => this.onCaptchaCreated(captcha)}
              url={captchaBaseUrl}
              siteKey={captchaSiteKey}
            />
          )}
        </ScrollView>
        <View style={style.footer}>
          <Button bgColor={'transparent'} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.onBack()}>
            <Text style={[style.linksTextButton, style.linksTextButtonLeft]} uppercase={false}>
              {I18n.t('authentication.backLogin')}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}
