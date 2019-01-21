import React from "react";
import { Image, ImageBackground, Keyboard, Linking, KeyboardAvoidingView, Text as TextRN, TextInput } from "react-native";
import { Container, Text, Form, Item, Button, Icon, View, Left, Right, CheckBox, Body, Footer, Spinner, ActionSheet } from "native-base";
import Orientation from "react-native-orientation";
import { ResponsiveComponent, MediaQuery } from "react-native-responsive-ui";

import providerFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import computeStyleSheet from "../styles";
import commonColor from "../../../theme/variables/commonColor";
import DeviceInfo from "react-native-device-info";

const _provider = providerFactory.getProvider();
const _locations = _provider.getLocations();

const formValidationDef = {
  location: {
    presence: {
      allowEmpty: false,
      message: I18n.t("general.mandatory")
    }
  },
  email: {
    presence: {
      allowEmpty: false,
      message: I18n.t("general.mandatory")
    },
    email: {
      message: "^" + I18n.t("general.email")
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: I18n.t("general.mandatory")
    }
  },
  eula: {
    equality: {
      attribute: "ghost",
      message: "^" + I18n.t("authentication.eulaNotAccepted"),
      comparator: function(v1, v2) {
        // True if EULA is checked
        return v1;
      }
    }
  }
};

