import React from "react";
import { Image, ImageBackground, Keyboard, ScrollView, Linking } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { Container, Text, Form, Item, Input, Button, Icon, View, Left, Right, CheckBox, Body, ListItem, Footer, Spinner, ActionSheet } from "native-base";
import Orientation from "react-native-orientation";

import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import styles from "../styles";

const _provider = ProviderFactory.getProvider();
const formValidationDef = {
  email: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("general.required")
    },
    email: {
      message: "^" + I18n.t("general.email")
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("general.required")
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

const locations = ["Charge@Home", "SAP Labs France", "Cancel"];

class Login extends React.Component {
  passwordInput;
  eulaCheckBox;

  constructor(props) {
    super(props);

    this.state = {
      eula: false,
      password: "",
      email: "",
      tenant: "",
      tenantTitle: "Choose a location",
      loading: false,
      display: false
    };
  }

  async componentDidMount() {
    Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
    // Check if user is authenticated
    if (await _provider.isUserAuthenticated()) {
      // Navigate
      this._navigateToSites();
    } else {
      // Set default email/password
      await this._setDefaultInputs();
    }
  }

  login = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
      const { password, email, eula, tenant } = this.state;
      try {
        // Loading
        this.setState({loading: true});
        // Login
        await _provider.login(email, password, eula, tenant);
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
    // Navigate to sites
    return this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: "DrawerNavigation" })]
      })
    );
  }

  _setDefaultInputs = async () => {
    const email = await _provider.getUserEmail();
    const password = await _provider.getUserPassword();
    this.setState({
      email,
      password,
      display: true
    });
  }

  _setTenant = (buttonIndex) => {
    if (buttonIndex === 0) {
      this.setState({tenant: "slfcah"});
    } else if (buttonIndex === 1) {
      this.setState({tenant: "slf"});
    }
    this.setState({tenantTitle: locations[buttonIndex] === "Cancel" ? this.state.tenantTitle : locations[buttonIndex]});
  }

  render() {
    const navigation = this.props.navigation;
    const { display, eula, loading, tenantTitle } = this.state;
    // Do not display?
    if (!display) {
      return (<View style={styles.nodisplay}/>);
    }
    // Render
    return (
      <Container>
        <ImageBackground source={require("../../../../assets/bg.png")} style={styles.background}>
          <ScrollView contentContainerStyle={styles.content} bounces={false}>
            <View style={styles.container}>
              <Image source={require("../../../../assets/logo-low.gif")} style={styles.logo} />
            </View>
            <View style={styles.container}>
              <Form style={styles.form}>
                <Button
                  style={styles.buttonActionsheet}
                  onPress={() =>
                    ActionSheet.show(
                      {
                        options: locations,
                        cancelButtonIndex: locations.indexOf("Cancel"),
                        title: "Choose a location"
                      },
                      buttonIndex => {
                        this._setTenant(buttonIndex);
                      }
                    )}>
                    <Text style={styles.textActionsheet}>{this.state.tenantTitle}</Text>
                  </Button>
                  <Item inlineLabel rounded style={styles.inputGroup}>
                    <Icon active name="mail" style={styles.icon} />
                    <Input
                      name="email"
                      type="email"
                      returnKeyType= "next"
                      placeholder={I18n.t("authentication.email")}
                      placeholderTextColor="#FFF"
                      onSubmitEditing={() => this.passwordInput._root.focus()}
                      style={styles.input}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      autoCorrect={false}
                      keyboardType={"email-address"}
                      secureTextEntry={false}
                      onChangeText={(text) => this.setState({email: text})}
                      value={this.state.email}
                    />
                  </Item>
                  {this.state.errorEmail && this.state.errorEmail.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }

                  <Item inlineLabel rounded style={styles.inputGroup}>
                    <Icon active name="unlock" style={styles.icon} />
                    <Input
                      name="password"
                      type="password"
                      returnKeyType="go"
                      ref={(ref)=>(this.passwordInput = ref)}
                      onSubmitEditing={()=>Keyboard.dismiss()}
                      placeholder={I18n.t("authentication.password")}
                      placeholderTextColor="#FFF"
                      style={styles.input}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      autoCorrect={false}
                      keyboardType={"default"}
                      secureTextEntry={true}
                      onChangeText={(text) => this.setState({password: text})}
                      value={this.state.password}
                    />
                  </Item>
                  {this.state.errorPassword && this.state.errorPassword.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }

                  <ListItem style={styles.listItemEulaCheckbox}>
                    <CheckBox checked={eula} onPress={() => this.setState({eula: !eula})} />
                    <Body>
                      <Text style={styles.eulaText}>{I18n.t("authentication.acceptEula")}
                        <Text onPress={()=>this.props.navigation.navigate("Eula")} style={styles.eulaLink}>{I18n.t("authentication.eula")}</Text>
                      </Text>
                    </Body>
                  </ListItem>
                  <View>
                    {this.state.errorEula && this.state.errorEula.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }
                  </View>
                { loading ?
                  <Spinner style={styles.spinner} color="white" />
                :
                  <Button rounded primary block large style={styles.button} disabled={tenantTitle === "Choose a location"} onPress={tenantTitle !== "Choose a location" ? this.login : null}>
                    <Text style={styles.buttonText}>{I18n.t("authentication.login")}</Text>
                  </Button>
                }
              </Form>
            </View>
            <Footer>
              <Left>
                <Button small transparent style={styles.linksButtonLeft} disabled={!this.state.tenant} onPress={ async () => await Linking.openURL(`https://${this.state.tenant}.ev.cfapps.eu10.hana.ondemand.com/#/register`)}>
                  <Text style={styles.helpButton}>{I18n.t("authentication.newUser")}</Text>
                </Button>
              </Left>
              <Right>
              <Button small transparent style={styles.linksButtonRight} disabled={!this.state.tenant} onPress={ async () => await Linking.openURL(`https://${this.state.tenant}.ev.cfapps.eu10.hana.ondemand.com/#/reset-password`)}>
                  <Text style={styles.helpButton}>{I18n.t("authentication.forgotYourPassword")}</Text>
                </Button>
              </Right>
            </Footer>
          </ScrollView>
        </ImageBackground>
      </Container>
    );
  }
}

export default Login;
