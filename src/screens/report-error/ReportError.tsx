import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Button, Form, Icon, Item, Spinner } from 'native-base';
import React from 'react';
import { Keyboard, ScrollView, Text, TextInput, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import ChargingStation, { Connector } from 'types/ChargingStation';

import HeaderComponent from './../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import Constants from '../../utils/Constants';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './ReportErrorStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  chargingStation?: ChargingStation;
  mobile?: string;
  subject?: string;
  description?: string;
  connector?: Connector;
  visible?: boolean;
  errorMobile?: Record<string, unknown>[];
  errorSubject?: Record<string, unknown>[];
  errorDescription?: Record<string, unknown>[];
}

export default class ReportError extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private descriptionInput: TextInput;
  private subjectInput: TextInput;
  private formValidation = {
    mobile: {
      format: {
        pattern: '^[+]?([0-9] ?){9,14}[0-9]$',
        message: '^' + I18n.t('authentication.invalidMobile')
      }
    },
    subject: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryErrorSubject')
      }
    },
    description: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryErrorDescription')
      }
    }
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      mobile: null,
      subject: null,
      description: null,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  public async componentDidMount() {
    await super.componentDidMount();
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
    const connectorID = Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as string;
    const userMobile = this.centralServerProvider.getUserInfo().mobile;
    let chargingStation = null;
    let connector = null;
    let connectorLetter = null;
    // Get Charging Station
    if (chargingStationID) {
      chargingStation = await this.getChargingStation(chargingStationID);
      if (chargingStation) {
        connector = chargingStation ? chargingStation.connectors[Utils.convertToInt(connectorID) - 1] : null;
        connectorLetter = Utils.getConnectorLetterFromConnectorID(connector ? connector.connectorId : null);
        this.setState({ subject: chargingStationID + ' - ' + connectorLetter });
      }
    }
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    this.setState({
      loading: false,
      chargingStation,
      connector,
      mobile: userMobile,
      isAdmin: securityProvider ? securityProvider.isAdmin() : false,
      isSiteAdmin: securityProvider && chargingStation && chargingStation.siteArea ? securityProvider.isSiteAdmin(chargingStation.siteArea.siteID) : false,
    });
  }

  public getChargingStation = async (chargingStationID: string): Promise<ChargingStation> => {
    try {
      // Get chargingStation
      const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationID);
      return chargingStation;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargingStations.chargingStationUnexpectedError', this.props.navigation);
    }
    return null;
  };

  public sendErrorReport = async () => {
    // Check field
    const formIsValid = Utils.validateInput(this, this.formValidation);

    if (formIsValid) {
      this.centralServerProvider.getUserInfo().mobile = this.state.mobile;
      const { mobile, subject, description } = this.state;
      try {
        this.setState({ loading: true } as State);
        // Submit
        await this.centralServerProvider.sendErrorReport(mobile, subject, description);
        // Ok
        Message.showSuccess(I18n.t('authentication.reportErrorSuccess'));
        // Init
        this.clearInput();
        // Get to the previous screen
        this.onBack();
      } catch (error) {
        // submit failed
        this.setState({ loading: false });
        // Check request?
        if (error.request) {
          // Other common Error
          Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
            'authentication.reportErrorFailed');
        } else {
          Message.showError(I18n.t('authentication.reportErrorFailed'));
        }
      }
    }
  };

  public clearInput = () => {
    this.setState({
      loading: false,
      mobile: '',
      subject: '',
      description: '',
      errorDescription: [],
      errorSubject: [],
      errorMobile: []
    });
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public changeMobileText(text: string) {
    if (!text) {
      this.setState({ mobile: null });
    } else {
      this.setState({ mobile: text });
    }
  }

  public render() {
    const { navigation } = this.props;
    const commonColor = Utils.getCurrentCommonColor();
    const style = computeStyleSheet();
    const { loading } = this.state;
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
        <Animatable.View style={style.container} animation={'fadeIn'} iterationCount={1} duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
          <HeaderComponent
            navigation={this.props.navigation}
            title={I18n.t('sidebar.reportError')}
            leftAction={() => this.onBack()}
            leftActionIcon={'navigate-before'}
            rightAction={() => {
              navigation.dispatch(DrawerActions.openDrawer()); return true;
            }}
            rightActionIcon={'menu'}
          />
          <ScrollView style={style.container}>
            <View style={style.iconContainer}>
              <Icon style={style.reportErrorIcon} type='MaterialIcons' name='error-outline' />
            </View>
            <Form style={style.formContainer}>
              <Item style={style.input} regular>
                <TextInput
                  style={style.inputText}
                  placeholder={I18n.t('general.mobile')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  selectionColor={commonColor.textColor}
                  onChangeText={(text) => this.changeMobileText(text)}
                  onSubmitEditing={!this.state.subject ? () => this.subjectInput.focus() : () => this.descriptionInput.focus()}
                  autoFocus={!this.state.mobile ? true : false}
                  autoCapitalize='none'
                  blurOnSubmit={false}
                  autoCorrect={false}
                  value={this.state.mobile}
                />
              </Item>
              {this.state.errorMobile &&
                  this.state.errorMobile.map((errorMessage, index) => (
                    <Text style={style.errorMobileText} key={index}>
                      {errorMessage}
                    </Text>
                  ))
              }
              <Item style={style.input} regular>
                <TextInput
                  ref={(ref: TextInput) => (this.subjectInput = ref)}
                  style={style.inputText}
                  placeholder={I18n.t('general.errorTitle')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
                  selectionColor={commonColor.textColor}
                  onChangeText={(text) => this.setState({ subject: text })}
                  onSubmitEditing={() => this.descriptionInput.focus()}
                  autoFocus={this.state.mobile && !this.state.subject ? true : false}
                  autoCorrect={false}
                  blurOnSubmit={false}
                  autoCapitalize='none'
                  value={this.state.subject}
                />
              </Item>
              {this.state.errorSubject &&
                  this.state.errorSubject.map((errorMessage, index) => (
                    <Text style={style.errorSubjectText} key={index}>
                      {errorMessage}
                    </Text>
                  ))
              }
              <Item style={style.descriptionInput} regular>
                <ScrollView>
                  <TextInput
                    ref={(ref: TextInput) => (this.descriptionInput = ref)}
                    style={style.descriptionText}
                    placeholder={I18n.t('general.errorDescription')}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    placeholderTextColor={commonColor.inputColorPlaceholder}
                    selectionColor={commonColor.textColor}
                    onChangeText={(text) => this.setState({ description: text })}
                    autoFocus={this.state.mobile && this.state.subject ? true : false}
                    multiline
                    autoCorrect={false}
                    blurOnSubmit={false}
                    autoCapitalize='none'
                  />
                </ScrollView>
              </Item>
              {this.state.errorDescription &&
                  this.state.errorDescription.map((errorMessage, index) => (
                    <Text style={style.errorDescriptionText} key={index}>
                      {errorMessage}
                    </Text>
                  ))
              }
              <View style={style.buttonContainer}>
                <Button style={style.sendButton} block onPress={async () => this.sendErrorReport()} danger>
                  <Text style={style.sendTextButton}>{I18n.t('general.send')}</Text>
                </Button>
              </View>
            </Form>
          </ScrollView>
        </Animatable.View>
      )
    );
  }
}
