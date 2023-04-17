import I18n from 'i18n-js';
import { Button, HStack, Icon, Spinner } from 'native-base';
import React from 'react';
import { Alert, FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import BaseProps from '../../../types/BaseProps';
import ChargingStation from '../../../types/ChargingStation';
import { DataResult } from '../../../types/DataResult';
import { KeyValue } from '../../../types/Global';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargingStationOcppParametersStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  refreshing?: boolean;
  chargingStation: ChargingStation;
  chargingStationConfigurationKeyValues?: KeyValue[];
}

export default class ChargingStationOcppParameters extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      chargingStation: null,
      loading: true,
      refreshing: false,
      chargingStationConfigurationKeyValues: null
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    await this.refresh();
  }

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      let chargingStationConfigurationKeyValues: KeyValue[] = [];
      // Get Charging Station
      let chargingStation = this.state.chargingStation;
      if (!chargingStation) {
        const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
        chargingStation = await this.getChargingStation(chargingStationID);
      }
      // Get Charging Station Config
      const chargingStationConfiguration = await this.getChargingStationOcppParameters(chargingStation.id.toString());
      // Sort
      if (chargingStationConfiguration && chargingStationConfiguration.count > 0) {
        chargingStationConfiguration.result.sort(Utils.sortArrayOfKeyValue.bind(this));
        chargingStationConfigurationKeyValues = chargingStationConfiguration.result;
      }
      // Set
      this.setState({
        loading: false,
        chargingStation,
        chargingStationConfigurationKeyValues
      });
    }
  };

  public getChargingStation = async (chargingStationID: string): Promise<ChargingStation> => {
    try {
      // Get chargingStation
      const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationID);
      return chargingStation;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'chargers.chargerUnexpectedError', this.props.navigation);
    }
    return null;
  };

  public getChargingStationOcppParameters = async (chargingStationID: string): Promise<DataResult<KeyValue>> => {
    try {
      // Get chargingStation
      const chargingStationConfiguration = await this.centralServerProvider.getChargingStationOcppParameters(chargingStationID);
      return chargingStationConfiguration;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'chargers.chargerConfigurationUnexpectedError',
        this.props.navigation
      );
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

  public requestChargingStationOcppParametersConfirm() {
    const { chargingStation } = this.state;
    Alert.alert(
      I18n.t('chargers.requestConfiguration', { chargeBoxID: chargingStation.id }),
      I18n.t('chargers.requestConfigurationMessage', { chargeBoxID: chargingStation.id }),
      [
        { text: I18n.t('general.yes'), onPress: async () => this.requestChargingStationOcppParameters(chargingStation.id) },
        { text: I18n.t('general.cancel') }
      ]
    );
  }

  public async requestChargingStationOcppParameters(chargeBoxID: string) {
    try {
      // Unlock Connector
      const status = await this.centralServerProvider.requestChargingStationOcppParameters(chargeBoxID);
      // Check
      if (status.status && status.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
        await this.refresh();
      } else {
        Message.showError(I18n.t('details.denied'));
      }
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'chargers.chargerConfigurationUnexpectedError',
        this.props.navigation
      );
    }
  }

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, chargingStation, chargingStationConfigurationKeyValues } = this.state;
    return (
      <View style={style.container}>
        <HeaderComponent
          navigation={this.props.navigation}
          title={chargingStation ? chargingStation.id : I18n.t('connector.unknown')}
          subTitle={chargingStation && chargingStation.inactive ? `(${I18n.t('details.inactive')})` : null}
          containerStyle={style.headerContainer}
        />
        <Button
          disabled={chargingStation ? chargingStation.inactive : true}
          style={style.actionButton}
          onPress={() => this.requestChargingStationOcppParametersConfirm()}>
          <HStack alignItems={'center'}>
            <Icon size={scale(20)}  style={style.actionButtonIcon} as={MaterialIcons} name="get-app" />
            <Text style={style.actionButtonText}>
              {I18n.t('chargers.requestConfiguration')}
            </Text>
          </HStack>
        </Button>
        {loading ? (
          <Spinner size={scale(30)} style={style.spinner} color="grey" />
        ) : (
          <FlatList
            data={chargingStationConfigurationKeyValues}
            renderItem={({ item, index }) => (
              <View style={index % 2 ? [style.descriptionContainer, style.rowBackground] : style.descriptionContainer}>
                <Text style={style.label}>{item.key}</Text>
                <ScrollView horizontal alwaysBounceHorizontal={false} contentContainerStyle={style.scrollViewValue}>
                  <Text style={style.value}>{item.value}</Text>
                </ScrollView>
              </View>
            )}
            keyExtractor={(item) => `${item.key}`}
            refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
            ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('chargers.noOCPPParameters')} />}
          />
        )}
      </View>
    );
  }
}
