import { Button, Footer, Form, Icon, Item, Right, Spinner, Text } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, Text as TextRN, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions, StackActions } from 'react-navigation';
import BackgroundComponent from '../../../components/background/BackgroundComponent';
import I18n from '../../../I18n/I18n';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';

const logo = require('../../../../assets/logo-low.png');

const formValidationDef = {
  password: {
    presence: {
      allowEmpty: false,
      message: '^' + I18n.t('authentication.mandatoryPassword')
    },
    equality: {
      attribute: 'ghost',
      message: '^' + I18n.t('authentication.passwordRule'),
      comparator(password: string, ghost: string) {
        // True if EULA is checked
        return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#@:;,<>\/''\$%\^&\*\.\?\-_\+\=\(\)])(?=.{8,})/.test(password);
      }
    }
  },
  repeatPassword: {
    presence: {
      allowEmpty: false,
      message: '^' + I18n.t('authentication.mandatoryPassword')
    },
    equality: {
      attribute: 'password',
      message: '^' + I18n.t('authentication.passwordNotMatch')
    }
  }
};

export interface Props extends BaseProps {
}

interface State {
  tenant?: string;
  tenantName?: string;
  hash?: string;
  password?: string;
  repeatPassword?: string;
  errorPassword?: object[];
  errorRepeatPassword?: object[];
  loading?: boolean;
}

export default class ResetPassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private repeatPasswordInput: TextInput;

  constructor(props: Props) {
    super(props);
    this.state = {
      tenant: Utils.getParamFromNavigation(this.props.navigation, 'tenant', ''),
      hash:  Utils.getParamFromNavigation(this.props.navigation, 'hash', null),
      tenantName: '',
      password: '',
      repeatPassword: '',
      loading: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Init
    const tenant = this.centralServerProvider.getTenant(this.state.tenant);
    this.setState({
      tenantName: tenant ? tenant.name : ''
    });
  }

  public recaptchaResponseToken = (captcha: string) => {
    this.setState({ captcha });
  };

  public resetPassword = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    if (formIsValid) {
      const { tenant, password, repeatPassword, hash } = this.state;
      try {
        // Loading
        this.setState({ loading: true });
        // Register
        await this.centralServerProvider.resetPassword(tenant, hash, { password, repeatPassword });
        // Clear user's credentials
        await this.centralServerProvider.clearUserPassword();
        // Reset
        this.setState({ loading: false });
        // Show
        Message.showSuccess(I18n.t('authentication.resetPasswordSuccess'));
        // Navigate
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Login',
                params: {
                  tenant: this.state.tenant
                }
              })
            ]
          })
        );
      } catch (error) {
        // Reset
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Invalid Hash
            case 550:
              Message.showError(I18n.t('authentication.resetPasswordHashNotValid'));
              break;
            default:
              // Other common Error
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error.request);
          }
        } else {
          Message.showError(I18n.t('general.unexpectedError'));
        }
      }
    }
  };

  public onBack = (): boolean => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('Login');
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const { tenantName, loading } = this.state;
    return (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <BackgroundComponent navigation={this.props.navigation}>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.keyboardContainer} behavior='padding'>
              <AuthHeader navigation={this.props.navigation} tenantName={tenantName}/>
              <Form style={style.form}>
                <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                  <Icon active={true} name='unlock' style={style.inputIcon} />
                  <TextInput
                    selectionColor={commonColor.inverseTextColor}
                    onSubmitEditing={() => this.repeatPasswordInput.focus()}
                    returnKeyType={'next'}
                    placeholder={I18n.t('authentication.password')}
                    placeholderTextColor={commonColor.placeholderTextColor}
                    style={style.inputField}
                    autoCapitalize='none'
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={'default'}
                    onChangeText={(text) => this.setState({ password: text })}
                    secureTextEntry={true}
                  />
                </Item>
                {this.state.errorPassword &&
                  this.state.errorPassword.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                  <Icon active={true} name='unlock' style={style.inputIcon} />
                  <TextInput
                    ref={(ref) => (this.repeatPasswordInput = ref)}
                    selectionColor={commonColor.inverseTextColor}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    returnKeyType={'next'}
                    placeholder={I18n.t('authentication.repeatPassword')}
                    placeholderTextColor={commonColor.placeholderTextColor}
                    style={style.inputField}
                    autoCapitalize='none'
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={'default'}
                    onChangeText={(text) => this.setState({ repeatPassword: text })}
                    secureTextEntry={true}
                  />
                </Item>
                {this.state.errorRepeatPassword &&
                  this.state.errorRepeatPassword.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                {loading ? (
                  <Spinner style={style.spinner} color='white' />
                ) : (
                  <Button rounded={true} primary={true} block={true} style={style.button} onPress={() => this.resetPassword()}>
                    <TextRN style={style.buttonText}>{I18n.t('authentication.resetPassword')}</TextRN>
                  </Button>
                )}
                </Form>
            </KeyboardAvoidingView>
          </ScrollView>
          <Footer style={style.footer}>
            <Right>
              <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonRight]} onPress={() => this.props.navigation.goBack()}>
                <TextRN style={[style.linksTextButton, style.linksTextButtonRight]}>{I18n.t('authentication.backLogin')}</TextRN>
              </Button>
            </Right>
          </Footer>
        </BackgroundComponent>
      </Animatable.View>
    );
  }
}
