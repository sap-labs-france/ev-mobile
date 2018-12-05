import React from "react";
import { Image, ImageBackground, Linking, KeyboardAvoidingView } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { Container, Content, Text, Form, Item, Input, Button, Icon, View, Spinner, Footer } from "native-base";
import commonColor from "../../../theme/variables/commonColor";
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
  }
};

class RetrievePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false
    };
  }

  resetPassword = async () => {
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

  render() {
    const { loading } = this.state;
    return (
      <Container>
        <ImageBackground source={require("../../../../assets/bg-signup.png")} style={styles.background}>
          <Content contentContainerStyle={styles.content}>
            <View style={styles.container}>
              <Image source={require("../../../../assets/logo-low.gif")} style={styles.logo} />
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding">
              <Form style={styles.form}>
                <Item inlineLabel rounded style={styles.inputGroup}>
                  <Icon active name="mail" style={styles.icon} />
                  <Input
                    name="email"
                    type="email"
                    returnKeyType={"next"}
                    placeholder={I18n.t("authentication.email")}
                    placeholderTextColor={commonColor.textColor}
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

                { loading ?
                  <Spinner style={styles.spinner} color="white" />
                :
                  <Button rounded primary block large style={styles.button} onPress={this.resetPassword}>
                    <Text style={styles.buttonText}>
                      {I18n.t("authentication.retrievePassword")}
                    </Text>
                  </Button>
                }
              </Form>
            </KeyboardAvoidingView>
          </Content>
          <Footer>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.helpBtns}>{I18n.t("authentication.backLogin")}</Text>
            </Button>
          </Footer>
        </ImageBackground>
      </Container>
    );
  }
}

export default RetrievePassword;
