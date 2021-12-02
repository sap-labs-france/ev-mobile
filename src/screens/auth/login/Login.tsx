import I18n from 'i18n-js';
import { Button, CheckBox, Form, Icon, Item, Spinner, Text, View } from 'native-base';
import React from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import DialogModal from '../../../components/modal/DialogModal';
import ExitAppDialog from '../../../components/modal/exit-app/ExitAppDialog';
import computeModalCommonStyle from '../../../components/modal/ModalCommonStyle';
import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import { TenantConnection } from '../../../types/Tenant';
import Message from '../../../utils/Message';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';

export interface Props extends BaseProps {}

interface State {
  activeFab?: boolean;
  eula?: boolean;
  password?: string;
  email?: string;
  tenantName?: string;
  tenantSubDomain?: string;
  tenantLogo?: string;
  loading?: boolean;
  initialLoading?: boolean;
  hidePassword?: boolean;
  errorEula?: Record<string, unknown>[];
  errorPassword?: Record<string, unknown>[];
  errorTenantSubDomain?: Record<string, unknown>[];
  errorEmail?: Record<string, unknown>[];
  errorNewTenantName?: Record<string, unknown>[];
  errorNewTenantSubDomain?: Record<string, unknown>[];
  showExitAppDialog: boolean;
  showNoTenantFoundDialog: boolean;
}

