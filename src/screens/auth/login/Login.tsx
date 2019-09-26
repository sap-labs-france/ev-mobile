import { ActionSheet, Button, CheckBox, Footer, Form, Icon, Item, Left, Right, Spinner, Text, View } from "native-base";
import React from "react";
import { Alert, BackHandler, Image, Keyboard, KeyboardAvoidingView, ScrollView, Text as TextRN, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import DeviceInfo from "react-native-device-info";
import Orientation from "react-native-orientation-locker";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import I18n from "../../../I18n/I18n";
import commonColor from "../../../theme/variables/commonColor";
import BaseProps from "../../../types/BaseProps";
import Tenant from "../../../types/Tenant";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";
import Utils from "../../../utils/Utils";
import BaseScreen from "../../base-screen/BaseScreen";
import computeStyleSheet from "../AuthStyles";

const logo = require("../../../../assets/logo-low.png");

const formValidationDef = {
  tenant: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_tenant")
    }
  },
  email: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_email")
    },
    email: {
      message: "^" + I18n.t("authentication.invalid_email")
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_password")
    }
  },
  eula: {
    equality: {
      attribute: "ghost",
      message: "^" + I18n.t("authentication.eulaNotAccepted"),
      comparator(v1: boolean, v2: boolean) {
        // True if EULA is checked
        return v1;
      }
    }
  }
};

export interface Props extends BaseProps {
}

interface State {
  eula?: boolean;
  password?: string;
  email?: string;
  tenant?: string;
  tenantTitle?: string;
  loading?: boolean;
  display?: boolean;
  errorEula?: object[];
  errorPassword?: object[];
  errorTenant?: object[];
  errorEmail?: object[];
}

