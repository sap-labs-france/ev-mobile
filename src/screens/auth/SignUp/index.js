// @flow
import React from "react";
import { Image, ImageBackground, Keyboard } from "react-native";
import ValidationComponent from 'react-native-form-validator';
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
  Left,
  Right,
  Footer
} from "native-base";
import CentralServerProvider from "../../../provider/CentralServerProvider";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Constants from "../../../utils/Constants";

import styles from "../styles";

const checkPassword = value => {
  if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#@:;,<>\/''\$%\^&\*\.\?\-_\+\=\(\)])(?=.{8,})/.test(value)) {
    // Check lower case
    if (!/(?=.*[a-z])/.test(value)) {
      return I18n.t("signUp.errors.lowerCase");
    }
    // Check upper case
    if (!/(?=.*[A-Z])/.test(value)) {
      return I18n.t("signUp.errors.upperCase");
    }
    // Check number
    if (!/(?=.*[0-9])/.test(value)) {
      return I18n.t("signUp.errors.number");
    }
    // Check special character
    if (!/(?=.*[!#@:;,<>\/''\$%\^&\*\.\?\-_\+\=\(\)])/.test(value)) {
      return I18n.t("signUp.errors.specialCharacter");
    }
    // Check length
    if (!/(?=.{8,})/.test(value)) {
      return I18n.t("signUp.errors.minimumLength");
    }
  } else {
    return undefined;
  }
};

class SignUp extends ValidationComponent {
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

  _handleInputChanges = (inputName, text) => {
    // if (inputName === "name") {
    //   this.setState({name: text.toUpperCase()});
    // } else if (inputName === "firstname") {
    //   this.setState({firstname: text.charAt(0).toUpperCase() + text.slice(1)});
    // } else if (inputName === "email") {
    //   this.setState({email: text});
    // } else if (inputName === "password") {
    //   this.setState(prevState => (
    //     {
    //       passwords: {
    //         ...prevState.passwords,
    //         password: text
    //       }
    //     }
    //   ));
    // } else if (inputName === "repeatPassword") {
    //   this.setState(prevState => (
    //     {
    //       passwords: {
    //         ...prevState.passwords,
    //         repeatPassword: text
    //       }
    //     }
    //   ));
    // }
  }

  _handleInputReferences = (inputName, ref) => {
    // if (inputName === "firstname") {
    //   this.forenameInput = ref;
    // } else if (inputName === "email") {
    //   this.emailInput = ref;
    // } else if (inputName === "password") {
    //   this.passwordInput = ref;
    // } else if (inputName === "repeatPassword") {
    //   this.repeatPasswordInput = ref;
    // }
    // this.textInput = ref;
  }

  _isPasswordsMatching = (value) => {
    // const { passwords } = this.state;
    // if (passwords.password && value) {
    //   if (passwords.password !== value) {
    //     return I18n.t("signUp.errors.passwordNotMatch");
    //   } else {
    //     return undefined;
    //   }
    // }
  }

  // renderInput = ({input, label, type, meta: {touched, error, warning}}) => {
  //   return (
  //     <View>
  //       <Item error={error && touched} rounded style={styles.inputGrp}>
  //         <Icon
  //           active
  //           name={
  //             input.name === "name"
  //               ? "person" : input.name === "firstname" ? "person"
  //               : input.name === "email" ? "mail" : "unlock"
  //           }
  //           style={{color: "#fff"}}
  //         />
  //         <Input
  //           ref={ref => this._handleInputReferences(input.name, ref)}
  //           onSubmitEditing={() => input.name === "name" ? this.forenameInput._root.focus() :
  //             input.name === "firstname" ? this.emailInput._root.focus() :
  //             input.name === "email" ? this.passwordInput._root.focus() :
  //             input.name === "password" ? this.repeatPasswordInput._root.focus() :
  //             Keyboard.dismiss()
  //           }
  //           returnKeyType={input.name === "repeatPassword" ? "go" : "next"}
  //           getRef={ref => (this.textInput = ref)}
  //           placeholderTextColor="#FFF"
  //           style={styles.input}
  //           autoCorrect={false}
  //           autoCapitalize={input.name === "email" || input.name === "password" || input.name === "repeatPassword" ? "none" : "sentences"}
  //           keyboardType={input.name === "email" ? "email-address" : "default"}
  //           blurOnSubmit={false}
  //           placeholder={
  //             input.name === "name"
  //               ? I18n.t("signUp.name")
  //               : input.name === "email" ? I18n.t("signUp.email") : input.name === "firstname" ? I18n.t("signUp.firstname") :
  //               input.name === "repeatPassword" ? I18n.t("signUp.repeatPassword") : I18n.t("signUp.password")
  //           }
  //           onChangeText={(text) => this._handleInputChanges(input.name, text)}
  //           secureTextEntry={input.name === "password" || input.name === "repeatPassword" ? true : false}
  //           {...input}
  //         />
  //         {touched && error
  //           ? <Icon
  //               active
  //               style={styles.formErrorIcon}
  //               onPress={() => this.textInput._root.clear()}
  //               name="close"
  //             />
  //           : <Text />}
  //       </Item>
  //       {touched && error
  //         ? <Text style={styles.formErrorText1}>
  //             {error}
  //           </Text>
  //         : <Text style={styles.formErrorText2}>> error here</Text>
  //       }
  //     </View>
  //   );
  // }

  // signUp = async () => {
  //   // TODO: Test and see back end side
  //   const { name, firstname, email, passwords, eula } = this.state;
  //   try {
  //     let result = await CentralServerProvider.register(name, firstname, email, passwords, eula);
  //     this.props.navigation.goBack();
  //     console.log(result);
  //   } catch (error) {
  //     console.log(error.request.status);
  //     // Other common Error
	// 			Utils.handleHttpUnexpectedError(error.request);
  //   }
  // }

  // verifyCallback = response => console.log(response);
  // expiredCallback = () => {};

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
                    placeholder={I18n.t("signUp.name")}
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({name: text})}
                    secureTextEntry={false}
                  />
                </Item>
                {this.isFieldInError('name') && this.getErrorsInField('name').map((errorMessage, index) => <Text style={styles.formErrorText} key={"name-" + index}>{errorMessage}</Text>) }

                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="person" style={styles.icon}/>
                  <Input
                    name="firstName"
                    type="text"
                    ref="firstName"
                    returnKeyType={"next"}
                    placeholder={I18n.t("signUp.firstName")}
                    placeholderTextColor="#FFF"
                    style={styles.input}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({firstName: text})}
                    secureTextEntry={false}
                  />
                </Item>
                {this.isFieldInError('firstName') && this.getErrorsInField('firstName').map((errorMessage, index) => <Text style={styles.formErrorText} key={"firstName-" + index}>{errorMessage}</Text>) }

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
                    placeholder={I18n.t("signUp.password")}
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

                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="unlock" style={styles.icon} />
                  <Input
                    name="repeatPassword"
                    type="password"
                    ref="repeatPassword"
                    returnKeyType={"next"}
                    placeholder={I18n.t("signUp.repeatPassword")}
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
                {this.isFieldInError('repeatPassword') && this.getErrorsInField('repeatPassword').map((errorMessage, index) => <Text style={styles.formErrorText} key={"repeatPassword-" + index}>{errorMessage}</Text>) }

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
                    style={styles.button} onPress={this.signUp} 
                  >
                    <Text style={styles.buttonText}>
                      {I18n.t("signUp.signUp")}
                    </Text>
                  </Button>
                }
              </Form>
            </View>
          </Content>
          {/* <Content padder>
            <Text style={styles.signupHeader}>{I18n.t("signUp.registerToChargeAngels")}</Text>
            <View style={styles.signupContainer}>
              <Field
                name="name"
                component={this.renderInput}
                type="text"
                validate={[required, alpha]}
              />
              <Field
                name="firstname"
                component={this.renderInput}
                type="text"
                validate={[required, alpha]}
              />

              <Field
                name="email"
                component={this.renderInput}
                type="email"
                validate={[checkEmail, required]}
              />
              <Field
                name="password"
                component={this.renderInput}
                type="password"
                validate={[required, checkPassword]}
              />
              <Field
                name="repeatPassword"
                component={this.renderInput}
                type="repeatPassword"
                validate={[required, this._isPasswordsMatching]}
              />
              <Button
                rounded
                block
                onPress={() => this.signUp()}
                style={styles.signupBtn}
                disabled={!this.props.valid}
              >
                <Text style={{color: "#FFF"}}>{I18n.t("signUp.create")}</Text>
              </Button>
            </View>
          </Content>
          <Footer
            style={{
              paddingLeft: 20,
              paddingRight: 20
            }}
          >
            <Button
              small
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.helpBtns}>{I18n.t("signUp.haveAlreadyAccount")}</Text>
            </Button>
          </Footer> */}
        </ImageBackground>
      </Container>
    );
  }

  signUp = () => {

  }
}

export default SignUp;
