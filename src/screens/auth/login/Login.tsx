import I18n from 'i18n-js';
import { ActionSheet, Button, CheckBox, Footer, Form, Icon, Item, Left, Right, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, ScrollView, Text as TextRN, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import ModalStyles from '../../../ModalStyles';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
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
  eula?: boolean;
  password?: string;
  email?: string;
  tenantSubDomain?: string;
  tenantName?: string;
  newTenantSubDomain?: string;
  newTenantName?: string;
  loading?: boolean;
  initialLoading?: boolean;
  errorEula?: object[];
  errorPassword?: object[];
  errorTenantSubDomain?: object[];
  errorEmail?: object[];
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

  constructor(props: Props) {
    super(props);
    this.state = {
      eula: false,
      password: null,
      email: Utils.getParamFromNavigation(this.props.navigation, 'email', ''),
      tenantSubDomain: Utils.getParamFromNavigation(this.props.navigation, 'tenantSubDomain', ''),
      tenantName: I18n.t('authentication.tenant'),
      loading: false,
      visible: false,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Get Tenants
    this.tenants = await this.centralServerProvider.getTenants();
    // Lock
    // Orientation.lockToPortrait();
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
          const result = await this.centralServerProvider.checkEndUserLicenseAgreement({email, tenantSubDomain});
          if (result.eulaAccepted) {
            // Try to login
            this.setState({eula: true}, () => this.login());
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
    // Check field
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
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
            case 500:
            case 550:
              Message.showError(I18n.t('authentication.wrongEmailOrPassword'));
              break;
            // Account is locked
            case 570:
              Message.showError(I18n.t('authentication.accountLocked'));
              break;
            // Account not Active
            case 580:
              Message.showError(I18n.t('authentication.accountNotActive'));
              break;
            // Account Pending
            case 590:
              Message.showError(I18n.t('authentication.accountPending'));
              break;
            // Eula no accepted
            case 520:
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

  private addTenant = async (subdomain: string, name: string) => {
    const foundTenant = this.tenants.filter(tenant => tenant.subdomain === subdomain)
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
  };

  private deleteTenant = (subdomain: string) => {
    Alert.alert(
      I18n.t('general.deleteTenant'),
      I18n.t('general.deleteTenantConfirm', { name: this.state.tenantName, subDomain: this.state.tenantSubDomain }), [
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
  };

  public setTenant = async (buttonIndex: number) => {
    // Provided?
    if (buttonIndex !== undefined) {
      // Get stored data
      const credentials = await SecuredStorage.getUserCredentials(this.tenants[buttonIndex].subdomain);
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
    const modalStyles = ModalStyles();
    const navigation = this.props.navigation;
    const { eula, loading, initialLoading, visible } = this.state;
    // Render
    return initialLoading ? (
      <Spinner style={style.spinner} />
    ) : (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <ScrollView contentContainerStyle={style.scrollContainer}>
          <KeyboardAvoidingView style={style.keyboardContainer} behavior='padding'>
            <AuthHeader navigation={this.props.navigation}/>
            <Form style={style.form}>
              <View style ={style.iconContainer}>
                <Button onPress={() => { this.setState({ visible: true , subdomain: null, name: null })}}>
                  <Icon type={'MaterialIcons'} name='add' />
                </Button>
                <Button disabled={this.state.tenantName === I18n.t('authentication.tenant') }
                    onPress={() => {
                      this.deleteTenant(this.state.tenantSubDomain);
                    }}>
                  <Icon type={'MaterialIcons'} name='remove' />
                </Button>
              </View>
              <Button
                rounded={true} block={true} style={style.button}
                onPress={() =>
                  ActionSheet.show(
                    {
                      options: this.tenants.map((tenant) => tenant.name),
                      title: I18n.t('authentication.tenant')
                    },
                    (buttonIndex) => {
                      this.setTenant(buttonIndex);
                    }
                  )
                }>
                <TextRN style={style.buttonText}>{this.state.tenantName}</TextRN>
              </Button>
              <Modal style ={modalStyles.modalContainer} isVisible={visible}
                  onBackdropPress={() => this.setState({ visible: false })}>
                <View style ={modalStyles.modalHeaderContainer}>
                  <TextRN style={modalStyles.modalTextHeader}> {I18n.t('authentication.addtenantName')}</TextRN>
                </View>
                <View style={modalStyles.modalFiltersContainer}>
                  {this.props.children}
                  <TextInput
                    placeholder={I18n.t('authentication.tenantSubdomain')}
                    placeholderTextColor={commonColor.defaultTextColor}
                    style={modalStyles.inputFieldModal}
                    onChangeText={(value) => this.setState({ subdomain: value })}
                  />
                  <TextInput
                    placeholder={I18n.t('authentication.tenantName')}
                    placeholderTextColor={commonColor.defaultTextColor}
                    style={modalStyles.inputFieldModal}
                    onChangeText={(value) => this.setState({ name: value })}
                  />
                </View>
                <View style={modalStyles.modalButtonsContainer}>
                  <Button disabled={!this.state.newTenantSubDomain || !this.state.newTenantName}
                      style={modalStyles.modalButton} full={true}
                      onPress={() => {
                        this.addTenant(this.state.newTenantSubDomain, this.state.newTenantName);
                      }} >
                    <Text style={modalStyles.modalTextButton}>{I18n.t('general.create')}</Text>
                  </Button>
                  <Button style={modalStyles.modalButton} full={true} danger={true} onPress={() => {this.setState({visible:false})}} >
                    <Text style={modalStyles.modalTextButton}>{I18n.t('general.cancel')}</Text>
                  </Button>
                </View>
              </Modal>
              {this.state.errorTenantSubDomain &&
                this.state.errorTenantSubDomain.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='mail' style={style.inputIcon} />
                <TextInput
                  returnKeyType='next'
                  selectionColor={commonColor.inverseTextColor}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  onSubmitEditing={() => this.passwordInput.focus()}
                  style={style.inputField}
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
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                <Icon active={true} name='unlock' style={[style.inputIcon, style.inputIconLock]} />
                <TextInput
                  returnKeyType='go'
                  selectionColor={commonColor.inverseTextColor}
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={style.inputField}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  keyboardType={'default'}
                  secureTextEntry={true}
                  onChangeText={(text) => this.setState({ password: text })}
                  value={this.state.password}
                />
              </Item>
              {this.state.errorPassword &&
                this.state.errorPassword.map((errorMessage, index) => (
                  <Text style={style.formErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              <View style={style.eulaContainer}>
                <CheckBox style={style.eulaCheckbox} checked={eula} onPress={() => this.setState({ eula: !eula })} />
                <Text style={style.eulaText}>
                  {I18n.t('authentication.acceptEula')}
                  <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
                    {I18n.t('authentication.eula')}
                  </Text>
                </Text>
              </View>
              {this.state.errorEula &&
                this.state.errorEula.map((errorMessage, index) => (
                  <Text style={[style.formErrorText, style.formErrorTextEula]} key={index}>
                    {errorMessage}
                  </Text>
                ))}
              {loading ? (
                <Spinner style={style.spinner} color='white' />
              ) : (
                <Button rounded={true} primary={true} block={true} style={style.button} onPress={() => this.login()}>
                  <TextRN style={style.buttonText}>{I18n.t('authentication.login')}</TextRN>
                </Button>
              )}
            </Form>
          </KeyboardAvoidingView>
        </ScrollView>
        <Footer style={style.footer}>
          <Left>
            <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.newUser()}>
              <TextRN style={style.linksTextButton}>{I18n.t('authentication.newUser')}</TextRN>
            </Button>
          </Left>
          <Right>
            <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonRight]} onPress={() => this.forgotPassword()}>
              <TextRN style={[style.linksTextButton, style.linksTextButtonRight]}>{I18n.t('authentication.forgotYourPassword')}</TextRN>
            </Button>
          </Right>
        </Footer>
      </Animatable.View>
    );
  }
}
