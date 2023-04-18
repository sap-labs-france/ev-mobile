import { StatusCodes } from 'http-status-codes';
import I18n from 'i18n-js';
import {Icon, Spinner} from 'native-base';
import React from 'react';
import {
  BackHandler,
  Keyboard,
  TouchableOpacity,
  Text,
  View, TextInput,
} from 'react-native';

import DialogModal from '../../../components/modal/DialogModal';
import computeModalCommonStyle from '../../../components/modal/ModalCommonStyle';
import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import { TenantConnection } from '../../../types/Tenant';
import Message from '../../../utils/Message';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from '../AuthStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { scale } from 'react-native-size-matters';
import {AuthContext, AuthService} from '../../../context/AuthContext';
import {Button, CheckBox, Input} from 'react-native-elements';
import {getVersion} from 'react-native-device-info';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AuthHeader from '../AuthHeader';

export interface Props extends BaseProps {}

interface State {
  activeFab?: boolean;
  eula?: boolean;
  password?: string;
  email?: string;
  tenantName?: string;
  tenantSubDomain?: string;
  tenantLogo?: string;
  loggingIn?: boolean;
  loading?: boolean;
  hidePassword?: boolean;
  showNoTenantFoundDialog: boolean;
}

export default class Login extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private tenants: TenantConnection[] = [];
  private passwordInput: TextInput;
  private authService: AuthService;

  public constructor(props: Props) {
    super(props);
    this.state = {
      activeFab: false,
      eula: false,
      password: null,
      email: Utils.getParamFromNavigation(this.props.route, 'email', '') as string,
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      tenantName: I18n.t('authentication.tenant'),
      loggingIn: false,
      loading: true,
      hidePassword: true,
      showNoTenantFoundDialog: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount() {
    await super.componentDidMount();
    let email = (this.state.email = '');
    let password = (this.state.password = '');
    let tenant: TenantConnection;
    // Get tenants
    this.tenants = await this.centralServerProvider.getTenants();
    if (Utils.isEmptyArray(this.tenants)) {
      this.setState({ showNoTenantFoundDialog: true });
    }
    // Check if sub-domain is provided
    if (!this.state.tenantSubDomain) {
      // Not provided: Use last saved connexion info
      const userCredentials = await SecuredStorage.getUserCredentials();
      if (userCredentials) {
        tenant = await this.centralServerProvider.getTenant(userCredentials.tenantSubDomain);
        email = userCredentials.email;
        password = userCredentials.password;
      }
    } else {
      // Get the Tenant
      tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
      // Get user connection
      if (tenant) {
        const userCredentials = await SecuredStorage.getUserCredentials(tenant.subdomain);
        if (userCredentials) {
          email = userCredentials.email;
          password = userCredentials.password;
        }
      }
    }
    // Set logo
    await this.setTenantLogo(tenant);
    // Set
    this.setState(
      {
        email,
        password,
        tenantName: tenant?.endpoint?.name ? tenant.name : I18n.t('authentication.tenant'),
        tenantSubDomain: tenant?.endpoint?.name ? tenant.subdomain : null,
        loading: false
      }
    );
  }

  public async setTenantLogo (tenant: TenantConnection): Promise<void> {
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

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
    if (tenantSubDomain !== this.state.tenantSubDomain) {
      // Check if current Tenant selection is still valid (handle delete tenant use case)
      if (tenantSubDomain) {
        // Get the current Tenant
        const tenant = await this.centralServerProvider.getTenant(tenantSubDomain);
        if (!tenant?.endpoint?.name) {
          // Refresh
          this.tenants = await this.centralServerProvider.getTenants();
          this.setState({
            tenantSubDomain: null,
            tenantLogo: null,
            tenantName: I18n.t('authentication.tenant'),
            email: null,
            password: null
          });
        } else {
          // Set logo
          await this.setTenantLogo(tenant);
          this.setState({
            tenantSubDomain,
            tenantName: tenant.name
          });
        }
      }
    }
  }

  public login = async () => {
    // Check field
    if (this.isFormValid()) {
      const { password, email, eula, tenantSubDomain } = this.state;
      try {
        // Loading
        this.setState({ loggingIn: true } as State);
        // Login
        await this.centralServerProvider.login(email, password, eula, tenantSubDomain);
        // Login Success
        this.setState({ loggingIn: false });
        // Navigate
        this.authService?.handleSignIn();
      } catch (error) {
        console.log(error);
        // Login failed
        this.setState({ loggingIn: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Unknown Email
            case StatusCodes.NOT_FOUND:
              Message.showError(I18n.t('authentication.wrongEmailOrPassword'));
              break;
            // Account is locked
            case HTTPError.USER_ACCOUNT_LOCKED_ERROR:
              Message.showError(I18n.t('authentication.accountLocked'));
              break;
            // Account not Active
            case HTTPError.USER_ACCOUNT_INACTIVE_ERROR:
              Message.showError(I18n.t('authentication.accountNotActive'));
              break;
            // API User
            case HTTPError.TECHNICAL_USER_CANNOT_LOG_TO_UI_ERROR:
              Message.showError(I18n.t('authentication.technicalUserCannotLoginToUI'));
              break;
            // Account Pending
            case HTTPError.USER_ACCOUNT_PENDING_ERROR:
              Message.showError(I18n.t('authentication.accountPending'));
              break;
            // Eula no accepted
            case HTTPError.USER_EULA_ERROR:
              Message.showError(I18n.t('authentication.eulaNotAccepted'));
              break;
            default:
              // Other common Error
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.loginUnexpectedError', null, null, async () => this.login());
          }
        }
      }
    }
  };

  public onBack(): boolean {
    BackHandler.exitApp();
    return true;
  }

  public register(): void {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenantSubDomain) {
      navigation.navigate('SignUp', {
        params: {
          tenantSubDomain: this.state.tenantSubDomain,
          email: this.state.email
        }
      });
    } else {
      Message.showError(I18n.t('authentication.mustSelectTenant'));
    }
  }

  public forgotPassword(): void {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenantSubDomain) {
      navigation.navigate('RetrievePassword', {
        params: {
          tenantSubDomain: this.state.tenantSubDomain,
          email: this.state.email
        }
      });
    } else {
      // Error
      Message.showError(I18n.t('authentication.mustSelectTenant'));
    }
  }

  public render(): React.ReactElement {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const navigation = this.props.navigation;
    const {tenantLogo, eula, loggingIn, loading, hidePassword, showNoTenantFoundDialog, tenantName, password, email, tenantSubDomain } = this.state;
    // Render
    return loading ? (
      <Spinner style={formStyle.spinner} color="grey" />
    ) : (
      <AuthContext.Consumer>
        {authService => {
          this.authService = authService;
          return (
            <SafeAreaView style={style.container}>
              {showNoTenantFoundDialog && this.renderNoTenantFoundDialog()}
              <TouchableOpacity onPress={() => this.goToTenants()} style={style.tenantSelectionContainer}>
                <AuthHeader navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} />
                <Icon style={style.dropdownIcon} size={scale(25)} as={MaterialIcons} name={'arrow-drop-down'} />
              </TouchableOpacity>
              <KeyboardAwareScrollView keyboardShouldPersistTaps={'handled'} bounces={false} persistentScrollbar={true} style={style.scrollView} contentContainerStyle={style.scrollViewContentContainer}>
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
                  keyboardType={'email-address'}
                  textContentType={'emailAddress'}
                  returnKeyType="next"
                  onSubmitEditing={() => this.passwordInput.focus()}
                  renderErrorMessage={false}
                  onChangeText={(newEmail: string) => this.setState({email: newEmail})}
                />
                <Input
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  leftIcon={<Icon size={scale(20)} name="lock" as={MaterialCommunityIcons} style={formStyle.inputIcon} />}
                  rightIcon={<Icon
                    name={hidePassword ? 'eye' : 'eye-off'}
                    size={scale(20)}
                    as={Ionicons}
                    onPress={() => this.setState({ hidePassword: !hidePassword })}
                    style={formStyle.inputIcon}
                  />}
                  containerStyle={formStyle.inputContainer}
                  inputStyle={formStyle.inputText}
                  inputContainerStyle={formStyle.inputTextContainer}
                  value={password}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={hidePassword}
                  textContentType={'password'}
                  keyboardType={'default'}
                  returnKeyType={'done'}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  renderErrorMessage={false}
                  onChangeText={(newPassword: string) => this.setState({password: newPassword})}
                />
                <CheckBox
                  containerStyle={[formStyle.checkboxContainer, style.checkboxContainer]}
                  textStyle={{backgroundColor: 'transparent'}}
                  checked={eula}
                  onPress={() => this.setState({ eula: !eula })}
                  title={
                    <Text style={formStyle.checkboxText}>
                      {I18n.t('authentication.acceptEula')}
                      <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
                        {I18n.t('authentication.eula')}
                      </Text>
                    </Text>
                  }
                  uncheckedIcon={<Icon size={scale(25)} name="checkbox-blank-outline" as={MaterialCommunityIcons} style={formStyle.inputIcon} />}
                  checkedIcon={<Icon size={scale(25)} name="checkbox-outline" as={MaterialCommunityIcons} style={formStyle.inputIcon} />}
                />
                <Button
                  title={I18n.t('authentication.signIn')}
                  titleStyle={formStyle.buttonText}
                  disabled={!this.isFormValid()}
                  disabledStyle={formStyle.buttonDisabled}
                  disabledTitleStyle={formStyle.buttonTextDisabled}
                  containerStyle={formStyle.buttonContainer}
                  buttonStyle={formStyle.button}
                  loading={loggingIn}
                  loadingProps={{color: commonColor.light}}
                  onPress={() => void this.login()}
                />
                <TouchableOpacity style={style.forgotPasswordContainer} onPress={() => this.forgotPassword()}>
                  <Text style={style.forgotPasswordText}>
                    {I18n.t('authentication.forgotYourPassword')}
                  </Text>
                </TouchableOpacity>
                <View style={style.buttonSeparatorLine} />
                <Button
                  title={I18n.t('authentication.signUp')}
                  titleStyle={formStyle.buttonText}
                  disabled={!tenantSubDomain}
                  disabledStyle={formStyle.buttonDisabled}
                  disabledTitleStyle={formStyle.buttonTextDisabled}
                  containerStyle={formStyle.buttonContainer}
                  buttonStyle={{...formStyle.button, ...formStyle.secondaryButton}}
                  onPress={() => this.register()}
                />
                <View style={style.appVersionTextContainer}>
                  <Text style={style.appVersionText}>v{getVersion()}</Text>
                </View>
              </KeyboardAwareScrollView>
            </SafeAreaView>
          );
        }}
      </AuthContext.Consumer>
    );
  }

  private goToTenants(openQRCode = false) {
    this.props.navigation.navigate('Tenants', {
      key: `${Utils.randomNumber()}`,
      openQRCode
    });
  }

  private isFormValid(): boolean {
    const {tenantSubDomain, email, password, eula} = this.state;
    return !!tenantSubDomain && !!email && !!password && eula;
  }

  private renderNoTenantFoundDialog() {
    const modalCommonStyle = computeModalCommonStyle();
    return (
      <DialogModal
        title={I18n.t('authentication.noTenantFoundTitle')}
        description={I18n.t('authentication.noTenantFoundMessage')}
        withCancel={true}
        close={() => this.setState({ showNoTenantFoundDialog: false })}
        withCloseButton={true}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () => this.setState({ showNoTenantFoundDialog: false }, () => this.goToTenants(true)),
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            buttonStyle: modalCommonStyle.primaryButton
          }
        ]}
      />
    );
  }
}
