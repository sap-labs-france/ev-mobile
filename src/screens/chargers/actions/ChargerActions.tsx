import I18n from 'i18n-js';
import { Button, Container, Icon, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, ScrollView } from 'react-native';
import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation from '../../../types/ChargingStation';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargerActionsStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  charger: ChargingStation;
}

export default class ChargerActions extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      charger: null,
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    const chargerID = Utils.getParamFromNavigation(this.props.navigation, 'chargerID', null);
    // Get Charger
    const charger = await this.getCharger(chargerID);
    // Set
    this.setState({
      loading: false,
      charger,
    });
  }

  public getCharger = async (chargerID: string): Promise<ChargingStation> => {
    try {
      // Get Charger
      const charger = await this.centralServerProvider.getCharger({ ID: chargerID });
      return charger;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
    return null;
  };

  public resetHardConfirm() {
    const { charger } = this.state;
    Alert.alert(I18n.t('chargers.resetHard'), I18n.t('chargers.resetHardMessage', { chargeBoxID: charger.id }), [
      { text: I18n.t('general.yes'), onPress: () => this.reset(charger.id, 'Hard') },
      { text: I18n.t('general.cancel') }
    ]);
  }

  public resetSoftConfirm() {
    const { charger } = this.state;
    Alert.alert(I18n.t('chargers.resetSoft'), I18n.t('chargers.resetSoftMessage', { chargeBoxID: charger.id }), [
      { text: I18n.t('general.yes'), onPress: () => this.reset(charger.id, 'Soft') },
      { text: I18n.t('general.cancel') }
    ]);
  }

  public async reset(chargeBoxID: string, type: 'Soft'|'Hard') {
    try {
      // Start the Transaction
      const status = await this.centralServerProvider.reset(chargeBoxID, type);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
      } else {
        Message.showError(I18n.t('details.denied'));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
  }

  public clearCacheConfirm() {
    const { charger } = this.state;
    Alert.alert(I18n.t('chargers.clearCache'), I18n.t('chargers.clearCacheMessage', { chargeBoxID: charger.id }), [
      { text: I18n.t('general.yes'), onPress: () => this.clearCache(charger.id) },
      { text: I18n.t('general.cancel') }
    ]);
  }

  public async clearCache(chargeBoxID: string) {
    try {
      // Clear Cache
      const status = await this.centralServerProvider.clearCache(chargeBoxID);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
      } else {
        Message.showError(I18n.t('details.denied'));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
  }

  public unlockConnectorConfirm(connectorId: number) {
    const { charger } = this.state;
    Alert.alert
      (I18n.t('chargers.unlockConnector', { connectorId: Utils.getConnectorLetterFromConnectorID(connectorId) }),
      I18n.t('chargers.unlockConnectorMessage',
        { chargeBoxID: charger.id, connectorId: Utils.getConnectorLetterFromConnectorID(connectorId) }), [
      { text: I18n.t('general.yes'), onPress: () => this.unlockConnector(charger.id, connectorId) },
      { text: I18n.t('general.cancel') }
    ]);
  }

  public async unlockConnector(chargeBoxID: string, connectorID: number) {
    try {
      // Unlock Connector
      const status = await this.centralServerProvider.unlockConnector(chargeBoxID, connectorID);
      // Check
      console.log('====================================');
      console.log(status);
      console.log('====================================');
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
      } else {
        Message.showError(I18n.t('details.denied'));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation);
    }
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, charger } = this.state;
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
        <Container style={style.container}>
          <HeaderComponent
            navigation={this.props.navigation}
            title={charger ? charger.id : I18n.t('connector.unknown')}
            subTitle={charger && charger.inactive ? `(${I18n.t('details.inactive')})` : null}
            leftAction={() => this.onBack()}
            leftActionIcon={'navigate-before'}
            rightAction={navigation.openDrawer}
            rightActionIcon={'menu'}
          />
          <ScrollView contentContainerStyle={style.scrollViewContainer}>
            <View style={style.viewContainer}>
              <View style={style.actionContainer}>
                <Button disabled={charger.inactive} rounded={true} danger={!charger.inactive} iconLeft={true} style={style.actionButton} onPress={() => this.resetHardConfirm()}>
                  <Icon style={style.actionButtonIcon} type='MaterialIcons' name='repeat' />
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t('chargers.resetHard')}
                  </Text>
                </Button>
              </View>
              { charger && charger.connectors.map((connector) =>
                <View key={connector.connectorId} style={style.actionContainer}>
                  <Button disabled={charger.inactive} rounded={true} iconLeft={true} warning={!charger.inactive} style={style.actionButton}
                      onPress={() => this.unlockConnectorConfirm(connector.connectorId)}>
                    <Icon style={style.actionButtonIcon} type='MaterialIcons' name='lock-open' />
                    <Text uppercase={false} style={style.actionButtonText}>
                      {I18n.t('chargers.unlockConnector', { connectorId: Utils.getConnectorLetterFromConnectorID(connector.connectorId) } )}
                    </Text>
                  </Button>
                </View>
              )}
              <View style={style.actionContainer}>
                <Button disabled={charger.inactive} rounded={true} iconLeft={true} warning={!charger.inactive} style={style.actionButton} onPress={() => this.resetSoftConfirm()}>
                  <Icon style={style.actionButtonIcon} type='MaterialIcons' name='layers-clear' />
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t('chargers.resetSoft')}
                  </Text>
                </Button>
              </View>
              <View style={style.actionContainer}>
                <Button disabled={charger.inactive} rounded={true} iconLeft={true} warning={!charger.inactive} style={style.actionButton} onPress={() => this.clearCacheConfirm()}>
                  <Icon style={style.actionButtonIcon} type='MaterialIcons' name='refresh' />
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t('chargers.clearCache')}
                  </Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </Container>
      )
    );
  }
}
