// @flow
import React from "react";
import { Image, ImageBackground } from "react-native";
import ValidationComponent from 'react-native-form-validator';
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
  Spinner,
  Footer
} from "native-base";
import CentralServerProvider from "../../../provider/CentralServerProvider";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import Message from "../../../utils/Message";
import styles from "../styles";

class RetrievePassword extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false
    };
  }

  render() {
    const { loading } = this.state;
    return (
      <Container>
        <ImageBackground source={require("../../../../assets/bg-signup.png")} style={styles.background}>
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

                {loading ?
                  <Spinner style={styles.spinner} color="white" />
                  :
                  <Button rounded primary block large
                    style={styles.button} onPress={this.resetPassword} 
                  >
                    <Text style={styles.buttonText}>
                      {I18n.t("login.retrievePassword")}
                    </Text>
                  </Button>
                }
              </Form>
            </View>
          </Content>
          <Footer>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.helpButtons}>{I18n.t("login.backLogin")}</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }

  resetPassword = async () => {
    // Check Form
    this.validate({
      email: { email: true, required: true }
    });
    // Refresh view
    this.forceUpdate();
    // Ok?
    if (this.isFormValid()) {
      // Login
      const { email } = this.state;
      try {
        this.setState({loading: true});
        // Login
        await CentralServerProvider.resetPassword(email);
        // Login Success
        this.setState({loading: false});
        // Show
        Message.showSuccess(I18n.t("login.resetSuccess"));
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
        // Show error
        switch (error.request.status) {
          // Unknown Email
          case 500:
          case 550:
            Message.showError(I18n.t("login.wrongEmailOrPassword"));
            break;
          default:
            // Other common Error
            Utils.handleHttpUnexpectedError(error.request);
        }
      }
    }
  }
}

export default RetrievePassword;
