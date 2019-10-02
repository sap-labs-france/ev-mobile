import { Button, Footer, Form, Icon, Item, Left, Spinner, Text } from 'native-base';
import React from 'react';
import { KeyboardAvoidingView, ScrollView, Text as TextRN, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { NavigationActions, StackActions } from 'react-navigation';
import BackgroundComponent from '../../../components/background/BackgroundComponent';
import I18n from '../../../I18n/I18n';
import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';

const formValidationDef = {
  email: {
    presence: {
      allowEmpty: false,
      message: '^' + I18n.t('authentication.mandatoryEmail')
    },
    email: {
      message: '^' + I18n.t('authentication.invalidEmail')
    }
  }
};

export interface Props extends BaseProps {
}

interface State {
  tenant?: string;
  tenantName?: string;
  email?: string;
  captchaSiteKey?: string;
  captchaBaseUrl?: string;
  captcha?: string;
  loading?: boolean;
  errorEmail?: object[];
}

export default class RetrievePassword extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      tenant: Utils.getParamFromNavigation(this.props.navigation, 'tenant', ''),
      tenantName: '',
      email: Utils.getParamFromNavigation(this.props.navigation, 'email', ''),
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
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
      tenantName: tenant.name,
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
  }

  public recaptchaResponseToken = (captcha: string) => {
    this.setState({ captcha });
  };

  public retrievePassword = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, formValidationDef);
    if (formIsValid) {
      const { tenant, email, captcha } = this.state;
      try {
        this.setState({ loading: true });
        // Login
        await this.centralServerProvider.retrievePassword(tenant, email, captcha);
        // Login Success
        this.setState({ loading: false });
        // Show
        Message.showSuccess(I18n.t('authentication.resetSuccess'));
        // Navigate
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: 'Login',
                params: {
                  tenant: this.state.tenant,
                  email: this.state.email
                }
              })
            ]
          })
        );
      } catch (error) {
        // Login failed
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Invalid Captcha
            case 530:
              Message.showError(I18n.t('authentication.invalidCaptcha'));
              break;
            // Unknown Email
            case 550:
              Message.showError(I18n.t('authentication.wrongEmail'));
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

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('Login');
    // Do not bubble up
    return true;
  };

  public render() {
    const style = computeStyleSheet();
    const { loading, captcha, tenantName, captchaSiteKey, captchaBaseUrl } = this.state;
    return (
      <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <BackgroundComponent navigation={this.props.navigation}>
          <ScrollView contentContainerStyle={style.scrollContainer}>
            <KeyboardAvoidingView style={style.keyboardContainer} behavior='padding'>
              <AuthHeader navigation={this.props.navigation} tenantName={tenantName}/>
              <Form style={style.form}>
                <Item inlineLabel={true} rounded={true} style={style.inputGroup}>
                  <Icon active={true} name='mail' style={style.inputIcon} />
                  <TextInput
                    returnKeyType={'next'}
                    selectionColor={commonColor.inverseTextColor}
                    placeholder={I18n.t('authentication.email')}
                    placeholderTextColor={commonColor.placeholderTextColor}
                    style={style.inputField}
                    autoCapitalize='none'
                    blurOnSubmit={false}
                    autoCorrect={false}
                    keyboardType={'email-address'}
                    onChangeText={(text) => this.setState({ email: text })}
                    value={this.state.email}
                  />
                </Item>
                {this.state.errorEmail &&
                  this.state.errorEmail.map((errorMessage, index) => (
                    <Text style={style.formErrorText} key={index}>
                      {errorMessage}
                    </Text>
                  ))}
                {loading || !captcha ? (
                  <Spinner style={style.spinner} color='white' />
                ) : (
                  <Button rounded={true} primary={true} block={true} style={style.button} onPress={() => this.retrievePassword()}>
                    <TextRN style={style.buttonText}>{I18n.t('authentication.retrievePassword')}</TextRN>
                  </Button>
                )}
              </Form>
            </KeyboardAvoidingView>
            {captchaSiteKey && captchaBaseUrl && (
              <ReactNativeRecaptchaV3
                action='ResetPassword'
                onHandleToken={this.recaptchaResponseToken}
                url={captchaBaseUrl}
                siteKey={captchaSiteKey}
              />
            )}
          </ScrollView>
          <Footer style={style.footer}>
            <Left>
              <Button small={true} transparent={true} style={[style.linksButton, style.linksButtonLeft]} onPress={() => this.props.navigation.goBack()}>
                <TextRN style={[style.linksTextButton, style.linksTextButtonLeft]}>{I18n.t('authentication.backLogin')}</TextRN>
              </Button>
            </Left>
          </Footer>
        </BackgroundComponent>
      </Animatable.View>
    );
  }
}
