import I18n from 'i18n-js';
import { Button, Container, Icon, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, ScrollView } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';

import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargePointStatus } from '../../../types/ChargingStation';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargerActionsStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  charger: ChargingStation;
  spinnerResetHard?: boolean;
  spinnerResetSoft?: boolean;
  spinnerClearCache?: boolean;
  spinnerConnectors: Map< number, boolean>;
  connectorsInactive?: boolean;
}

export default class ChargerActions extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      charger: null,
      spinnerResetHard: false,
      spinnerResetSoft: false,
      spinnerClearCache: false,
      spinnerConnectors: new Map(),
      connectorsInactive: false
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

    const spinnerConnectors = new Map();
    charger.connectors.map((connector)=>{
      spinnerConnectors.set(connector.connectorId, false);
    });


    // Set
    this.setState({
      loading: false,
      charger,
      spinnerResetHard: false,
      spinnerResetSoft: false,
      spinnerClearCache: false,
      spinnerConnectors,
      connectorsInactive: false
    });
  }

  public getCharger = async (chargerID: string): Promise<ChargingStation> => {
    try {
      // Get Charger
      const charger = await this.centralServerProvider.getCharger({ ID: chargerID });
      return charger;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerUnexpectedError', this.props.navigation);
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
      if (type === 'Hard') {
        this.setState ({ spinnerResetHard:true });
      } else {
        this.setState ({ spinnerResetSoft:true });
      }
      // Start the Transaction
      const status = await this.centralServerProvider.reset(chargeBoxID, type);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
      } else {
        Message.showError(I18n.t('details.denied'));
      }
      this.setState({
        spinnerResetHard:false,
        spinnerResetSoft:false
       })
    } catch (error) {
      this.setState({
        spinnerResetHard:false,
        spinnerResetSoft:false
      })
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        type === 'Hard' ? 'chargers.chargerRebootUnexpectedError' : 'chargers.chargerResetUnexpectedError',
        this.props.navigation);
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
      this.setState({ spinnerClearCache:true })
      // Clear Cache
      const status = await this.centralServerProvider.clearCache(chargeBoxID);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
      } else {
        Message.showError(I18n.t('details.denied'));
      }
      this.setState({ spinnerClearCache:false })
    } catch (error) {
      this.setState({ spinnerClearCache:false })
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerClearCacheUnexpectedError', this.props.navigation);
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
    const spinnerConnectors = this.state.spinnerConnectors;
    try {
      spinnerConnectors.set(connectorID, true);
      this.setState({
        spinnerConnectors,
        connectorsInactive: true
      })
      // Unlock Connector
      const status = await this.centralServerProvider.unlockConnector(chargeBoxID, connectorID);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
      } else {
        Message.showError(I18n.t('details.denied'));
      }
      spinnerConnectors.set(connectorID, false);
      this.setState({
        spinnerConnectors,
        connectorsInactive: false
      })
    } catch (error) {
      spinnerConnectors.set(connectorID, false);
      this.setState({
        spinnerConnectors,
        connectorsInactive: false
      })
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerUnlockUnexpectedError', this.props.navigation);
    }
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };


  // tslint:disable-next-line: cyclomatic-complexity
  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, charger, spinnerResetHard, spinnerResetSoft, spinnerConnectors , spinnerClearCache, connectorsInactive } = this.state;
    const chargingStationIsDisabled = charger ?
      charger.inactive || spinnerResetHard || spinnerResetSoft || spinnerClearCache || connectorsInactive : false;
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
            rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
            rightActionIcon={'menu'}
          />
          <ScrollView contentContainerStyle={style.scrollViewContainer}>
            <View style={style.viewContainer}>
              <View style={style.actionContainer}>
                <Button disabled={chargingStationIsDisabled} block={true} danger={!chargingStationIsDisabled} iconLeft={true} style={style.actionButton}
                    onPress={() => this.resetHardConfirm()}>
                    {spinnerResetHard ? <Spinner  color= 'white'/> : <Icon style={style.actionButtonIcon} type='MaterialIcons' name='repeat'/> }
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t('chargers.resetHard')}
                  </Text>
                </Button>
              </View>
              { charger && charger.connectors.map((connector) =>
                <View key={connector.connectorId} style={style.actionContainer}>
                  <Button
                      disabled={chargingStationIsDisabled || connector.status === ChargePointStatus.AVAILABLE}
                      block={true} iconLeft={true} warning={!chargingStationIsDisabled && connector.status !== ChargePointStatus.AVAILABLE} style={style.actionButton}
                      onPress={() => this.unlockConnectorConfirm(connector.connectorId)}>
                      {spinnerConnectors.get(connector.connectorId) ? ( <Spinner color= 'white' /> ) : ( <Icon style={style.actionButtonIcon} type='MaterialIcons' name='lock-open'/> ) }
                    <Text uppercase={false} style={style.actionButtonText}>
                      {I18n.t('chargers.unlockConnector', { connectorId: Utils.getConnectorLetterFromConnectorID(connector.connectorId) } )}
                    </Text>
                  </Button>
                </View>
              )}
              <View style={style.actionContainer}>
                <Button disabled={chargingStationIsDisabled} block={true} iconLeft={true} warning={!chargingStationIsDisabled} style={style.actionButton}
                    onPress={() => this.resetSoftConfirm()}>
                    {spinnerResetSoft ? <Spinner  color= 'white' /> : <Icon style={style.actionButtonIcon} type='MaterialIcons' name='layers-clear'/> }
                  <Text uppercase={false} style={style.actionButtonText}>
                    {I18n.t('chargers.resetSoft')}
                  </Text>
                </Button>
              </View>
              <View style={style.actionContainer}>
                <Button disabled={chargingStationIsDisabled} block={true} iconLeft={true} warning={!chargingStationIsDisabled} style={style.actionButton}
                    onPress={() => this.clearCacheConfirm()}>
                    {spinnerClearCache ? <Spinner  color= 'white' /> : <Icon style={style.actionButtonIcon} type='MaterialIcons' name='refresh'/> }
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
