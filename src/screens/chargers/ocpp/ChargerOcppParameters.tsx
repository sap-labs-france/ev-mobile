import I18n from 'i18n-js';
import { Button, Container, Icon, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, FlatList, RefreshControl, ScrollView } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { DataResult } from 'types/DataResult';
import { KeyValue } from 'types/Global';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation from '../../../types/ChargingStation';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargerOcppParametersStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  refreshing?: boolean;
  charger: ChargingStation;
  chargerConfigurationKeyValues?: KeyValue[];
}

export default class ChargerOcppParameters extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      charger: null,
      loading: true,
      refreshing: false,
      chargerConfigurationKeyValues: null
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    await this.refresh();
  }

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      let chargerConfigurationKeyValues: KeyValue[] = [];
      // Get Charger
      let charger = this.state.charger;
      if (!charger) {
        const chargerID = Utils.getParamFromNavigation(this.props.navigation, 'chargerID', null);
        charger = await this.getCharger(chargerID);
      }
      // Get Charger Config
      const chargerConfiguration = await this.getChargerOcppParameters(charger.id);
      // Sort
      if (chargerConfiguration && chargerConfiguration.count > 0) {
        chargerConfiguration.result.sort(Utils.sortArrayOfKeyValue);
        chargerConfigurationKeyValues = chargerConfiguration.result;
      }
      // Set
      this.setState({
        loading: false,
        charger,
        chargerConfigurationKeyValues
      });
    }
  };

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

  public getChargerOcppParameters = async (chargerID: string): Promise<DataResult<KeyValue>> => {
    try {
      // Get Charger
      const chargerConfiguration = await this.centralServerProvider.getChargerOcppParameters(chargerID);
      return chargerConfiguration;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerConfigurationUnexpectedError', this.props.navigation);
    }
    return null;
  };

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack(null);
    // Do not bubble up
    return true;
  };

  public requestChargerOcppParametersConfirm() {
    const { charger } = this.state;
    Alert.alert
      (I18n.t('chargers.requestConfiguration', { chargeBoxID: charger.id }),
      I18n.t('chargers.requestConfigurationMessage', { chargeBoxID: charger.id }), [
      { text: I18n.t('general.yes'), onPress: () => this.requestChargerOcppParameters(charger.id) },
      { text: I18n.t('general.cancel') }
    ]);
  }

  public async requestChargerOcppParameters(chargeBoxID: string) {
    try {
      // Unlock Connector
      const status = await this.centralServerProvider.requestChargerOcppParameters(chargeBoxID);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
        await this.refresh();
      } else {
        Message.showError(I18n.t('details.denied'));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerConfigurationUnexpectedError', this.props.navigation);
    }
  }

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, charger, chargerConfigurationKeyValues } = this.state;
    return (
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
        <Button disabled={charger ? charger.inactive : true} block={true} iconLeft={true} style={style.actionButton} onPress={() => this.requestChargerOcppParametersConfirm()}>
          <Icon style={style.actionButtonIcon} type='MaterialIcons' name='get-app' />
          <Text uppercase={false} style={style.actionButtonText}>
            {I18n.t('chargers.requestConfiguration')}
          </Text>
        </Button>
        {loading ? (
          <Spinner style={style.spinner} />
        ) : (
          <FlatList
            data={chargerConfigurationKeyValues}
            renderItem={({ item, index }) => (
              <View style={index % 2 ? [style.descriptionContainer, style.rowBackground] : style.descriptionContainer}>
                <Text style={style.label}>{item.key}</Text>
                <ScrollView horizontal={true} alwaysBounceHorizontal={false} contentContainerStyle={style.scrollViewValue}>
                  <Text style={style.value}>{item.value}</Text>
                </ScrollView>
              </View>
            )}
            keyExtractor={(item) => `${item.key}`}
            refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
            ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('chargers.noOCPPParameters')} />}
          />
        )}
      </Container>
    );
  }
}
