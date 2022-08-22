import { CommonActions } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import { Button, Footer, Form, Icon, Item, Left, Spinner, Text, View } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity } from 'react-native';

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
  email?: string;
  captchaSiteKey?: string;
  captchaBaseUrl?: string;
  captcha?: string;
  performRetrievePassword?: boolean;
  loading?: boolean;
  errorEmail?: Record<string, unknown>[];
  tenantLogo?: null;
}

export default class RetrievePassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private formValidationDef = {
    email: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryEmail')
      },
      email: {
        message: '^' + I18n.t('authentication.invalidEmail')
      }
    }
  };

  public constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      tenantName: '',
      email: Utils.getParamFromNavigation(this.props.route, 'email', '') as string,
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      loading: false,
      performRetrievePassword: false,
      tenantLogo: null
    };
  }

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

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
    const tenant = await this.centralServerProvider.getTenant(tenantSubDomain);
    await this.setTenantLogo(tenant);
    this.setState( {
      tenantSubDomain,
      tenantName: tenant.name
    });

  }

  public async componentDidMount(): Promise<void> {
    // Call parent
    await super.componentDidMount();
    const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
    // Init
    await this.setTenantLogo(tenant);
    this.setState({
      tenantName: tenant ? tenant.name : '',
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
    // Disable Auto Login
    this.centralServerProvider.setAutoLoginDisabled(true);
  }

  public onCaptchaCreated = (captcha: string) => {
    this.setState({ captcha }, this.state.performRetrievePassword ? async () => this.retrievePassword() : () => {});
  };

  public retrievePassword = async () => {
    // Check field
    const { tenantSubDomain, email, captcha } = this.state;
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    // Force captcha regeneration for next signUp click
    if (formIsValid && captcha) {
      try {
        // Login
        await this.centralServerProvider.retrievePassword(tenantSubDomain, email, captcha);
        // Login Success
        this.setState({ loading: false, performRetrievePassword: false });
        // Show
        Message.showSuccess(I18n.t('authentication.resetSuccess'));
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
        // Login failed
        this.setState({ loading: false, performRetrievePassword: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Invalid Captcha
            case HTTPError.INVALID_CAPTCHA:
              Message.showError(I18n.t('authentication.invalidCaptcha'));
              break;
            // Unknown Email
            case StatusCodes.NOT_FOUND:
              Message.showError(I18n.t('authentication.wrongEmail'));
              break;
            default:
              // Other common Error
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.resetPasswordUnexpectedError', null, null, async () => this.retrievePassword());
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
    const { loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl, tenantLogo } = this.state;
    // Get logo
    return (
      <View style={style.container}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
            <AuthHeader navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} />
            <Form style={formStyle.form}>
              <Item inlineLabel style={formStyle.inputGroup}>
                <Icon active name="email" type="MaterialCommunityIcons" style={formStyle.inputIcon} />
                <TextInput
                  returnKeyType={'next'}
                  selectionColor={commonColor.textColor}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  onChangeText={(text) => this.setState({ email: text })}
                  value={this.state.email}
                />
              </Item>
              {this.state.errorEmail &&
                this.state.errorEmail.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              {loading ? (
                <Spinner style={formStyle.spinner} color="grey" />
              ) : (
                <Button primary block style={formStyle.button} onPress={this.onRetrievePassword.bind(this)}>
                  <Text style={formStyle.buttonText} uppercase={false}>
                    {I18n.t('authentication.retrievePassword')}
                  </Text>
                </Button>
              )}
            </Form>
          </KeyboardAvoidingView>
          {captchaSiteKey && captchaBaseUrl && !captcha && (
            <ReactNativeRecaptchaV3
              action="ResetPassword"
              onHandleToken={this.onCaptchaCreated.bind(this)}
              url={captchaBaseUrl}
              siteKey={captchaSiteKey}
            />
          )}
        </ScrollView>
        <Footer style={style.footer}>
          <Left>
            <TouchableOpacity style={[style.linksFooterButton]} onPress={() => this.props.navigation.goBack()}>
              <Text style={[style.linksTextButton]} uppercase={false}>
                {I18n.t('authentication.backLogin')}
              </Text>
            </TouchableOpacity>
          </Left>
        </Footer>
      </View>
    );
  }

  private onRetrievePassword(): void {
    this.setState({loading: true, performRetrievePassword: true, captcha: null});
  }
}
