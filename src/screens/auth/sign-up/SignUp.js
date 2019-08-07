import React from "react";
import {
  Image,
  TextInput,
  Keyboard,
  ScrollView,
  Text as TextRN,
  KeyboardAvoidingView,
} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import * as Animatable from "react-native-animatable";
import {
  Form,
  Text,
  Button,
  Icon,
  Item,
  View,
  CheckBox,
  Footer,
  Spinner,
  Right,
} from "native-base";
import commonColor from "../../../theme/variables/commonColor";
import computeStyleSheet from "../AuthStyles";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import Constants from "../../../utils/Constants";
import DeviceInfo from "react-native-device-info";
import ReCaptcha from "react-native-recaptcha-v3";
import BaseScreen from "../../base-screen/BaseScreen";
import BackgroundComponent from "../../../components/background/BackgroundComponent";

const logo = require("../../../../assets/logo-low.png");

const formValidationDef = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_name"),
    },
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_first_name"),
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_email"),
    },
    email: {
      message: "^" + I18n.t("authentication.invalid_email"),
    },
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_password"),
    },
    equality: {
      attribute: "ghost",
      message: "^" + I18n.t("authentication.passwordRule"),
      comparator(password, ghost) {
        // True if EULA is checked
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#@:;,<>\/''\$%\^&\*\.\?\-_\+\=\(\)])(?=.{8,})/.test(
          password
        );
      },
    },
  },
  repeatPassword: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_password"),
    },
    equality: {
      attribute: "password",
      message: "^" + I18n.t("authentication.passwordNotMatch"),
    },
  },
  eula: {
    equality: {
      attribute: "ghost",
      message: I18n.t("authentication.eulaNotAccepted"),
      comparator(eula, ghost) {
        // True if EULA is checked
        return eula;
      },
    },
  },
};
export default class SignUp extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      tenant: Utils.getParamFromNavigation(this.props.navigation, "tenant", ""),
      tenantName: "",
      name: "",
      firstName: "",
      email: Utils.getParamFromNavigation(this.props.navigation, "email", ""),
      password: "",
      repeatPassword: "",
      eula: false,
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      loading: false,
    };
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Init
    const tenant = this.centralServerProvider.getTenant(this.state.tenant);
    this.setState({
      tenantName: tenant.name,
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl(),
    });
  }

  _recaptchaResponseToken = (captcha) => {
    this.setState({ captcha });
  };

  _signUp = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    if (formIsValid) {
      const {
        tenant,
        name,
        firstName,
        email,
        password,
        repeatPassword,
        eula,
        captcha,
      } = this.state;
      try {
        // Loading
        this.setState({ loading: true });
        // Register
        await this.centralServerProvider.register(
          tenant,
          name,
          firstName,
          email,
          { password, repeatPassword },
          eula,
          captcha
        );
        // Reset
        this.setState({ loading: false });
        // Show
        Message.showSuccess(I18n.t("authentication.registerSuccess"));
        // Navigate
        return this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Login",
                params: {
                  tenant: this.state.tenant,
                  email: this.state.email,
                },
              }),
            ],
          })
        );
      } catch (error) {
        // Reset
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Invalid Captcha
            case 530:
              Message.showError(I18n.t("authentication.invalidCaptcha"));
              break;
            default:
              // Other common Error
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error.request);
          }
        } else {
          Message.showError(I18n.t("general.unexpectedError"));
        }
      }
    }
  };

  onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate("Login");
    // Do not bubble up
    return true;
  };

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { eula, loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl } = this.state;
    return (
      <Animatable.View
        style={style.container}
        animation={"fadeIn"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <BackgroundComponent>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
              <View style={style.formHeader}>
                <Image style={style.logo} source={logo} />
                <Text style={style.appText}>e-Mobility</Text>
                <Text style={style.appVersionText}>{`${I18n.t(
                  "general.version"
                )} ${DeviceInfo.getVersion()}`}</Text>
                <Text style={style.appTenantName}>{tenantName}</Text>
              </View>
              <Form style={style.form}>
                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="person" style={style.inputIcon} />
                  <TextInput
                    name="name"
                    type="text"
                    onSubmitEditing={() => this.firstNameInput.focus()}
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.name")}
                    placeholderTextColor={commonColor.inverseTextColor}
                    style={style.inputField}
                    autoCapitalize="characters"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({ name: text })}
                    secureTextEntry={false}
                  />
                </Item>
                {this.state.errorName &&
                  this.state.errorName.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}

                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="person" style={style.inputIcon} />
                  <TextInput
                    name="firstName"
                    type="text"
                    ref={(ref) => (this.firstNameInput = ref)}
                    onSubmitEditing={() => this.emailInput.focus()}
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.firstName")}
                    placeholderTextColor={commonColor.inverseTextColor}
                    style={style.inputField}
                    autoCapitalize="words"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({ firstName: text })}
                    secureTextEntry={false}
                  />
                </Item>
                {this.state.errorFirstName &&
                  this.state.errorFirstName.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}

                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="mail" style={style.inputIcon} />
                  <TextInput
                    name="email"
                    type="email"
                    ref={(ref) => (this.emailInput = ref)}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor={commonColor.inverseTextColor}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"email-address"}
                    onChangeText={(text) => this.setState({ email: text })}
                    secureTextEntry={false}
                  />
                </Item>
                {this.state.errorEmail &&
                  this.state.errorEmail.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}

                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="unlock" style={style.inputIcon} />
                  <TextInput
                    name="password"
                    type="password"
                    ref={(ref) => (this.passwordInput = ref)}
                    onSubmitEditing={() => this.repeatPasswordInput.focus()}
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.password")}
                    placeholderTextColor={commonColor.inverseTextColor}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"default"}
                    onChangeText={(text) => this.setState({ password: text })}
                    secureTextEntry={true}
                  />
                </Item>
                {this.state.errorPassword &&
                  this.state.errorPassword.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="unlock" style={style.inputIcon} />
                  <TextInput
                    name="repeatPassword"
                    type="password"
                    ref={(ref) => (this.repeatPasswordInput = ref)}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.repeatPassword")}
                    placeholderTextColor={commonColor.inverseTextColor}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"default"}
                    onChangeText={(text) => this.setState({ repeatPassword: text })}
                    secureTextEntry={true}
                  />
                </Item>
                {this.state.errorRepeatPassword &&
                  this.state.errorRepeatPassword.map((errorMessage, index) => (
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
                {loading || !captcha ? (
                  <Spinner style={style.spinner} color="white" />
                ) : (
                  <Button rounded primary block style={style.button} onPress={() => this._signUp()}>
                    <TextRN style={style.buttonText}>{I18n.t("authentication.signUp")}</TextRN>
                  </Button>
                )}
              </Form>
            </KeyboardAvoidingView>
            {captchaSiteKey && captchaBaseUrl ? (
              <ReCaptcha
                containerStyle={style.recaptcha}
                siteKey={captchaSiteKey}
                url={captchaBaseUrl}
                action="RegisterUser"
                reCaptchaType={1}
                onExecute={this._recaptchaResponseToken}
              />
            ) : (
              undefined
            )}
          </ScrollView>
          <Footer style={style.footer}>
            <Right>
              <Button
                small
                transparent
                style={style.linksButtonRight}
                onPress={() => this.props.navigation.goBack()}>
                <TextRN style={[style.linksTextButton, style.linksTextButtonRight]}>
                  {I18n.t("authentication.backLogin")}
                </TextRN>
              </Button>
            </Right>
          </Footer>
        </BackgroundComponent>
      </Animatable.View>
    );
  }
}
