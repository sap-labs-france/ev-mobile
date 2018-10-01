import React from "react";
import { Image, ImageBackground, Keyboard} from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import {
  Container,
  Content,
  Text,
  Form,
  Item,
  Input,
  Button,
  Icon,
  View,
  Left,
  Right,
  CheckBox,
  Body,
  ListItem,
  Footer,
  Spinner
} from "native-base";
import CentralServerProvider from "../../../provider/CentralServerProvider";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import styles from "../styles";

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

class Login extends React.Component {

  passwordInput;
  eulaCheckBox;

  constructor(props) {
    super(props);

    this.state = {
      eula: false,
      password: "",
      email: "",
      loading: false
    };
  }

  render() {
    const navigation = this.props.navigation;
    const { eula, loading } = this.state;
    return (
      <Container>
        <ImageBackground source={require("../../../../assets/bg.png")} style={styles.background}>
         <Content contentContainerStyle={styles.content}>
            <View style={styles.container}>
              <Image source={require("../../../../assets/logo-low.gif")} style={styles.logo} />
            </View>
            <View style={styles.container}>
              <Form style={styles.form}>
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
                    onChangeText={(text) => this.setState({email: text})}
                    secureTextEntry={false}
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
                    onChangeText={(text) => this.setState({password: text})}
                    secureTextEntry={true}
                  />
                </Item>
                {this.state.errorPassword && this.state.errorPassword.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }

                <ListItem style={styles.listItemEulaCheckbox}>
                  <CheckBox checked={eula}
                    onPress={() => this.setState({eula: !eula})} />
                  <Body>
                    <Text style={styles.eulaText}>{I18n.t("authentication.acceptEula")}
                      <Text onPress={()=>this.props.navigation.navigate("Eula")} style={styles.eulaLink}>{I18n.t("authentication.eula")}</Text>
                    </Text>
                  </Body>
     			      </ListItem>
                <View>
                  {this.state.errorEula && this.state.errorEula.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }
                </View>
                {loading ?
                  <Spinner style={styles.spinner} color="white" />
                  :
                  <Button rounded primary block large
                    style={styles.button} onPress={this.login}
                  >
                    <Text style={styles.buttonText}>
                      {I18n.t("authentication.login")}
                    </Text>
                  </Button>
                }
              </Form>
            </View>
          </Content>
          <Footer>
            <Left>
              <Button small transparent style={styles.linksButtonLeft}
                onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.helpButton}>{I18n.t("authentication.newUser")}</Text>
              </Button>
            </Left>
            <Right>
              <Button small transparent style={styles.linksButtonRight}
                onPress={() => navigation.navigate("RetrievePassword")}>
                <Text style={styles.helpButton}>{I18n.t("authentication.forgotYourPassword")}</Text>
              </Button>
            </Right>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }

  login = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      // Login
      const { password, email, eula } = this.state;
      try {
        // Loading
        this.setState({loading: true});
        // Login
        await CentralServerProvider.login(email, password, eula);
        // Login Success
        this.setState({loading: false});
        // Navigate to sites
        return this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: "DrawerNavigation" })]
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
        } else {
          Message.showError(I18n.t("general.unexpectedError"));
        }
      }
    }
  }
}

export default Login;
