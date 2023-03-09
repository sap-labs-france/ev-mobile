import I18n from 'i18n-js';
import { Spinner } from 'native-base';
import React from 'react';
import {Keyboard, Text, TextInput, TouchableOpacity, View} from 'react-native';
import ChargingStation, { Connector } from '../../types/ChargingStation';

import HeaderComponent from './../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './ReportErrorStyles';
import computeFormStyleSheet from '../../FormStyles';
import { scale } from 'react-native-size-matters';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Input} from 'react-native-elements';

export interface Props extends BaseProps {}

interface State {
  reportingError?: boolean;
  loading?: boolean;
  chargingStation?: ChargingStation;
  phoneNumber?: string;
  title?: string;
  description?: string;
  connector?: Connector;
  visible?: boolean;
  descriptionInputHeight?: number;
}

export default class ReportError extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private phoneInput: TextInput;
  private descriptionInput: TextInput;
  private subjectInput: TextInput;

  public constructor(props: Props) {
    super(props);
    this.state = {
      reportingError: false,
      phoneNumber: null,
      title: Utils.getParamFromNavigation(this.props.route, 'title', null) as string,
      description: null,
      loading: true
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount() {
    await super.componentDidMount();
    const userMobile = this.centralServerProvider.getUserInfo().mobile;
    this.setState({
      phoneNumber: userMobile,
      loading: false
    });
  }


  public sendErrorReport = async () => {
    // Check field
    const formIsValid = this.isFormValid();
    if (formIsValid) {
      this.centralServerProvider.getUserInfo().mobile = this.state.phoneNumber;
      const { phoneNumber, title, description } = this.state;
      this.setState({ reportingError: true } as State);
      try {
        // Submit
        await this.centralServerProvider.sendErrorReport(phoneNumber, title, description);
        // Ok
        Message.showSuccess(I18n.t('authentication.reportErrorSuccess'));
      } catch (error) {
        // Check request?
        if (error.request) {
          // Other common Error
          await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.reportErrorFailed');
        } else {
          Message.showError(I18n.t('authentication.reportErrorFailed'));
        }
      }
    }
    this.setState({reportingError: false});
  };

  public render() {
    const commonColor = Utils.getCurrentCommonColor();
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const { reportingError, phoneNumber, title, description, descriptionInputHeight, loading } = this.state;
    return loading ? (
      <Spinner style={formStyle.spinner} color="grey" />
    ) : (
      <SafeAreaView edges={['bottom']} style={style.container}>
        <HeaderComponent
          sideBar={this.canOpenDrawer}
          navigation={this.props.navigation}
          title={I18n.t('sidebar.reportError')}
          containerStyle={style.headerContainer}
        />
        <KeyboardAwareScrollView bounces={false} persistentScrollbar={true} contentContainerStyle={style.scrollViewContentContainer} style={style.scrollView}>
          <View style={style.clearButton}>
            <TouchableOpacity onPress={() => this.clearForm()}>
              <Text style={style.clearButtonText}>{I18n.t('general.clear')}</Text>
            </TouchableOpacity>
          </View>
          <Input
            ref={(ref: TextInput) => (this.phoneInput = ref)}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, !this.checkPhoneNumber() && formStyle.inputTextContainerError]}
            value={phoneNumber}
            placeholder={`${I18n.t('authentication.phone')}*`}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCorrect={false}
            autoComplete={'tel'}
            textContentType={'telephoneNumber'}
            keyboardType={'phone-pad'}
            returnKeyType={'next'}
            onSubmitEditing={() => this.subjectInput.focus()}
            renderErrorMessage={!this.checkPhoneNumber()}
            errorMessage={!this.checkPhoneNumber() ? I18n.t('authentication.invalidMobile') : null}
            errorStyle={formStyle.inputError}
            onChangeText={(newPhoneNumber) => this.setState({phoneNumber: newPhoneNumber})}
          />
          <Input
            ref={(ref: TextInput) => (this.subjectInput = ref)}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={formStyle.inputTextContainer}
            value={title}
            placeholder={`${I18n.t('general.errorTitle')}*`}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize={'words'}
            autoCorrect={false}
            keyboardType={'default'}
            returnKeyType={'next'}
            onSubmitEditing={() => this.descriptionInput.focus()}
            renderErrorMessage={false}
            onChangeText={(newTitle) => this.setState({title: newTitle})}
          />
          <Input
            ref={(ref: TextInput) => (this.descriptionInput = ref)}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, formStyle.inputTextMultilineContainer, description && {height: Math.max(descriptionInputHeight ?? 0, scale(90))}]}
            value={description}
            multiline={true}
            placeholder={`${I18n.t('general.errorDescription')}*`}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize={'words'}
            autoCorrect={false}
            keyboardType={'default'}
            returnKeyType={'done'}
            onSubmitEditing={() => Keyboard.dismiss()}
            renderErrorMessage={false}
            onChangeText={(newDescription) => this.setState({description: newDescription})}
            onContentSizeChange={(event) => this.setState({descriptionInputHeight: event?.nativeEvent?.contentSize?.height})}
          />
          <Button
            title={I18n.t('general.send')}
            titleStyle={formStyle.buttonTitle}
            disabled={!this.isFormValid()}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.disabledButton}
            containerStyle={formStyle.buttonContainer}
            buttonStyle={formStyle.button}
            loading={reportingError}
            loadingProps={{color: commonColor.light}}
            onPress={() => void this.sendErrorReport()}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  private checkPhoneNumber(): boolean {
    const { phoneNumber } = this.state;
    return !phoneNumber || /^[+]?([0-9] ?){9,14}[0-9]$/.test(phoneNumber);
  }

  private isFormValid(): boolean {
    const { phoneNumber, title, description } = this.state;
    return !!phoneNumber && !!title && !!description && this.checkPhoneNumber();
  }

  private clearForm(): void {
    this.phoneInput?.clear();
    this.subjectInput?.clear();
    this.descriptionInput?.clear();
  }
}
