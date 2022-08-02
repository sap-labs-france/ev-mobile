import { CommonActions } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { Button, Footer, Form, Icon, Item, Left, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';

import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';
import { TenantConnection } from '../../../types/Tenant';

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
}

export default class ResetPassword extends BaseScreen<Props, State> {
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
        await this.centralServerProvider.clearUserPassword();
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
            case StatusCodes.MOVED_TEMPORARILY:
              const newURLDomain = error?.response?.data?.errorDetailedMessage?.redirectDomain;
              try {
                await Utils.redirectTenant(newURLDomain, tenantSubDomain);
                this.resetPassword();
              } catch ( redirectError ) {
                Message.showError('Unexpected situation, tenant redirection failed');
              }
              break;
            default:
              // Other common Error
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.resetPasswordUnexpectedError');
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
            <Form style={formStyle.form}>
              <Item inlineLabel style={formStyle.inputGroup}>
                <Icon active name="lock" type="MaterialCommunityIcons" style={formStyle.inputIcon} />
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
                  active
                  name={hidePassword ? 'eye' : 'eye-off'}
                  onPress={() => this.setState({ hidePassword: !hidePassword })}
                  style={formStyle.inputIcon}
                />
              </Item>
              {this.state.errorPassword &&
                this.state.errorPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel style={formStyle.inputGroup}>
                <Icon active name="lock" type="MaterialCommunityIcons" style={formStyle.inputIcon} />
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
                  active
                  name={hideRepeatPassword ? 'eye' : 'eye-off'}
                  onPress={() => this.setState({ hideRepeatPassword: !hideRepeatPassword })}
                  style={formStyle.inputIcon}
                />
              </Item>
              {this.state.errorRepeatPassword &&
                this.state.errorRepeatPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              {loading ? (
                <Spinner style={formStyle.spinner} color="grey" />
              ) : (
                <Button primary block style={formStyle.button} onPress={async () => this.resetPassword()}>
                  <Text style={formStyle.buttonText} uppercase={false}>
                    {I18n.t('authentication.resetPassword')}
                  </Text>
                </Button>
              )}
            </Form>
          </KeyboardAvoidingView>
        </ScrollView>
        <Footer style={style.footer}>
          <Left>
            <Button
              small
              transparent
              style={[style.linksButton, style.linksButtonLeft]}
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={[style.linksTextButton, style.linksTextButtonLeft]} uppercase={false}>
                {I18n.t('authentication.backLogin')}
              </Text>
            </Button>
          </Left>
        </Footer>
      </View>
    );
  }
}
