import React from "react";
import {
  ScrollView,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text as TextRN,
  TextInput
} from "react-native";
import {
  Text,
  Form,
  Item,
  Button,
  Icon,
  View,
  CheckBox,
  Spinner,
  ActionSheet,
  Footer,
  Left,
  Right
} from "native-base";
import Orientation from "react-native-orientation-locker";
import { ResponsiveComponent } from "react-native-responsive-ui";
import * as Animatable from "react-native-animatable";
import providerFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";
import computeStyleSheet from "../AuthStyles";
import commonColor from "../../../theme/variables/commonColor";
import DeviceInfo from "react-native-device-info";
import BackgroundComponent from "../../../components/background/BackgroundComponent";

const _provider = providerFactory.getProvider();
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
      comparator(v1, v2) {
        // True if EULA is checked
        return v1;
      }
    }
  }
};

export default class Login extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.tenants = _provider.getTenants();
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

  async componentDidMount() {
    // Unlock all
    Orientation.lockToPortrait();
    // Check
    _provider.checkAndTriggerAutoLogin();
    // Check if user is authenticated
    if (await _provider.isUserConnectionValid()) {
      // Navigate
      this._navigateToSites();
    } else {
      const email = await _provider.getUserEmail();
      const password = await _provider.getUserPassword();
      const userTenant = await _provider.getUserTenant();
      const tenant = _provider.getTenant(userTenant);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        email,
        password,
        tenant: userTenant,
        tenantTitle: tenant ? tenant.name : this.state.tenantTitle,
        display: true
      });
    }
  }

  _login = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
      const { password, email, eula, tenant } = this.state;
      try {
        // Loading
        this.setState({ loading: true });
        // Login
        await _provider.login(email, password, eula, tenant);
        // Login Success
        this.setState({ loading: false });
        // Navigate
        this._navigateToSites();
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
              Utils.handleHttpUnexpectedError(error.request);
          }
        }
      }
    }
  };

  _navigateToSites() {
    // Navigate to App
    this.props.navigation.navigate("AppDrawerNavigator");
  }

  _setTenant = buttonIndex => {
    // Provided?
    if (buttonIndex !== undefined) {
      // Set Tenant
      this.setState({
        tenant: this.tenants[buttonIndex].subdomain,
        tenantTitle: this.tenants[buttonIndex].name
      });
    }
  };

  _newUser = () => {
    const navigation = this.props.navigation;
    // Tenant selected?
    if (this.state.tenant) {
      navigation.navigate("SignUp", {
        tenant: this.state.tenant,
        email: this.state.email
      });
    } else {
      // Error
      Message.showError(I18n.t("authentication.mustSelectTenant"));
    }
  };

  _forgotPassword = () => {
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

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { display, eula, loading } = this.state;
    // Render
    return !display ? (
      <View style={style.noDisplay} />
    ) : (
      <Animatable.View
        style={style.container}
        animation={"fadeIn"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}
      >
        <BackgroundComponent>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
              <View style={style.formHeader}>
                <Image style={style.logo} source={logo} />
                <Text style={style.appText}>e-Mobility</Text>
                <Text style={style.appVersionText}>{`${I18n.t(
                  "general.version"
                )} ${DeviceInfo.getVersion()}`}</Text>
              </View>
              <Form style={style.form}>
                <Button
                  rounded
                  block
                  style={style.button}
                  onPress={() =>
                    ActionSheet.show(
                      {
                        options: this.tenants.map(tenant => tenant.name),
                        title: I18n.t("authentication.tenant")
                      },
                      (buttonIndex) => {
                        this._setTenant(buttonIndex);
                      }
                    )
                  }
                >
                  <TextRN style={style.buttonText}>{this.state.tenantTitle}</TextRN>
                </Button>
                {this.state.errorTenant &&
                  this.state.errorTenant.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="mail" style={style.inputIcon} />
                  <TextInput
                    name="email"
                    type="email"
                    returnKeyType="next"
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor={commonColor.textColorApp}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"email-address"}
                    secureTextEntry={false}
                    onChangeText={text => this.setState({ email: text })}
                    value={this.state.email}
                  />
                </Item>
                {this.state.errorEmail &&
                  this.state.errorEmail.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="unlock" style={[style.inputIcon, style.inputIconLock]} />
                  <TextInput
                    name="password"
                    type="password"
                    returnKeyType="go"
                    ref={ref => (this.passwordInput = ref)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    placeholder={I18n.t("authentication.password")}
                    placeholderTextColor={commonColor.textColorApp}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"default"}
                    secureTextEntry={true}
                    onChangeText={text => this.setState({ password: text })}
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
                  <CheckBox
                    style={style.eulaCheckbox}
                    checked={eula}
                    onPress={() => this.setState({ eula: !eula })}
                  />
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
                  <Spinner color="white" style={style.spinner} />
                ) : (
                  <Button rounded primary block style={style.button} onPress={this._login}>
                    <TextRN style={style.buttonText}>{I18n.t("authentication.login")}</TextRN>
                  </Button>
                )}
              </Form>
            </KeyboardAvoidingView>
          </ScrollView>
          <Footer>
            <Left>
              <Button
                small
                transparent
                style={style.linksButtonLeft}
                onPress={() => this._newUser()}
              >
                <TextRN style={style.linksTextButton}>{I18n.t("authentication.newUser")}</TextRN>
              </Button>
            </Left>
            <Right>
              <Button
                small
                transparent
                style={style.linksButtonRight}
                onPress={() => this._forgotPassword()}
              >
                <TextRN style={[style.linksTextButton, style.linksTextButtonRight]}>
                  {I18n.t("authentication.forgotYourPassword")}
                </TextRN>
              </Button>
            </Right>
          </Footer>
        </BackgroundComponent>
      </Animatable.View>
    );
  }
}