class Login extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      eula: false,
      password: null,
      email: null,
      location: null,
      locationTitle: I18n.t("authentication.location"),
      loading: false,
      display: false
    };
  }

  async componentDidMount() {
    // Unlock all
    Orientation.unlockAllOrientations();
    // Check if user is authenticated
    if (await _provider.isUserAuthenticated()) {
      // Navigate
      this._navigateToSites();
    } else {
      const email = await _provider.getUserEmail();
      const password = await _provider.getUserPassword();
      const tenant = await _provider.getTenant();
      const location = _provider.getLocation(tenant);
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        email,
        password,
        location: tenant,
        locationTitle: (location ? location.name : this.state.locationTitle),
        display: true
      });
    }
  }

  login = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
      const { password, email, eula, location } = this.state;
      try {
        // Loading
        this.setState({loading: true});
        // Login
        await _provider.login(email, password, eula, location);
        // Login Success
        this.setState({loading: false});
        // Navigate
        this._navigateToSites();
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
  }

  _navigateToSites() {
    // Navigate to App
    this.props.navigation.navigate("AppDrawerNavigator");
  }

  _setTenant = (buttonIndex) => {
    // Provided?
    if (buttonIndex !== undefined) {
      // Set Tenant
      this.setState({
        location: _locations[buttonIndex].subdomain,
        locationTitle: _locations[buttonIndex].name
      });
    }
  }

  _newUser = () => {
    // Tenant selected?
    if (this.state.location) {
      Linking.openURL(`https://${this.state.location}.ev.cfapps.eu10.hana.ondemand.com/#/register`);
    } else {
      // Error
      Message.showError(I18n.t("authentication.mustSelectLocation"));
    }
  }

  _forgotPassword = () => {
    // Tenant selected?
    if (this.state.location) {
      Linking.openURL(`https://${this.state.location}.ev.cfapps.eu10.hana.ondemand.com/#/reset-password`);
    } else {
      // Error
      Message.showError(I18n.t("authentication.mustSelectLocation"));
    }
  }

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { display, eula, loading } = this.state;
    // Render
    return (
      display ?
        <Container>
          <ImageBackground source={require("../../../../assets/bg.png")} style={style.background}>
              <KeyboardAvoidingView style={style.container} behavior="padding">
                <MediaQuery minHeight={450} >
                  <View style={style.logoContainer}>
                    <Image source={require("../../../../assets/logo-low.gif")} style={style.logo} />
                    <Text style={style.appText}>e-Mobility</Text>
                    <Text style={style.versionText}>{`${I18n.t("general.version")} ${DeviceInfo.getVersion()}`}</Text>
                    <Text style={style.versionDate}>({DeviceInfo.getLastUpdateTime() ? new Date(DeviceInfo.getLastUpdateTime()).toLocaleDateString() : I18n.t("general.date")})</Text>
                  </View>
                </MediaQuery>
                <Form style={style.form}>
                  <Button rounded block style={style.button}
                    onPress={() =>
                      ActionSheet.show(
                        {
                          options: _locations.map(location => location.name),
                          title: I18n.t("authentication.location")
                        },
                        buttonIndex => {
                          this._setTenant(buttonIndex);
                        }
                      )}>
                    <TextRN style={style.buttonText}>{this.state.locationTitle}</TextRN>
                  </Button>
                  {this.state.errorLocation && this.state.errorLocation.map((errorMessage, index) => <Text style={style.formErrorText} key={index}>{errorMessage}</Text>) }
                  <Item rounded style={style.inputGroup}>
                    <Icon active name="mail" style={style.inputIconMail}/>
                    <TextInput
                      name="email"
                      type="email"
                      returnKeyType= "next"
                      placeholder={I18n.t("authentication.email")}
                      placeholderTextColor={commonColor.textColor}
                      onSubmitEditing={() => this.passwordInput._root.focus()}
                      style={style.inputField}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      autoCorrect={false}
                      keyboardType={"email-address"}
                      secureTextEntry={false}
                      onChangeText={(text) => this.setState({email: text})}
                      value={this.state.email}
                    />
                  </Item>
                  {this.state.errorEmail && this.state.errorEmail.map((errorMessage, index) => <Text style={style.formErrorText} key={index}>{errorMessage}</Text>) }

                  <Item rounded style={style.inputGroup}>
                    <Icon active name="unlock" style={style.inputIconPassword}/>
                    <TextInput
                      name="password"
                      type="password"
                      returnKeyType="go"
                      ref={(ref)=>(this.passwordInput = ref)}
                      onSubmitEditing={()=>Keyboard.dismiss()}
                      placeholder={I18n.t("authentication.password")}
                      placeholderTextColor={commonColor.textColor}
                      style={style.inputField}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      autoCorrect={false}
                      keyboardType={"default"}
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({password: text})}
                      value={this.state.password}
                    />
                  </Item>
                  {this.state.errorPassword && this.state.errorPassword.map((errorMessage, index) => <Text style={style.formErrorText} key={index}>{errorMessage}</Text>) }

                  <Item style={style.eulaContainer}>
                    <CheckBox style={style.eulaCheckbox} checked={eula} onPress={() => this.setState({eula: !eula})} />
                    <Body>
                      <Text style={style.eulaText}>{I18n.t("authentication.acceptEula")}
                        <Text onPress={()=> navigation.navigate("Eula")} style={style.eulaLink}>{I18n.t("authentication.eula")}</Text>
                      </Text>
                    </Body>
                  </Item>
                  <View>
                    {this.state.errorEula && this.state.errorEula.map((errorMessage, index) => <Text style={style.formErrorText} key={index}>{errorMessage}</Text>) }
                  </View>
                  { loading ?
                    <Spinner style={style.spinner}/>
                  :
                    <Button rounded primary block style={style.button} onPress={this.login}>
                      <TextRN style={style.buttonText}>{I18n.t("authentication.login")}</TextRN>
                    </Button>
                  }
                </Form>
              </KeyboardAvoidingView>
              <Footer>
                <Left>
                  <Button small transparent style={style.linksButtonLeft} onPress={ () => this._newUser()}>
                    <TextRN style={style.linksTextButton}>{I18n.t("authentication.newUser")}</TextRN>
                  </Button>
                </Left>
                <Right>
                  <Button small transparent style={style.linksButtonRight} onPress={ () => this._forgotPassword()}>
                    <TextRN style={style.linksTextButton}>{I18n.t("authentication.forgotYourPassword")}</TextRN>
                  </Button>
                </Right>
              </Footer>
          </ImageBackground>
        </Container>
      :
        <View style={style.noDisplay}/>
    );
  }
}

export default Login;
