import React from "react";
import { Image, ImageBackground } from "react-native";
import ValidationComponent from 'react-native-form-validator';
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
  Spinner
} from "native-base";
import CentralServerProvider from "../../../provider/CentralServerProvider";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import styles from "../styles";

class Login extends ValidationComponent {
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
    return(
      <Container>
        <ImageBackground source={require("../../../../assets/bg.png")} style={styles.background}>
         <Content contentContainerStyle={styles.content}>
            <View style={styles.container}>
              <Image source={require("../../../../assets/sap.gif")} style={styles.logo} />
            </View>
            <View style={styles.container}>
              <Form style={styles.form}>
                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="mail" style={styles.icon} />
                  <Input
                    name="email"
                    type="email"
                    ref="email"
                    returnKeyType={"next"}
                    placeholder={I18n.t("login.email")}
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
                {this.isFieldInError('email') && this.getErrorsInField('email').map((errorMessage, index) => <Text style={styles.formErrorText} key={"email-" + index}>{errorMessage}</Text>) }

                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="unlock" style={styles.icon} />
                  <Input
                    name="password"
                    type="password"
                    ref="password"
                    returnKeyType={"next"}
                    placeholder={I18n.t("login.password")}
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
                {this.isFieldInError('password') && this.getErrorsInField('password').map((errorMessage, index) => <Text style={styles.formErrorText} key={"password-" + index}>{errorMessage}</Text>) }

                <ListItem style={styles.listItemEulaCheckbox}>
                  <CheckBox ref="eula" checked={eula} 
                    onPress={() => this.setState({eula: !eula})} />
                  <Body>
                    <Text style={styles.eulaText}>{I18n.t("login.acceptEula")}
                      <Text onPress={()=>this.props.navigation.navigate("Eula")} style={styles.eulaLink}>{I18n.t("login.eula")}</Text>
                    </Text>
                  </Body>
     			      </ListItem>
                {loading ?
                  <Spinner style={styles.spinner} color="white" />
                  :
                  <Button rounded primary block large
                    style={styles.button} onPress={this.login} 
                  >
                    <Text style={styles.buttonText}>
                      {I18n.t("login.login")}
                    </Text>
                  </Button>
                }
                <View style={styles.linksContainer}>
                   <Left>
                     <Button small transparent style={styles.linksButtonLeft}
                       onPress={() => navigation.navigate("SignUp")}
                     >
                       <Text style={styles.helpButton}>{I18n.t("login.newUser")}</Text>
                     </Button>
                   </Left>
                   <Right>
                     <Button small transparent style={styles.linksButtonRight}
                       onPress={() => navigation.navigate("RetrievePassword")}
                     >
                       <Text style={styles.helpButton}>{I18n.t("login.forgotYourPassword")}</Text>
                     </Button>
                   </Right>
                 </View>
              </Form>
            </View>
          </Content>
        </ImageBackground>
      </Container>
    );
  }

  login = async () => {
    // Check Form
    this.validate({
      email: { email: true, required: true },
      password: { required: true }
    });
    // Refresh view
    this.forceUpdate();
    // Check EULA
    if (this.isFormValid() && !this.state.eula) {
      // Show error
      Message.showError(I18n.t("login.eulaNotAccepted"));
      return;
    }
    // Ok?
    if (this.isFormValid()) {
      // Login
      const { password, email, eula } = this.state;
      try {
        this.setState({loading: true});
        // Login
        await CentralServerProvider.login(email, password, eula);
        // Login Success
        this.setState({loading: false});
        // Show
        Message.showSuccess(I18n.t("login.loginSuccess"));
        // Navigate to sites
        // return this.props.navigation.dispatch(
        //   NavigationActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: "Walkthrough" })]
        //   })
        // );

      } catch (error) {
        // Login failed
        this.setState({loading: false});
        // Show error
        switch (error.request.status) {
          // Unknown Email
          case 500:
          case 550:
            Message.showError(I18n.t("login.wrongEmailOrPassword"));
            break;
          // Account is locked
          case 570:
            Message.showError(I18n.t("login.accountLocked"));
            break;
            // Account not Active
          case 580:
            Message.showError(I18n.t("login.accountNotActive"));
            break;
          // Account Pending
          case 590:
            Message.showError(I18n.t("login.accountPending"));
            break;
          // Eula no accepted
          case 520:
            Message.showError(I18n.t("login.eulaNotAccepted"));
            break;
          default:
            // Other common Error
            Utils.handleHttpUnexpectedError(error.request);
        }
      }
    }
  }
}

export default Login;
