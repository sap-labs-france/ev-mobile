import { CommonActions } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { Button, FormControl, Icon, Stack, Spinner } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, TextInput, Text, View } from 'react-native';

import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';
import { TenantConnection } from '../../../types/Tenant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  tenantLogo?: string;
  hash?: string;
  password?: string;
  repeatPassword?: string;
  errorPassword?: Record<string, unknown>[];
  errorRepeatPassword?: Record<string, unknown>[];
  loading?: boolean;
  hideRepeatPassword?: boolean;
  hidePassword?: boolean;
  email?: string;
}

export default class CreatePassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private repeatPasswordInput: TextInput;
  private formValidationDef = {
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
    }
  };

  public constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      hash: Utils.getParamFromNavigation(this.props.route, 'hash', null) as string,
      tenantName: '',
      tenantLogo: null,
      password: '',
      repeatPassword: '',
      loading: false,
      hidePassword: true,
      hideRepeatPassword: true
    };
  }

  // Enforce goBack to Login page as deeplinking is broken with react-navigation
  public onBack(): boolean {
    this.props.navigation.navigate('Login');
    return true;
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
      tenantName: tenant ? tenant.name : ''
    });
    // Disable Auto Login
    this.centralServerProvider.setAutoLoginDisabled(true);
  }

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    const tenantSubdomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
    const tenant = await this.centralServerProvider.getTenant(tenantSubdomain);
    await this.setTenantLogo(tenant);
  }

  public async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    const hash = Utils.getParamFromNavigation(this.props.route, 'hash', null) as string;
    const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string;
    const tenant = await this.centralServerProvider.getTenant(tenantSubDomain);
    if (hash !== this.state.hash || tenantSubDomain !== this.state.tenantSubDomain) {
      this.setState({hash, tenantSubDomain, tenantName: tenant?.name});
    }
  }

  public resetPassword = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    if (formIsValid) {
      const { tenantSubDomain, password, hash } = this.state;
      try {
        // Loading
        this.setState({ loading: true });
        // Register
        await this.centralServerProvider.resetPassword(tenantSubDomain, hash, password);
        // Clear user's credentials
        await this.centralServerProvider.clearUserPassword(tenantSubDomain);
        // Reset
        this.setState({ loading: false });
        // Show
        Message.showSuccess(I18n.t('authentication.resetPasswordSuccess'));
        // Navigate
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
                params: {
                  tenantSubDomain: this.state.tenantSubDomain
                }
              }
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
            // Invalid Hash
            case StatusCodes.NOT_FOUND:
              Message.showError(I18n.t('authentication.resetPasswordHashNotValid'));
              break;
            default:
              // Other common Error
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.resetPasswordUnexpectedError', null, null, async () => this.resetPassword());
          }
        } else {
          Message.showError(I18n.t('authentication.resetPasswordUnexpectedError'));
        }
      }
    }
  };

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { tenantName, loading, hidePassword, hideRepeatPassword, tenantLogo } = this.state;
    // Get logo
    return (
      <View style={style.container}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
            <AuthHeader navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} />
            <FormControl style={formStyle.form}>
              <Stack style={formStyle.inputGroup}>
                <Icon size={scale(20)} name="lock" as={MaterialCommunityIcons} style={formStyle.inputIcon} />
                <TextInput
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
                <Icon
                  name={hidePassword ? 'eye' : 'eye-off'}
                  size={scale(20)}
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
                <Icon name="lock" size={scale(20)} as={MaterialCommunityIcons} style={formStyle.inputIcon} />
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
                <Icon
                  as={MaterialCommunityIcons}
                  size={scale(20)}
                  name={hideRepeatPassword ? 'eye' : 'eye-off'}
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
              {loading ? (
                <Spinner style={formStyle.spinner} color="grey" />
              ) : (
                <Button style={formStyle.button} onPress={async () => this.resetPassword()}>
                  <Text style={formStyle.buttonText} >
                    {I18n.t('authentication.createPassword')}
                  </Text>
                </Button>
              )}
            </FormControl>
          </KeyboardAvoidingView>
        </ScrollView>
        <View style={style.footer}>
          <Button
            bgColor={'transparent'}
            style={[style.linksButton, style.linksButtonLeft]}
            onPress={() => this.props.navigation.navigate('Login')}>
            <Text style={[style.linksTextButton, style.linksTextButtonLeft]}>
              {I18n.t('authentication.backLogin')}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}
