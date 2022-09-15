import I18n from 'i18n-js';
import { Spinner } from 'native-base';
import React from 'react';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargingStationCapabilities } from '../../../types/ChargingStation';
import { KeyValue, PropertyDisplay } from '../../../types/Global';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeStyleSheet from './ChargingStationPropertiesStyles';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  refreshing?: boolean;
  chargingStation: ChargingStation;
}

export default class ChargingStationProperties extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private displayedProperties: PropertyDisplay[] = [
    { key: 'chargePointVendor', title: 'details.vendor' },
    { key: 'chargePointModel', title: 'details.model' },
    { key: 'chargeBoxSerialNumber', title: 'details.serialNumber' },
    { key: 'firmwareVersion', title: 'details.firmwareVersion' },
    { key: 'endpoint', title: 'details.privateURL' },
    { key: 'chargingStationURL', title: 'details.publicURL' },
    { key: 'currentIPAddress', title: 'details.currentIP' },
    { key: 'ocppVersion', title: 'details.ocppVersion' },
    {
      key: 'lastReboot',
      title: 'details.lastReboot',
      formatter: (lastReboot: Date): string => I18nManager.formatDateTime(lastReboot)
    },
    {
      key: 'createdOn',
      title: 'general.createdOn',
      formatter: (createdOn: Date): string => I18nManager.formatDateTime(createdOn)
    },
    {
      key: 'capabilities',
      title: 'details.capabilities',
      formatterWithComponents: true,
      formatter: (capabilities: ChargingStationCapabilities): Element[] => {
        const formatterValues: Element[] = [];
        if (capabilities) {
          const style = computeStyleSheet();
          for (const key in capabilities) {
            if (capabilities.hasOwnProperty(key)) {
              formatterValues.push(<Text style={style.values}>{`${key}: ${capabilities[key]}`}</Text>);
            }
          }
        }
        return formatterValues;
      }
    },
    {
      key: 'ocppStandardParameters',
      title: 'details.ocppStandardParams',
      formatterWithComponents: true,
      formatter: (ocppStandardParameters: KeyValue[]): Element[] => {
        const formatterValues: Element[] = [];
        if (ocppStandardParameters) {
          const style = computeStyleSheet();
          for (const ocppStandardParameter of ocppStandardParameters) {
            formatterValues.push(<Text style={style.values}>{`${ocppStandardParameter.key}: ${ocppStandardParameter.value}`}</Text>);
          }
        }
        return formatterValues;
      }
    },
    {
      key: 'ocppVendorParameters',
      title: 'details.ocppVendorParams',
      formatterWithComponents: true,
      formatter: (ocppVendorParameters: KeyValue[]): Element[] => {
        const formatterValues: Element[] = [];
        if (ocppVendorParameters) {
          const style = computeStyleSheet();
          for (const ocppVendorParameter of ocppVendorParameters) {
            formatterValues.push(<Text style={style.values}>{`${ocppVendorParameter.key}: ${ocppVendorParameter.value}`}</Text>);
          }
        }
        return formatterValues;
      }
    }
  ];

  public constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      chargingStation: null
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
      const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
      // Get chargingStation
      const chargingStation = await this.getChargingStation(chargingStationID);
      // Build props
      const chargingStationProperties = this.buildChargerProperties(chargingStation);
      // Set
      this.setState({
        loading: false,
        chargingStation,
        chargingStationProperties
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

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public render() {
    const { navigation } = this.props;
    const style = computeStyleSheet();
    const { loading, chargingStation } = this.state;
    return (
      <View style={style.container}>
        <HeaderComponent
          navigation={this.props.navigation}
          title={chargingStation ? chargingStation.id : I18n.t('connector.unknown')}
          subTitle={chargingStation && chargingStation.inactive ? `(${I18n.t('details.inactive')})` : null}
          containerStyle={style.headerContainer}
        />
        {loading ? (
          <Spinner size={scale(30)} style={style.spinner} color="grey" />
        ) : (
          <FlatList
            data={this.displayedProperties}
            renderItem={({ item, index }) => (
              <View style={index % 2 ? [style.descriptionContainer, style.rowBackground] : style.descriptionContainer}>
                <Text style={style.label}>{I18n.t(item.title)}</Text>
                {item.formatter && item.value !== '-' ? (
                  item.formatterWithComponents ? (
                    <ScrollView horizontal alwaysBounceHorizontal={false} contentContainerStyle={style.scrollViewValues}>
                      {item.formatter(item.value)}
                    </ScrollView>
                  ) : (
                    <ScrollView horizontal alwaysBounceHorizontal={false} contentContainerStyle={style.scrollViewValue}>
                      <Text style={style.value}>{item.formatter(item.value)}</Text>
                    </ScrollView>
                  )
                ) : (
                  <ScrollView horizontal alwaysBounceHorizontal={false} contentContainerStyle={style.scrollViewValue}>
                    <Text style={style.value}>{item.value}</Text>
                  </ScrollView>
                )}
              </View>
            )}
            keyExtractor={(item) => `${item.key}`}
            refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
            ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('chargers.noChargerParameters')} />}
          />
        )}
      </View>
    );
  }

  private buildChargerProperties(chargingStation: ChargingStation) {
    if (chargingStation) {
      for (const displayedProperty of this.displayedProperties) {
        displayedProperty.value = chargingStation && chargingStation[displayedProperty.key] ? chargingStation[displayedProperty.key] : '-';
      }
    }
  }
}
