import React from "react";
import { WebView, ScrollView, Image, TextInput, ImageBackground, KeyboardAvoidingView } from "react-native";
import { Text, Form, Item, Button, Icon, View, Spinner, Footer } from "native-base";
import { NavigationActions, StackActions } from "react-navigation";
import commonColor from "../../../theme/variables/commonColor";
import ProviderFactory from "../../../provider/ProviderFactory";
import { ResponsiveComponent } from "react-native-responsive-ui";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import computeStyleSheet from "../styles";
import * as Animatable from "react-native-animatable";
import Constants from "../../../utils/Constants";
import DeviceInfo from "react-native-device-info";

const _provider = ProviderFactory.getProvider();
const logo = require("../../../../assets/logo-low.gif");
const background = require("../../../../assets/bg-signup.png");

const formValidationDef = {
  email: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("general.required")
    },
    email: {
      message: "^" + I18n.t("general.email")
    }
  }
};

export default class RetrievePassword extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      tenant: Utils.getParamFromNavigation(this.props.navigation, "tenant", null),
      email: "",
      loading: false
    };
  }

  _resetPassword = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
      const { email } = this.state;
      try {
        this.setState({loading: true});
        // Login
        await _provider.resetPassword(email);
        // Login Success
        this.setState({loading: false});
        // Show
        Message.showSuccess(I18n.t("authentication.resetSuccess"));
        // Navigate
        return this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "Login" })]
          })
        );

      } catch (error) {
        // Login failed
        this.setState({loading: false});
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Unknown Email
            case 500:
            case 550:
              Message.showError(I18n.t("authentication.wrongEmail"));
              break;
            default:
              // Other common Error
              Utils.handleHttpUnexpectedError(error.request);
          }
        } else {
          Message.showError(I18n.t("general.unexpectedError"));
        }
      }
    }
  }

  onMessage(data) {
    //Prints out data that was passed.
    console.log("onMessage");
    console.log(data);
  }

  render() {
    const { loading } = this.state;
    const style = computeStyleSheet();
    return (
      <Animatable.View style={style.container} animation={"fadeIn"} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <ImageBackground source={background} style={style.background}>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.container} behavior="padding">
              <View style={style.formHeader}>
                <Image style={style.logo} source={logo} />
                <Text style={style.appText}>e-Mobility</Text>
                <Text style={style.appVersionText}>{`${I18n.t("general.version")} ${DeviceInfo.getVersion()}`}</Text>
              </View>
              <Form style={style.form}>
                <Item rounded style={style.inputGroup}>
                  <Icon active name="mail" style={style.inputIcon}/>
                  <TextInput
                    name="email"
                    type="email"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor={commonColor.textColor}
                    style={style.inputField}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"email-address"}
                    onChangeText={(text) => this.setState({email: text})}
                    secureTextEntry={false}
                  />
                </Item>
                {this.state.errorEmail && this.state.errorEmail.map((errorMessage, index) => <Text style={style.formErrorText} key={index}>{errorMessage}</Text>) }
                { loading ?
                  <Spinner style={style.spinner} color="white" />
                :
                  <Button rounded primary block large style={style.button} onPress={this._resetPassword}>
                    <Text style={style.buttonText}>
                      {I18n.t("authentication.retrievePassword")}
                    </Text>
                  </Button>
                }
              </Form>
            </KeyboardAvoidingView>
            <WebView
              javaScriptEnabled={true}
              mixedContentMode={"always"}
              style={{height: 200, backgroundColor: 'black'}}
              onMessage={this.onMessage}
              source={{
                  html: `
                  `,
                  baseUrl: 'https://slf.cfapps.eu10.hana.ondemand.com' // <-- SET YOUR DOMAIN HERE
              }}/>
          </ScrollView>
          <Footer>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text style={style.linksTextButton}>{I18n.t("authentication.backLogin")}</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Animatable.View>
    );
  }
}