export default class Login extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private tenants: Array<Partial<Tenant>>;
  private passwordInput: TextInput;

  constructor(props: Props) {
    super(props);
    this.state = {
      eula: false,
      password: null,
      email: Utils.getParamFromNavigation(this.props.navigation, "email", ""),
      tenant: Utils.getParamFromNavigation(this.props.navigation, "tenant", ""),
      tenantTitle: I18n.t("authentication.tenant"),
      loading: false,
      display: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Get Tenants
    this.tenants = this.centralServerProvider.getTenants();
    // Lock
    Orientation.lockToPortrait();
    const tenantSubDomain = this.centralServerProvider.getUserTenant();
    const tenant = this.centralServerProvider.getTenant(tenantSubDomain);
    const email = this.centralServerProvider.getUserEmail();
    const password = this.centralServerProvider.getUserPassword();
    // Set
    this.setState({
      email,
      password,
      tenant: tenantSubDomain,
      tenantTitle: tenant ? tenant.name : this.state.tenantTitle,
      display: true
    });
    // Check if user can be logged
    if (!this.centralServerProvider.hasForcedLogOff() && tenantSubDomain && email && password) {
      try {
        // Check EULA
        const result = await this.centralServerProvider.checkEndUserLicenseAgreement({Email: email, Tenant: tenantSubDomain});
        if (result.eulaAccepted) {
          // Try to login
          this.setState({eula: true}, () => this.login());
        }        
      } catch (error) {
          // Do nothing: user must log on
      }
    }
  }

  public login = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
      const { password, email, eula, tenant } = this.state;
      try {
        // Loading
        this.setState({ loading: true } as State);
        // Login
        await this.centralServerProvider.login(email, password, eula, tenant);
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
              Message.showError(I18n.t("authentication.wrongEmailOrPassword"));
              break;
            // Account is locked
            case 570:
              Message.showError(I18n.t("authentication.accountLocked"));
              break;
            // Account not Active
            case 580:
              Message.showError(I18n.t("authentication.accountNotActive"));
              break;
            // Account Pending
            case 590:
              Message.showError(I18n.t("authentication.accountPending"));
              break;
            // Eula no accepted
            case 520:
              Message.showError(I18n.t("authentication.eulaNotAccepted"));
              break;
            default:
              // Other common Error
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error.request);
          }
        }
      }
    }
  };

  public onBack = () => {
    // Exit?
    Alert.alert(
      I18n.t("general.exitApp"),
      I18n.t("general.exitAppConfirm"),
      [{ text: I18n.t("general.no"), style: "cancel" }, { text: I18n.t("general.yes"), onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
    // Do not bubble up
    return true;
  };

  public navigateToSites() {
    // Navigate to App
    this.props.navigation.navigate("AppDrawerNavigator");
  }

  public setTenant = (buttonIndex: number) => {
    // Provided?
    if (buttonIndex !== undefined) {
      // Set Tenant
      this.setState({
        tenant: this.tenants[buttonIndex].subdomain,
        tenantTitle: this.tenants[buttonIndex].name
      });
    }
  };

  public newUser = () => {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenant) {
      navigation.navigate("SignUp", {
        tenant: this.state.tenant,
        email: this.state.email
      });
    } else {
      Message.showError(I18n.t("authentication.mustSelectTenant"));
    }
  };

  public forgotPassword = () => {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenant) {
      navigation.navigate("RetrievePassword", {
        tenant: this.state.tenant,
        email: this.state.email
      });
    } else {
      // Error
      Message.showError(I18n.t("authentication.mustSelectTenant"));
    }
  };

  public render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { display, eula, loading } = this.state;
    // Render
    return !display ? (
      <View style={style.noDisplay} />
    ) : (
      <Animatable.View style={style.container} animation={"fadeIn"} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <BackgroundComponent navigation={this.props.navigation}>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
              <View style={style.formHeader}>
                <Image style={style.logo} source={logo} />
                <Text style={style.appText}>e-Mobility</Text>
                <Text style={style.appVersionText}>{`${I18n.t("general.version")} ${DeviceInfo.getVersion()}`}</Text>
              </View>
              <Form style={style.form}>
                <Button
                  rounded={true}
                  block={true}
                  style={style.button}
                  onPress={() =>
                    ActionSheet.show(
                      {
                        options: this.tenants.map((tenant) => tenant.name),
                        title: I18n.t("authentication.tenant")
                      },
                      (buttonIndex) => {
                        this.setTenant(buttonIndex);
                      }
                    )
                  }>
                  <TextRN style={style.buttonText}>{this.state.tenantTitle}</TextRN>
                </Button>
                {this.state.errorTenant &&
                  this.state.errorTenant.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                  <Icon active={true} name="mail" style={style.inputIcon} />
                  <TextInput
                    returnKeyType="next"
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor={commonColor.placeholderTextColor}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"email-address"}
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
                  <Icon active={true} name="unlock" style={[style.inputIcon, style.inputIconLock]} />
                  <TextInput
                    returnKeyType="go"
                    ref={(ref) => (this.passwordInput = ref)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    placeholder={I18n.t("authentication.password")}
                    placeholderTextColor={commonColor.placeholderTextColor}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"default"}
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
                    {I18n.t("authentication.acceptEula")}
                    <Text onPress={() => navigation.navigate("Eula")} style={style.eulaLink}>
                      {I18n.t("authentication.eula")}
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
                  <Spinner style={style.spinner} color="white" />
                ) : (
                  <Button rounded={true} primary={true} block={true} style={style.button} onPress={() => this.login()}>
                    <TextRN style={style.buttonText}>{I18n.t("authentication.login")}</TextRN>
                  </Button>
                )}
              </Form>
            </KeyboardAvoidingView>
          </ScrollView>
          <Footer style={style.footer}>
            <Left>
              <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.newUser()}>
                <TextRN style={style.linksTextButton}>{I18n.t("authentication.newUser")}</TextRN>
              </Button>
            </Left>
            <Right>
              <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonRight]} onPress={() => this.forgotPassword()}>
                <TextRN style={[style.linksTextButton, style.linksTextButtonRight]}>{I18n.t("authentication.forgotYourPassword")}</TextRN>
              </Button>
            </Right>
          </Footer>
        </BackgroundComponent>
      </Animatable.View>
    );
  }
}
