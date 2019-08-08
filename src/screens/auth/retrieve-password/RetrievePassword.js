import React from "react";
import { ScrollView, Image, TextInput, KeyboardAvoidingView, Text as TextRN } from "react-native";
import { Text, Form, Item, Button, Icon, View, Spinner, Footer, Left } from "native-base";
import { NavigationActions, StackActions } from "react-navigation";
import commonColor from "../../../theme/variables/commonColor";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import computeStyleSheet from "../AuthStyles";
import * as Animatable from "react-native-animatable";
import Constants from "../../../utils/Constants";
import DeviceInfo from "react-native-device-info";
import ReCaptcha from "react-native-recaptcha-v3";
import BaseScreen from "../../base-screen/BaseScreen";
import BackgroundComponent from "../../../components/background/BackgroundComponent";

const logo = require("../../../../assets/logo-low.png");

const formValidationDef = {
  email: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("authentication.mandatory_email")
    },
    email: {
      message: "^" + I18n.t("authentication.invalid_email")
    }
  }
};

export default class RetrievePassword extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      tenant: Utils.getParamFromNavigation(this.props.navigation, "tenant", ""),
      tenantName: "",
      email: Utils.getParamFromNavigation(this.props.navigation, "email", ""),
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      loading: false
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
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
  }

  _recaptchaResponseToken = (captcha) => {
    this.setState({ captcha });
  };

  _retrievePassword = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    if (formIsValid) {
      const { tenant, email, captcha } = this.state;
      try {
        this.setState({ loading: true });
        // Login
        await this.centralServerProvider.retrievePassword(tenant, email, captcha);
        // Login Success
        this.setState({ loading: false });
        // Show
        Message.showSuccess(I18n.t("authentication.resetSuccess"));
        // Navigate
        return this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: "Login",
                params: {
                  tenant: this.state.tenant,
                  email: this.state.email
                }
              })
            ]
          })
        );
      } catch (error) {
        // Login failed
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Invalid Captcha
            case 530:
              Message.showError(I18n.t("authentication.invalidCaptcha"));
              break;
            // Unknown Email
            case 550:
              Message.showError(I18n.t("authentication.wrongEmail"));
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
    const { loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl } = this.state;
    return (
      <Animatable.View style={style.container} animation={"fadeIn"} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <BackgroundComponent>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.keyboardContainer} behavior="padding">
              <View style={style.formHeader}>
                <Image style={style.logo} source={logo} />
                <Text style={style.appText}>e-Mobility</Text>
                <Text style={style.appVersionText}>{`${I18n.t("general.version")} ${DeviceInfo.getVersion()}`}</Text>
                <Text style={style.appTenantName}>{tenantName}</Text>
              </View>
              <Form style={style.form}>
                <Item inlineLabel rounded style={style.inputGroup}>
                  <Icon active name="mail" style={style.inputIcon} />
                  <TextInput
                    name="email"
                    type="email"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor={commonColor.inverseTextColor}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"email-address"}
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
                {loading || !captcha ? (
                  <Spinner style={style.spinner} color="white" />
                ) : (
                  <Button rounded primary block style={style.button} onPress={() => this._retrievePassword()}>
                    <TextRN style={style.buttonText}>{I18n.t("authentication.retrievePassword")}</TextRN>
                  </Button>
                )}
              </Form>
            </KeyboardAvoidingView>
            {captchaSiteKey && captchaBaseUrl ? (
              <ReCaptcha
                containerStyle={style.recaptcha}
                siteKey={captchaSiteKey}
                url={captchaBaseUrl}
                action="ResetPassword"
                reCaptchaType={1}
                onExecute={this._recaptchaResponseToken}
              />
            ) : (
              undefined
            )}
          </ScrollView>
          <Footer style={style.footer}>
            <Left>
              <Button small transparent style={style.linksButtonLeft} onPress={() => this.props.navigation.goBack()}>
                <TextRN style={[style.linksTextButton, style.linksTextButtonLeft]}>{I18n.t("authentication.backLogin")}</TextRN>
              </Button>
            </Left>
          </Footer>
        </BackgroundComponent>
      </Animatable.View>
    );
  }
}
