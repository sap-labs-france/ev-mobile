import { CommonActions } from '@react-navigation/native';
import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import {Icon, Spinner} from 'native-base';
import React from 'react';
import {Keyboard, TextInput} from 'react-native';

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
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Input} from 'react-native-elements';

export interface Props extends BaseProps {}

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  tenantLogo?: string;
  hash?: string;
  password?: string;
  repeatPassword?: string;
  resettingPassword?: boolean;
  loading?: boolean;
  hideRepeatPassword?: boolean;
  hidePassword?: boolean;
}

export default class ResetPassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private repeatPasswordInput: TextInput;

  public constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      hash: Utils.getParamFromNavigation(this.props.route, 'hash', null) as string,
      tenantName: '',
      tenantLogo: null,
      password: '',
      repeatPassword: '',
      resettingPassword: false,
      loading: true,
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
      tenantName: tenant ? tenant.name : '',
      loading: false
    });
  }

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    const tenantSubdomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
    const tenant = await this.centralServerProvider.getTenant(tenantSubdomain);
    await this.setTenantLogo(tenant);
  }

  public resetPassword = async () => {
    // Check field
    const formIsValid = this.isFormValid();
    if (formIsValid) {
      const { tenantSubDomain, password, hash } = this.state;
      try {
        // Loading
        this.setState({ resettingPassword: true });
        // Register
        await this.centralServerProvider.resetPassword(tenantSubDomain, hash, password);
        // Clear user's credentials
        await this.centralServerProvider.clearUserPassword(tenantSubDomain);
        // Reset
        this.setState({ resettingPassword: false });
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
        this.setState({ resettingPassword: false });
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
    const { tenantName, resettingPassword, loading, hidePassword, hideRepeatPassword, tenantLogo, password, repeatPassword } = this.state;
    return loading ? (
      <Spinner style={formStyle.spinner} color="grey" />
    ) : (
      <SafeAreaView edges={['bottom', 'top']} style={style.container}>
        <AuthHeader containerStyle={{marginHorizontal: '5%', marginVertical: scale(10)}} navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo}/>
        <KeyboardAwareScrollView bounces={false} persistentScrollbar={true} contentContainerStyle={style.scrollViewContentContainer} style={style.scrollView}>
          <Input
            leftIcon={<Icon size={scale(20)} name="lock" as={MaterialCommunityIcons} style={formStyle.inputIcon}/>}
            rightIcon={<Icon
              name={hidePassword ? 'eye' : 'eye-off'}
              size={scale(20)}
              as={MaterialCommunityIcons}
              onPress={() => this.setState({hidePassword: !hidePassword})}
              style={formStyle.inputIcon}
            />}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, !Utils.validatePassword(password) && formStyle.inputTextContainerError]}
            value={password}
            placeholder={I18n.t('authentication.password')}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hidePassword}
            keyboardType={'default'}
            returnKeyType={'next'}
            onSubmitEditing={() => this.repeatPasswordInput.focus()}
            renderErrorMessage={!Utils.validatePassword(password)}
            errorMessage={!Utils.validatePassword(password) ? I18n.t('authentication.passwordRule') : null}
            errorStyle={formStyle.inputError}
            onChangeText={(newPassword) => this.setState({password: newPassword})}
          />
          <Input
            ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
            leftIcon={<Icon size={scale(20)} name="lock" as={MaterialCommunityIcons} style={formStyle.inputIcon}/>}
            rightIcon={<Icon
              as={MaterialCommunityIcons}
              size={scale(20)}
              name={hideRepeatPassword ? 'eye' : 'eye-off'}
              onPress={() => this.setState({hideRepeatPassword: !hideRepeatPassword})}
              style={formStyle.inputIcon}
            />}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, !this.checkPasswords() && formStyle.inputTextContainerError]}
            value={repeatPassword}
            placeholder={I18n.t('authentication.repeatPassword')}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hideRepeatPassword}
            keyboardType={'default'}
            returnKeyType={'done'}
            onSubmitEditing={() => Keyboard.dismiss()}
            renderErrorMessage={!this.checkPasswords()}
            errorMessage={!this.checkPasswords() ? I18n.t('authentication.passwordNotMatch') : null}
            errorStyle={formStyle.inputError}
            onChangeText={(text) => this.setState({repeatPassword: text})}
          />
          <Button
            title={I18n.t('authentication.resetPassword')}
            titleStyle={formStyle.buttonTitle}
            disabled={!this.isFormValid()}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.disabledButton}
            containerStyle={[formStyle.buttonContainer, {marginBottom: scale(20)}]}
            buttonStyle={formStyle.button}
            loading={resettingPassword}
            loadingProps={{color: commonColor.light}}
            onPress={() => void this.resetPassword()}
          />
          <Button
            title={I18n.t('authentication.backLogin')}
            titleStyle={formStyle.buttonTitle}
            containerStyle={formStyle.buttonContainer}
            buttonStyle={{...formStyle.button, ...formStyle.secondaryButton}}
            onPress={() => this.props.navigation.navigate('Login')}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  private checkPasswords(): boolean {
    const { password, repeatPassword } = this.state;
    return !repeatPassword || repeatPassword === password;
  }

  private isFormValid(): boolean {
    const { password, repeatPassword } = this.state;
    return password && repeatPassword && this.checkPasswords() && Utils.validatePassword(password);
  }
}
