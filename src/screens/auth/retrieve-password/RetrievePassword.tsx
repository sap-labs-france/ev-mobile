import { CommonActions } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import {Icon, Spinner} from 'native-base';
import React from 'react';

import computeFormStyleSheet from '../../../FormStyles';
import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';
import { TenantConnection } from '../../../types/Tenant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';
import {Button, Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import HeaderComponent from '../../../components/header/HeaderComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export interface Props extends BaseProps {}

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  email?: string;
  captchaSiteKey?: string;
  captchaBaseUrl?: string;
  captcha?: string;
  performRetrievePassword?: boolean;
  retrievingPassword?: boolean;
  loading?: boolean;
  tenantLogo?: null;
}

export default class RetrievePassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      tenantName: '',
      email: Utils.getParamFromNavigation(this.props.route, 'email', '') as string,
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      retrievingPassword: false,
      loading: true,
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
      loading: false,
      tenantName: tenant ? tenant.name : '',
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
  }

  public onCaptchaCreated = (captcha: string) => {
    this.setState({ captcha }, this.state.performRetrievePassword ? async () => this.retrievePassword() : () => {});
  };

  public retrievePassword = async () => {
    // Check field
    const { tenantSubDomain, email, captcha } = this.state;
    // Force captcha regeneration for next signUp click
    if (email && captcha) {
      try {
        // Login
        await this.centralServerProvider.retrievePassword(tenantSubDomain, email, captcha);
        // Login Success
        this.setState({ retrievingPassword: false, performRetrievePassword: false });
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
        this.setState({ retrievingPassword: false, performRetrievePassword: false });
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
    this.setState({ retrievingPassword: false});
  };

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { retrievingPassword, loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl, tenantLogo, email, performRetrievePassword } = this.state;
    return loading ? (
      <Spinner style={formStyle.spinner} color="grey" />
    ) : (
      <SafeAreaView edges={['bottom']} style={style.container}>
        <HeaderComponent
          containerStyle={style.headerContainer}
          navigation={this.props.navigation}
          title={I18n.t('authentication.retrievePassword')}
        />
        <AuthHeader containerStyle={{marginHorizontal: '5%', marginBottom: scale(10)}} navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} />
        <KeyboardAwareScrollView bounces={false} contentContainerStyle={style.scrollViewContentContainer} style={style.scrollView}>
          <Input
            leftIcon={<Icon size={scale(20)} name="email" as={MaterialCommunityIcons} style={formStyle.inputIcon} />}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={formStyle.inputTextContainer}
            value={email}
            placeholder={I18n.t('authentication.email')}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType={'emailAddress'}
            keyboardType={'email-address'}
            returnKeyType={'done'}
            renderErrorMessage={false}
            onChangeText={(newEmail) => this.setState({ email: newEmail })}
          />
          <Button
            title={I18n.t('authentication.retrievePassword')}
            titleStyle={formStyle.buttonText}
            disabled={!email}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.buttonTextDisabled}
            containerStyle={{...formStyle.buttonContainer, marginBottom: scale(20)}}
            buttonStyle={formStyle.button}
            loading={retrievingPassword}
            loadingProps={{color: commonColor.light}}
            onPress={() => this.onRetrievePassword()}
          />
          {captchaSiteKey && captchaBaseUrl && !captcha && performRetrievePassword && (
            <ReactNativeRecaptchaV3
              action="ResetPassword"
              onHandleToken={(token: string) => this.onCaptchaCreated(token)}
              url={captchaBaseUrl}
              siteKey={captchaSiteKey}
            />
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  private onRetrievePassword(): void {
    this.setState({retrievingPassword: true, performRetrievePassword: true});
  }
}
