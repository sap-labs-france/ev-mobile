import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import { Location } from 'react-native-location';
import MapView, { Marker } from 'react-native-maps';
import { DrawerActions } from 'react-navigation-drawer';
import ChargingStationComponent from '../../../components/charging-station/ChargingStationComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import I18nManager from '../../../I18n/I18nManager';
import LocationManager from '../../../location/LocationManager';
import ProviderFactory from '../../../provider/ProviderFactory';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargePointStatus } from '../../../types/ChargingStation';
import { DataResult } from '../../../types/DataResult';
import { GlobalFilters } from '../../../types/Filter';
import Constants from '../../../utils/Constants';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import ChargingStationsFilters, { ChargingStationsFiltersDef } from './ChargingStationsFilters';
import computeStyleSheet from './ChargingStationsStyles';

export interface Props extends BaseProps {
}

interface State {
  chargingStations?: ChargingStation[];
  loading?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  initialFilters?: ChargingStationsFiltersDef;
  filters?: ChargingStationsFiltersDef;
  showMap?: boolean;
}

export default class ChargingStations extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private siteAreaID: string;
  private currentLocation: Location;
  private locationEnabled: boolean;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      chargingStations: [],
      loading: true,
      refreshing: false,
      isAdmin: false,
      initialFilters: {},
      filters: {},
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      showMap: false,
    };
  }

  public async componentDidMount() {
    // Get initial filters
    await this.loadInitialFilters();
    this.siteAreaID = Utils.getParamFromNavigation(this.props.navigation, 'siteAreaID', null);
    await super.componentDidMount();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async loadInitialFilters() {
    const centralServerProvider = await ProviderFactory.getProvider();
    const connectorStatus = await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(), GlobalFilters.ONLY_AVAILABLE_CHARGING_STATIONS) as ChargePointStatus;
    const connectorType = await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(), GlobalFilters.CONNECTOR_TYPES) as string;
    let location = Utils.convertToBoolean(await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(), GlobalFilters.LOCATION));
    if (!location) {
      location = false;
    }
    this.setState({
      initialFilters: { connectorStatus, connectorType, location },
      filters: { connectorStatus, connectorType, location }
    });
  }

  public async getCurrentLocation(): Promise<Location> {
    const { filters } = this.state;
    // Get the current location
    let currentLocation = (await LocationManager.getInstance()).getLocation();
    this.locationEnabled = currentLocation ? true : false;
    // Bypass location
    if (!filters.location) {
      currentLocation = null;
    }
    return currentLocation;
  }

  public getChargingStations = async (searchText: string, skip: number, limit: number): Promise<DataResult<ChargingStation>> => {
    let chargingStations: DataResult<ChargingStation>;
    const { filters } = this.state;
    try {
      // Get current location
      this.currentLocation = await this.getCurrentLocation();
      // Get with the Site Area
      chargingStations = await this.centralServerProvider.getChargingStations({
        Search: searchText,
        SiteAreaID: this.siteAreaID,
        Issuer: true,
        ConnectorStatus: filters.connectorStatus,
        ConnectorType: filters.connectorType,
        LocLatitude: this.currentLocation ? this.currentLocation.latitude : null,
        LocLongitude: this.currentLocation ? this.currentLocation.longitude : null,
        LocMaxDistanceMeters: this.currentLocation ? Constants.MAX_DISTANCE_METERS : null
      }, { skip, limit });
      // Check
      if (chargingStations.count === -1) {
        // Request nbr of records
        const chargingStationsNbrRecordsOnly = await this.centralServerProvider.getChargingStations({
          Search: searchText,
          SiteAreaID: this.siteAreaID,
          Issuer: true,
          ConnectorStatus: this.state.filters.connectorStatus
        }, Constants.ONLY_RECORD_COUNT_PAGING);
        // Set
        chargingStations.count = chargingStationsNbrRecordsOnly.count;
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerUnexpectedError', this.props.navigation, this.refresh);
    }
    return chargingStations;
  };

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const chargingStations = await this.getChargingStations(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        chargingStations: chargingStations ? [...prevState.chargingStations, ...chargingStations.result] : prevState.chargingStations,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public onBack = (): boolean => {
    if (this.siteAreaID) {
      // Go Back
      this.props.navigation.goBack();
    } else {
      // Go back to the top
      this.props.navigation.goBack(null);
    }
    // Do not bubble up
    return true;
  };

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const chargingStations = await this.getChargingStations(this.searchText, 0, skip + limit);
      // Get the provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Add ChargingStations
      this.setState(() => ({
        loading: false,
        chargingStations: chargingStations ? chargingStations.result : [],
        count: chargingStations ? chargingStations.count : 0,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      }));
    }
  };

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public getSiteIDFromChargingStations(): string {
    const { chargingStations } = this.state;
    // Find the first available Site ID
    if (chargingStations && chargingStations.length > 0) {
      for (const chargingStation of chargingStations) {
        if (chargingStation.siteArea) {
          return chargingStation.siteArea.siteID;
        }
      }
    }
    return null;
  }

  public search = async (searchText: string) => {
    this.searchText = searchText;
    await this.refresh();
  }

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, chargingStations, isAdmin, initialFilters,
      skip, count, limit, filters, showMap } = this.state;
    const mapIsDisplayed = showMap && this.locationEnabled && !Utils.isEmptyArray(this.state.chargingStations)
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) =>
            this.setHeaderComponent(headerComponent)}
          navigation={navigation}
          title={I18n.t('chargers.title')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('chargers.chargers')}` : null}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
          filters={filters}
          diplayMap={true}
          mapIsDisplayed={mapIsDisplayed}
          diplayMapAction={() => this.setState({ showMap: !showMap })}
        />
        <View style={style.content}>
          {loading ? (
            <Spinner style={style.spinner} />
          ) : (
            mapIsDisplayed ?
            <View style={style.content}>
              <MapView
                style={style.map}
                initialRegion={{
                  longitude: Utils.containsGPSCoordinates(this.state.chargingStations[0].coordinates) ?
                    this.state.chargingStations[0].coordinates[0] : 2.3514616,
                  latitude: Utils.containsGPSCoordinates(this.state.chargingStations[0].coordinates) ?
                    this.state.chargingStations[0].coordinates[1] : 48.8566969,
                  latitudeDelta: 0.009,
                  longitudeDelta: 0.009,
                }}
              >
                {this.state.chargingStations.map((chargingStation) => (
                  <Marker
                    key={chargingStation.id}
                    coordinate={{ longitude: chargingStation.coordinates[0], latitude: chargingStation.coordinates[1] }}
                    title={chargingStation.id}
                    description={chargingStation.id}
                  />
                ))}
              </MapView>
            </View>
          :
            <View style={style.content}>
              <SimpleSearchComponent
                onChange={(searchText) => this.search(searchText)}
                navigation={navigation}
              />
              <ChargingStationsFilters
                initialFilters={initialFilters} locationEnabled={this.locationEnabled}
                onFilterChanged={(newFilters: ChargingStationsFiltersDef) => this.setState({ filters: newFilters }, () => this.refresh())}
                ref={(chargingStationsFilters: ChargingStationsFilters) =>
                  this.setScreenFilters(chargingStationsFilters)}
              />
              <FlatList
                data={chargingStations}
                renderItem={({ item }) =>
                  <ChargingStationComponent chargingStation={item} isAdmin={isAdmin} navigation={navigation}
                    isSiteAdmin={this.centralServerProvider.getSecurityProvider().isSiteAdmin(item.siteArea ? item.siteArea.siteID : '')} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this.onEndScroll}
                onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
                ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
                ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('chargers.noChargers')} />}
              />
            </View>
          )}
        </View>
      </Container>
    );
  }
}