export default class Login extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private tenants: TenantConnection[] = [];
  private passwordInput: TextInput;
  private formValidationDef = {
    tenantSubDomain: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryTenant')
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
      }
    },
    eula: {
      equality: {
        attribute: 'ghost',
        message: '^' + I18n.t('authentication.eulaNotAccepted'),
        comparator(v1: boolean, v2: boolean) {
          // True if EULA is checked
          return v1;
        }
      }
    }
  };

  public constructor(props: Props) {
    super(props);
    this.state = {
      activeFab: false,
      eula: false,
      password: null,
      email: Utils.getParamFromNavigation(this.props.route, 'email', '') as string,
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      tenantName: I18n.t('authentication.tenant'),
      loading: false,
      initialLoading: true,
      hidePassword: true,
      showExitAppDialog: false,
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
      // Not provided: display latest saved credentials
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
    // Get logo
    const tenantLogo = await this.getTenantLogo(tenant);
    // Set
    this.setState(
      {
        email,
        password,
        tenantLogo,
        tenantName: tenant ? tenant.name : I18n.t('authentication.tenant'),
        tenantSubDomain: tenant ? tenant.subdomain : null,
        initialLoading: false
      },
      async () => this.checkAutoLogin(tenant, email, password)
    );
  }

  public getTenantLogo = async (tenant: TenantConnection): Promise<string> => {
    try {
      if (tenant) {
        return await this.centralServerProvider.getTenantLogoBySubdomain(tenant);
      }
    } catch (error) {
      // Tenant has no logo
    }
    return null;
  };

  public async componentDidFocus() {
    super.componentDidFocus();
    const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain);
    // Check if current Tenant selection is still valid (handle delete tenant use case)
    if (tenantSubDomain) {
      // Get the current Tenant
      const tenant = await this.centralServerProvider.getTenant(tenantSubDomain.toString());
      if (!tenant) {
        // Refresh
        this.tenants = await this.centralServerProvider.getTenants();
        this.setState({
          tenantSubDomain: null,
          tenantName: I18n.t('authentication.tenant'),
          email: null,
          password: null
        });
      } else {
        // Get logo
        const tenantLogo = await this.getTenantLogo(tenant);
        this.setState({
          tenantLogo,
          tenantSubDomain,
          tenantName: tenant.name
        });
      }
    }
  }

  public async checkAutoLogin(tenant: TenantConnection, email: string, password: string) {
    // Check if user can be logged
    if (
      !__DEV__ &&
      !this.centralServerProvider.hasAutoLoginDisabled() &&
      !Utils.isNullOrEmptyString(tenant?.subdomain) &&
      !Utils.isNullOrEmptyString(email) &&
      !Utils.isNullOrEmptyString(password)
    ) {
      try {
        // Check EULA
        const result = await this.centralServerProvider.checkEndUserLicenseAgreement({ email, tenantSubDomain: tenant.subdomain });
        // Try to login
        if (result.eulaAccepted) {
          this.setState({ eula: true }, async () => this.login());
        }
      } catch (error) {
        // Do nothing: user must log on
      }
    }
  }

  public login = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    if (formIsValid) {
      const { password, email, eula, tenantSubDomain } = this.state;
      try {
        // Loading
        this.setState({ loading: true } as State);
        // Login
        await this.centralServerProvider.login(email, password, eula, tenantSubDomain);
        // Login Success
        this.setState({ loading: false });
        // Navigate
        this.navigateToApp();
      } catch (error) {
        // Login failed
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Unknown Email
            case HTTPError.OBJECT_DOES_NOT_EXIST_ERROR:
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
            // Technical User
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
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.loginUnexpectedError');
          }
        }
      }
    }
  };

  public onBack(): boolean {
    BackHandler.exitApp();
    return true;
  }

  public navigateToApp() {
    // Navigate to App
    this.props.navigation.navigate('AppDrawerNavigator', { screen: 'ChargingStationsNavigator', key: `${Utils.randomNumber()}` });
  }

  public setTenantWithIndex = async (buttonIndex: number) => {
    // Provided?
    if (buttonIndex !== undefined && this.tenants[buttonIndex]) {
      const tenant = this.tenants[buttonIndex];
      const tenantLogo = await this.centralServerProvider.getTenantLogoBySubdomain(tenant);
      // Get stored data
      const credentials = await SecuredStorage.getUserCredentials(this.tenants[buttonIndex].subdomain);
      if (credentials) {
        // Set Tenant
        this.setState({
          email: credentials.email,
          password: credentials.password,
          tenantSubDomain: tenant.subdomain,
          tenantName: tenant.name,
          tenantLogo
        });
      } else {
        // Set Tenant
        this.setState({
          email: null,
          password: null,
          tenantSubDomain: tenant.subdomain,
          tenantName: tenant.name,
          tenantLogo
        });
      }
    }
  };

  public newUser = () => {
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
  };

  public forgotPassword = () => {
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
  };

  public async selectTenant(searchTenant: TenantConnection) {
    if (searchTenant) {
      // Search index
      const index = this.tenants.findIndex((tenant) => tenant.subdomain === searchTenant.subdomain);
      if (index !== -1) {
        await this.setTenantWithIndex(index);
      }
    }
  }

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const navigation = this.props.navigation;
    const { tenantLogo, eula, loading, initialLoading, hidePassword, showExitAppDialog, showNoTenantFoundDialog } = this.state;
    // Render
    return initialLoading ? (
      <Spinner style={formStyle.spinner} color="grey" />
    ) : (
      <View style={style.container}>
        {showNoTenantFoundDialog && this.renderNoTenantFoundDialog()}
        {showExitAppDialog && this.renderExitAppDialog()}
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
            <AuthHeader navigation={this.props.navigation} tenantLogo={tenantLogo} />
            <TouchableOpacity style={[style.linksButton]} onPress={() => this.newUser()}>
              <Text style={style.linksTextButton} uppercase={false}>
                {I18n.t('authentication.newUser')}
              </Text>
            </TouchableOpacity>
            <Form style={formStyle.form}>
              <Button block style={formStyle.button} onPress={() => this.goToTenants()}>
                <Text style={formStyle.buttonText} uppercase={false}>
                  {this.state.tenantName}
                </Text>
              </Button>
              {this.state.errorTenantSubDomain &&
                this.state.errorTenantSubDomain.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel style={formStyle.inputGroup}>
                <Icon active name="email" type="MaterialCommunityIcons" style={formStyle.inputIcon} />
                <TextInput
                  returnKeyType="next"
                  selectionColor={commonColor.textColor}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  style={formStyle.inputField}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  secureTextEntry={false}
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
              <Item inlineLabel style={formStyle.inputGroup}>
                <Icon active name="lock" type="MaterialCommunityIcons" style={formStyle.inputIcon} />
                <TextInput
                  returnKeyType="go"
                  selectionColor={commonColor.textColor}
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={formStyle.inputField}
                  autoCapitalize="none"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />
                <Icon
                  active
                  name={hidePassword ? 'eye' : 'eye-off'}
                  type="Ionicons"
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
              <TouchableOpacity style={[style.linksButton]} onPress={() => this.forgotPassword()}>
                <Text style={[style.linksTextButton, style.linksTextButton]} uppercase={false}>
                  {I18n.t('authentication.forgotYourPassword')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.setState({ eula: !eula })} style={formStyle.formCheckboxContainer}>
                <CheckBox disabled={true} style={formStyle.checkbox} checked={eula} />
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
                <Button primary block style={formStyle.button} onPress={async () => this.login()}>
                  <Text style={formStyle.buttonText} uppercase={false}>
                    {I18n.t('authentication.login')}
                  </Text>
                </Button>
              )}
            </Form>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }

  private goToTenants(openQRCode = false) {
    this.props.navigation.navigate('Tenants', {
      key: `${Utils.randomNumber()}`,
      openQRCode
    });
  }

  private renderExitAppDialog() {
    return <ExitAppDialog close={() => this.setState({ showExitAppDialog: false })} />;
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
            buttonTextStyle: modalCommonStyle.primaryButton,
            buttonStyle: modalCommonStyle.primaryButton
          }
        ]}
      />
    );
  }
}
