import I18n from 'i18n-js';
import { Button, Footer, Form, Icon, Item, Left, Spinner, Text } from 'native-base';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, Text as TextRN, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions, StackActions } from 'react-navigation';

import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';

export interface Props extends BaseProps {
}

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  hash?: string;
  password?: string;
  repeatPassword?: string;
  errorPassword?: object[];
  errorRepeatPassword?: object[];
  loading?: boolean;
  hideRepeatPassword?: boolean;
  hidePassword?: boolean;
}

export default class ResetPassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private repeatPasswordInput: TextInput;
  private formValidationDef = {
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

  constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.navigation, 'tenantSubDomain', ''),
      hash:  Utils.getParamFromNavigation(this.props.navigation, 'hash', null),
      tenantName: '',
      password: '',
      repeatPassword: '',
      loading: false,
      hidePassword: true,
      hideRepeatPassword: true,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Init
    const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
    this.setState({
      tenantName: tenant ? tenant.name : ''
    });
    // Disable Auto Login
    this.centralServerProvider.setAutoLoginDisabled(true);
  }

  public recaptchaResponseToken = (captcha: string) => {
    this.setState({ captcha });
  };

  public resetPassword = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, this.formValidationDef);
    if (formIsValid) {
      const { tenantSubDomain, password, repeatPassword, hash } = this.state;
      try {
        // Loading
        this.setState({ loading: true });
        // Register
        await this.centralServerProvider.resetPassword(tenantSubDomain, hash, { password, repeatPassword });
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
                  tenantSubDomain: this.state.tenantSubDomain
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
              Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
                'authentication.resetPasswordUnexpectedError');
          }
        } else {
          Message.showError(I18n.t('authentication.resetPasswordUnexpectedError'));
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
    const { tenantName, loading, hidePassword, hideRepeatPassword } = this.state;
    return (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
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
                  secureTextEntry={hidePassword}
                />
                <Icon active={true} name={hidePassword ? 'eye' : 'eye-off'}
                  onPress={() => this.setState({ hidePassword: !hidePassword })}
                  style={[style.inputIcon, style.inputIconLock]} />
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
                  ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
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
                  secureTextEntry={hideRepeatPassword}
                />
                <Icon active={true} name={hideRepeatPassword ? 'eye' : 'eye-off'}
                  onPress={() => this.setState({ hideRepeatPassword: !hideRepeatPassword })}
                  style={[style.inputIcon, style.inputIconLock]} />
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
          <Left>
            <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.props.navigation.goBack()}>
              <TextRN style={[style.linksTextButton, style.linksTextButtonLeft]}>{I18n.t('authentication.backLogin')}</TextRN>
            </Button>
          </Left>
        </Footer>
      </Animatable.View>
    );
  }
}
