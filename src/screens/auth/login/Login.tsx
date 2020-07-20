import I18n from 'i18n-js';
import { ActionSheet, Button, CheckBox, Fab, Form, Icon, Item, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, ScrollView, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import computeFormStyleSheet from '../../../FormStyles';
import computeModalStyleSheet from '../../../ModalStyles';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import Tenant from '../../../types/Tenant';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';


export interface Props extends BaseProps {
}

interface State {
  activeFab?: boolean;
  eula?: boolean;
  password?: string;
  email?: string;
  tenantSubDomain?: string;
  tenantName?: string;
  newTenantSubDomain?: string;
  newTenantName?: string;
  loading?: boolean;
  initialLoading?: boolean;
  hidePassword?: boolean;
  errorEula?: object[];
  errorPassword?: object[];
  errorTenantSubDomain?: object[];
  errorEmail?: object[];
  errorNewTenantName?: object[];
  errorNewTenantSubDomain?: object[];
  visible?: boolean;
}

export default class Login extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private tenants: Partial<Tenant>[];
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
  private formCreateTenantValidationDef = {
    newTenantSubDomain: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryTenantSubDomain')
      }
    },
    newTenantName: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryTenantName')
      },
    },
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      activeFab: false,
      eula: false,
      password: null,
      email: Utils.getParamFromNavigation(this.props.navigation, 'email', ''),
      tenantSubDomain: Utils.getParamFromNavigation(this.props.navigation, 'tenantSubDomain', ''),
      tenantName: I18n.t('authentication.tenant'),
      loading: false,
      visible: false,
      hidePassword: true,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Get Tenants
    this.tenants = await this.centralServerProvider.getTenants();
    // Load User data
    if (!this.state.email || !this.state.tenantSubDomain) {
      const tenantSubDomain = this.centralServerProvider.getUserTenant();
      const tenant = await this.centralServerProvider.getTenant(tenantSubDomain);
      const email = this.centralServerProvider.getUserEmail();
      const password = this.centralServerProvider.getUserPassword();
      // Set
      this.setState({
        email,
        password,
        tenantSubDomain,
        tenantName: tenant ? tenant.name : this.state.tenantName,
        initialLoading: false
      });
      // Check if user can be logged
      if (Utils.canAutoLogin(this.centralServerProvider, this.props.navigation)) {
        try {
          // Check EULA
          const result = await this.centralServerProvider.checkEndUserLicenseAgreement({ email, tenantSubDomain });
          if (result.eulaAccepted) {
            // Try to login
            this.setState({ eula: true }, () => this.login());
          }
        } catch (error) {
          // Do nothing: user must log on
        }
      }
    } else {
      // Set Tenant title
      let tenantName = I18n.t('authentication.tenant');
      if (this.state.tenantSubDomain) {
        const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
        tenantName = tenant.name;
      }
      // Set
      this.setState({
        initialLoading: false,
        tenantName
      });
    }
  }

  public login = async () => {
    this.setState({ visible: false })
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
        this.navigateToSites();
      } catch (error) {
        // Login failed
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Unknown Email
            case HTTPError.GENERAL_ERROR:
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
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
                'authentication.loginUnexpectedError');
          }
        }
      }
    }
  };

  public onBack = () => {
    // Exit?
    Alert.alert(
      I18n.t('general.exitApp'),
      I18n.t('general.exitAppConfirm'),
      [{ text: I18n.t('general.no'), style: 'cancel' }, { text: I18n.t('general.yes'), onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
    // Do not bubble up
    return true;
  };

  public navigateToSites() {
    // Navigate to App
    this.props.navigation.navigate('AppDrawerNavigator');
  }

  private createTenant = async (subdomain: string, name: string) => {
    // Check field
    const formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
    if (formIsValid) {
      const foundTenant = this.tenants.find(tenant => tenant.subdomain === subdomain)
      // Already exists
      if (foundTenant) {
        Alert.alert(
          I18n.t('general.error'),
          I18n.t('general.tenantExists'),
          [{ text: I18n.t('general.ok'), style: 'cancel' }],
          { cancelable: false }
        );
      // Add new Tenant and Save
      } else {
        this.tenants.push({
          subdomain,
          name
        });
        // Save
        await SecuredStorage.saveTenants(this.tenants);
        // Hide Modal
        this.setState({
          visible: false
        })
      }
    }
  };

  private deleteTenant = (subdomain: string) => {
    // Not selected
    if (!this.state.tenantSubDomain) {
      Message.showError(I18n.t('authentication.mustSelectTenant'));
    // Delete
    } else {
      Alert.alert(
        I18n.t('general.deleteTenant'),
        I18n.t('general.deleteTenantConfirm', { tenantName: this.state.tenantName }), [
          { text: I18n.t('general.no'), style: 'cancel' },
          { text: I18n.t('general.yes'), onPress: async () => {
            // Remove from list and Save
            for (let i = 0; i < this.tenants.length; i++) {
              const tenant = this.tenants[i];
              if (tenant.subdomain === subdomain) {
                // Remove
                this.tenants.splice(i, 1);
                // Save
                await SecuredStorage.saveTenants(this.tenants)
                // Init
                this.setState({
                  tenantSubDomain: null,
                  tenantName: I18n.t('authentication.tenant')
                });
                break;
              }
            }
          }
        }],
      );
    }
  };

  private restoreTenants = () => {
    Alert.alert(
      I18n.t('general.restoreTenants'),
      I18n.t('general.restoreTenantsConfirm'), [
        { text: I18n.t('general.no'), style: 'cancel' },
        { text: I18n.t('general.yes'), onPress: async () => {
          // Remove from list and Save
          this.tenants = this.centralServerProvider.getInitialTenants();
          // Save
          await SecuredStorage.saveTenants(this.tenants)
          // Init
          this.setState({
            tenantSubDomain: null,
            tenantName: I18n.t('authentication.tenant')
          });
        }
      }],
    );
  };

  public setTenant = async (buttonIndex: number) => {
    // Provided?
    if (buttonIndex !== undefined) {
      // Get stored data
      const credentials = await SecuredStorage.getUserCredentials(
        this.tenants[buttonIndex].subdomain);
      if (credentials) {
        // Set Tenant
        this.setState({
          email: credentials.email,
          password: credentials.password,
          tenantSubDomain: this.tenants[buttonIndex].subdomain,
          tenantName: this.tenants[buttonIndex].name
        });
      } else {
        // Set Tenant
        this.setState({
          tenantSubDomain: this.tenants[buttonIndex].subdomain,
          tenantName: this.tenants[buttonIndex].name
        });
      }
      // Recompute form
      Utils.validateInput(this, this.formValidationDef);
    }
  };

  public newUser = () => {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenantSubDomain) {
      navigation.navigate('SignUp', {
        tenantSubDomain: this.state.tenantSubDomain,
        email: this.state.email
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
        tenantSubDomain: this.state.tenantSubDomain,
        email: this.state.email
      });
    } else {
      // Error
      Message.showError(I18n.t('authentication.mustSelectTenant'));
    }
  };

  public render() {
    const style = computeStyleSheet();
    const modalStyle = computeModalStyleSheet();
    const formStyle = computeFormStyleSheet();
    const navigation = this.props.navigation;
    const { eula, loading, initialLoading, visible, hidePassword } = this.state;
    // Render
    return initialLoading ? (
      <Spinner style={formStyle.spinner} />
    ) : (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior='padding'>
            <AuthHeader navigation={this.props.navigation}/>
            <Button small={true} transparent={true} style={[style.linksButton]} onPress={() => this.newUser()}>
              <Text style={style.linksTextButton} uppercase={false}>{I18n.t('authentication.newUser')}</Text>
            </Button>
            <Form style={formStyle.form}>
              <Button block={true} style={formStyle.button}
                onPress={() =>
                  ActionSheet.show(
                    {
                      options: [
                        ...this.tenants,
                        { name: I18n.t('general.cancel'), subdomain: '' }
                      ].map((tenant: Partial<Tenant>) => tenant.name),
                      title: I18n.t('authentication.tenant'),
                      cancelButtonIndex: this.tenants.length,
                    },
                    (buttonIndex) => {
                      this.setTenant(buttonIndex);
                    }
                  )
                }>
                <Text style={formStyle.buttonText} uppercase={false}>{this.state.tenantName}</Text>
              </Button>
              <Modal style ={modalStyle.modal} isVisible={visible}
                  onBackdropPress={() => this.setState({ visible: false })}>
                <View style ={modalStyle.modalContainer}>
                  <View style ={modalStyle.modalHeaderContainer}>
                    <Text style={modalStyle.modalTextHeader}>{I18n.t('authentication.createTenantTitle')}</Text>
                  </View>
                  <View style={modalStyle.modalContentContainer}>
                    <View style={modalStyle.modalRow}>
                      <Text style={modalStyle.modalLabel}>{I18n.t('authentication.tenantSubdomain')}:</Text>
                      <TextInput
                        autoFocus={true}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        placeholder={I18n.t('authentication.tenantSubdomain')}
                        placeholderTextColor={commonColor.inputColorPlaceholder}
                        style={modalStyle.modalInputField}
                        onChangeText={(value) => this.setState({ newTenantSubDomain: value.toLowerCase() })}
                      />
                    </View>
                    <View style={modalStyle.modalRowError}>
                      {this.state.errorNewTenantSubDomain &&
                        this.state.errorNewTenantSubDomain.map((errorMessage, index) => (
                          <Text style={modalStyle.modalErrorText} key={index}>
                            {errorMessage}
                          </Text>
                        ))}
                    </View>
                    <View style={modalStyle.modalRow}>
                      <Text style={modalStyle.modalLabel}>{I18n.t('authentication.tenantName')}:</Text>
                      <TextInput
                        placeholder={I18n.t('authentication.tenantName')}
                        placeholderTextColor={commonColor.inputColorPlaceholder}
                        style={modalStyle.modalInputField}
                        onChangeText={(value) => this.setState({ newTenantName: value })}
                      />
                    </View>
                    <View style={modalStyle.modalRowError}>
                      {this.state.errorNewTenantName &&
                        this.state.errorNewTenantName.map((errorMessage, index) => (
                          <Text style={modalStyle.modalErrorText} key={index}>
                            {errorMessage}
                          </Text>
                        ))}
                    </View>
                  </View>
                  <View style={modalStyle.modalButtonsContainer}>
                    <Button style={[modalStyle.modalButton]} full={true} danger={true}
                        onPress={() => {
                          this.createTenant(this.state.newTenantSubDomain, this.state.newTenantName);
                        }} >
                      <Text style={modalStyle.modalTextButton} uppercase={false}>{I18n.t('general.create')}</Text>
                    </Button>
                    <Button style={[modalStyle.modalButton]} full={true} light={true}
                        onPress={() => {
                          this.setState({ visible: false })
                        }} >
                      <Text style={modalStyle.modalTextButton} uppercase={false}>{I18n.t('general.cancel')}</Text>
                    </Button>
                  </View>
                </View>
              </Modal>
              {this.state.errorTenantSubDomain &&
                this.state.errorTenantSubDomain.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='email' type='MaterialCommunityIcons' style={formStyle.inputIcon} />
                <TextInput
                  returnKeyType='next'
                  selectionColor={commonColor.inverseTextColor}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  style={formStyle.inputField}
                  autoCapitalize='none'
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
              <Item inlineLabel={true} style={formStyle.inputGroup}>
                <Icon active={true} name='lock' type='MaterialCommunityIcons' style={formStyle.inputIcon} />
                <TextInput
                  returnKeyType='go'
                  selectionColor={commonColor.inverseTextColor}
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  style={formStyle.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  secureTextEntry={hidePassword}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />
                <Icon active={true} name={hidePassword ? 'eye' : 'eye-off'} type='Ionicons'
                  onPress={() => this.setState({ hidePassword: !hidePassword })}
                  style={formStyle.inputIcon} />
              </Item>
              {this.state.errorPassword &&
                this.state.errorPassword.map((errorMessage, index) => (
                  <Text style={formStyle.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Button small={true} transparent={true} style={[style.linksButton]} onPress={() => this.forgotPassword()}>
                <Text style={[style.linksTextButton, style.linksTextButton]} uppercase={false}>{I18n.t('authentication.forgotYourPassword')}</Text>
              </Button>
              <View style={formStyle.formCheckboxContainer}>
                <CheckBox style={formStyle.checkbox} checked={eula} onPress={() => this.setState({ eula: !eula })} />
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
              {loading ? (
                <Spinner style={formStyle.spinner} color='white' />
              ) : (
                <Button primary={true} block={true} style={formStyle.button} onPress={() => this.login()}>
                  <Text style={formStyle.buttonText} uppercase={false}>{I18n.t('authentication.login')}</Text>
                </Button>
              )}
            </Form>
          </KeyboardAvoidingView>
        </ScrollView>
        <Fab
          active={this.state.activeFab}
          direction='up'
          style={style.fab}
          position='bottomRight'
          onPress={() => this.setState({ activeFab: !this.state.activeFab })}>
          <Icon name='business' />
          <Button style={style.restoreOrgButton}
            onPress={() => {
              this.restoreTenants();
            }}>
            <Icon type={'MaterialIcons'} name='settings-backup-restore' />
          </Button>
          <Button style={style.deleteOrgButton}
            onPress={() => {
              this.deleteTenant(this.state.tenantSubDomain);
            }}>
            <Icon type={'MaterialIcons'} name='remove' />
          </Button>
          <Button style={style.createOrgButton}
            onPress={() => {
              this.setState({ visible: true, newTenantSubDomain: null, newTenantName: null })
            }}>
            <Icon type={'MaterialIcons'} name='add' />
          </Button>
        </Fab>
      </Animatable.View>
    );
  }
}
