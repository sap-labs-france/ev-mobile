import I18n from 'i18n-js';
import { Button, CheckBox, Fab, Form, Icon, Item, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, BackHandler, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import * as Animatable from 'react-native-animatable';
import { scale } from 'react-native-size-matters';

import computeFormStyleSheet from '../../../FormStyles';
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
import CreateTenantDialog from './CreateTenantDialog';

export interface Props extends BaseProps {
}

interface State {
  activeFab?: boolean;
  eula?: boolean;
  password?: string;
  email?: string;
  tenantSubDomain?: string;
  tenantName?: string;
  loading?: boolean;
  initialLoading?: boolean;
  hidePassword?: boolean;
  errorEula?: object[];
  errorPassword?: object[];
  errorTenantSubDomain?: object[];
  errorEmail?: object[];
  errorNewTenantName?: object[];
  errorNewTenantSubDomain?: object[];
  visibleCreateTenant?: boolean;
}

export default class Login extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private tenants: Partial<Tenant>[] = [];
  private passwordInput: TextInput;
  private actionSheet: ActionSheet;
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
      activeFab: false,
      eula: false,
      password: null,
      email: Utils.getParamFromNavigation(this.props.route, 'email', ''),
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', ''),
      tenantName: I18n.t('authentication.tenant'),
      loading: false,
      visibleCreateTenant: false,
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
      const tenant = this.centralServerProvider.getUserTenant();
      const email = this.centralServerProvider.getUserEmail();
      const password = this.centralServerProvider.getUserPassword();
      // Set
      this.setState({
        email,
        password,
        tenantSubDomain: tenant ? tenant.subdomain : null,
        tenantName: tenant ? tenant.name : this.state.tenantName,
        initialLoading: false
      });
      // Check if user can be logged
      if (Utils.canAutoLogin(this.centralServerProvider)) {
        try {
          // Check EULA
          const result = await this.centralServerProvider.checkEndUserLicenseAgreement(
            { email, tenantSubDomain: tenant.subdomain });
          // Try to login
          if (result.eulaAccepted) {
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
    this.setState({ visibleCreateTenant: false })
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
                await SecuredStorage.saveTenants(this.tenants);
                // Remove cache
                await SecuredStorage.deleteUserCredentials(subdomain);
                // Init
                this.setState({
                  tenantSubDomain: null,
                  tenantName: I18n.t('authentication.tenant'),
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

  public setTenantWithIndex = async (buttonIndex: number) => {
    // Provided?
    if (buttonIndex !== undefined && this.tenants[buttonIndex]) {
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
    }
  };

  public newUser = () => {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenantSubDomain) {
      navigation.navigate(
        'SignUp', {
          tenantSubDomain: this.state.tenantSubDomain,
          email: this.state.email
        }
      );
    } else {
      Message.showError(I18n.t('authentication.mustSelectTenant'));
    }
  };

  public forgotPassword = () => {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenantSubDomain) {
      navigation.navigate(
        'RetrievePassword', {
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
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const navigation = this.props.navigation;
    const { eula, loading, initialLoading, visibleCreateTenant, hidePassword } = this.state;
    // Render
    return initialLoading ? (
      <Spinner style={formStyle.spinner} color='grey' />
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
                onPress={() => {
                  this.actionSheet.show();
                }}>
                <Text style={formStyle.buttonText} uppercase={false}>{this.state.tenantName}</Text>
              </Button>
              <ActionSheet
                ref={(actionSheet: ActionSheet) => this.actionSheet = actionSheet}
                title={I18n.t('authentication.tenant')}
                styles={{
                  overlay: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    opacity: 0.4,
                    backgroundColor: commonColor.disabled
                  },
                  wrapper: {
                    flex: 1,
                    flexDirection: 'row'
                  },
                  body: {
                    flex: 1,
                    alignSelf: 'flex-end',
                    backgroundColor: commonColor.containerBgColor
                  },
                  titleBox: {
                    height: scale(40),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: commonColor.containerBgColor
                  },
                  titleText: {
                    color: commonColor.placeholderTextColor,
                    fontSize: scale(16)
                  },
                  messageBox: {
                    height: scale(30),
                    paddingLeft: scale(10),
                    paddingRight: scale(10),
                    paddingBottom: scale(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: commonColor.containerBgColor
                  },
                  messageText: {
                    color: commonColor.disabled,
                    fontSize: scale(12)
                  },
                  buttonBox: {
                    height: scale(45),
                    marginTop: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: commonColor.textColor,
                    backgroundColor: commonColor.containerBgColor
                  },
                  buttonText: {
                    fontSize: scale(20)
                  },
                  cancelButtonBox: {
                    height: scale(40),
                    marginTop: scale(6),
                    marginBottom: Platform.OS === 'ios' ? scale(15) : scale(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: commonColor.containerBgColor
                  }
                }}
                options={[
                    ...this.tenants,
                    { name: I18n.t('general.cancel'), subdomain: '' }
                  ].map((tenant: Partial<Tenant>) =>
                    <Text style={{color: commonColor.textColor, fontSize: scale(16)}}>{tenant.name}</Text>)}
                cancelButtonIndex={this.tenants.length}
                onPress={(index: number) => {
                  this.setTenantWithIndex(index);
                }}
              />
              {visibleCreateTenant &&
                <CreateTenantDialog navigation={navigation} tenants={this.tenants}
                close={(newTenant: Tenant) => {
                  this.setState({ visibleCreateTenant: false });
                  if (newTenant) {
                    const index = this.tenants.findIndex((tenant) => tenant.subdomain === newTenant.subdomain);
                    if (index !== -1) {
                      this.setTenantWithIndex(index);
                    }
                  }
                }} />
              }
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
                  selectionColor={commonColor.textColor}
                  placeholder={I18n.t('authentication.email')}
                  placeholderTextColor={commonColor.placeholderTextColor}
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
                  selectionColor={commonColor.textColor}
                  ref={(ref: TextInput) => (this.passwordInput = ref)}
                  onSubmitEditing={() => Keyboard.dismiss()}
                  placeholder={I18n.t('authentication.password')}
                  placeholderTextColor={commonColor.placeholderTextColor}
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
                <Spinner style={formStyle.spinner} color='grey' />
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
          <Icon name='business' style={style.fabIcon} />
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
              this.setState({ visibleCreateTenant: true })
            }}>
            <Icon type={'MaterialIcons'} name='add' />
          </Button>
        </Fab>
      </Animatable.View>
    );
  }
}
