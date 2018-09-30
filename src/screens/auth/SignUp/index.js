import React from "react";
import { Image, ImageBackground } from "react-native";
import {
  Container,
  Content,
  Form,
  Text,
  Button,
  Icon,
  Item,
  Input,
  View,
  ListItem,
  CheckBox,
  Body,
  Footer,
  Spinner
} from "native-base";
import CentralServerProvider from "../../../provider/CentralServerProvider";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import styles from "../styles";

const formValidationDef = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("general.required")
    }
  },
  firstName: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("general.required")
    }
  },
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
    },
    equality: {
      attribute: "ghost",
      message: "^" + I18n.t("authentication.passwordRule"),
      comparator: function(password, ghost) {
        // True if EULA is checked
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#@:;,<>\/''\$%\^&\*\.\?\-_\+\=\(\)])(?=.{8,})/.test(password);
      }
    }
  },
  repeatPassword: {
    presence: {
      allowEmpty: false,
      message: "^" + I18n.t("general.required")
    },
    equality: {
      attribute: "password",
      message: "^" + I18n.t("authentication.passwordNotMatch")
    }
  },
  eula: {
    equality: {
      attribute: "ghost",
      message: "^" + I18n.t("authentication.eulaNotAccepted"),
      comparator: function(eula, ghost) {
        // True if EULA is checked
        return eula;
      }
    }
  }
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      firstName: "",
      email: "",
      password: "",
      repeatPassword: "",
      eula: false,
      loading: false
    };
  }

  render() {
    const { eula, loading } = this.state;
    return (
      <Container>
        <ImageBackground source={require("../../../../assets/bg-signup.png")} style={styles.background}>
          <Content contentContainerStyle={styles.content}>
            <View style={styles.containerLogo}>
              <Image source={require("../../../../assets/sap.gif")} style={styles.logo} />
            </View>
            <View style={styles.container}>
              <Form style={styles.form}>
                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="person" style={styles.icon}/>
                  <Input
                    name="name"
                    type="text"
                    ref="name"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.name")}
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({name: text})}
                    secureTextEntry={false}
                  />
                </Item>
                {this.state.errorName && this.state.errorName.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }

                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="person" style={styles.icon}/>
                  <Input
                    name="firstName"
                    type="text"
                    ref="firstName"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.firstName")}
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({firstName: text})}
                    secureTextEntry={false}
                  />
                </Item>
                {this.state.errorFirstName && this.state.errorFirstName.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }

                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="mail" style={styles.icon} />
                  <Input
                    name="email"
                    type="email"
                    ref="email"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor="#FFF"
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
                    ref="password"
                    returnKeyType={"next"}
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
 
                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="unlock" style={styles.icon} />
                  <Input
                    name="repeatPassword"
                    type="password"
                    ref="repeatPassword"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.repeatPassword")}
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={"default"}
                    onChangeText={(text) => this.setState({repeatPassword: text})}
                    secureTextEntry={true}
                  />
                </Item>
                {this.state.errorRepeatPassword && this.state.errorRepeatPassword.map((errorMessage, index) => <Text style={styles.formErrorText} key={index}>{errorMessage}</Text>) }
 
                <ListItem style={styles.listItemEulaCheckbox}>
                  <CheckBox ref="eula" checked={eula} 
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
                    style={styles.button} onPress={this.signUp} 
                  >
                    <Text style={styles.buttonText}>
                      {I18n.t("authentication.signUp")}
                    </Text>
                  </Button>
                }
              </Form>
            </View>
          </Content>
          <Footer>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.helpButtons}>{I18n.t("authentication.haveAlreadyAccount")}</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }

  signUp = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    // Ok?
    if (formIsValid) {
      const { name, firstName, email, password, repeatPassword, eula } = this.state;
      try {
        // Loading
        this.setState({loading: true});
        // Register
        let result = await CentralServerProvider.register(
          name, firstName, email, { password, repeatPassword }, eula);
        // Reset
        this.setState({loading: false});
        // Show
        Message.showSuccess(I18n.t("authentication.registerSuccess"));
        // Back to login
        this.props.navigation.goBack();
        console.log(result);
      } catch (error) {
        // Reset
        this.setState({loading: false});
        console.log(error.request.status);
        // Other common Error
        Utils.handleHttpUnexpectedError(error.request);
      }
    }
  }
}

export default SignUp;
