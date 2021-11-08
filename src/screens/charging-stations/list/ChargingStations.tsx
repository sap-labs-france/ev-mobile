import I18n from 'i18n-js';
import { Container, Icon, Spinner, View } from 'native-base';
import React from 'react';
import { BackHandler, Image, ImageStyle, NativeEventSubscription, Platform, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ClusterMap } from 'react-native-cluster-map';
import { Location } from 'react-native-location';
import { Marker, Region } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Modalize } from 'react-native-modalize';

import ChargingStationComponent from '../../../components/charging-station/ChargingStationComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList, { ItemsSeparatorType } from '../../../components/list/ItemsList';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import ThemeManager from '../../../custom-theme/ThemeManager';
import I18nManager from '../../../I18n/I18nManager';
import LocationManager from '../../../location/LocationManager';
import computeModalStyle from '../../../ModalStyles';
import ProviderFactory from '../../../provider/ProviderFactory';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargePointStatus, Connector } from '../../../types/ChargingStation';
import { DataResult } from '../../../types/DataResult';
import { GlobalFilters } from '../../../types/Filter';
import SiteArea from '../../../types/SiteArea';
import Constants from '../../../utils/Constants';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import ChargingStationsFilters, { ChargingStationsFiltersDef } from './ChargingStationsFilters';
import computeStyleSheet from './ChargingStationsStyles';
import { FAB } from 'react-native-paper';
import standardLayout from '../../../../assets/map/standard.png';
import satelliteLayout from '../../../../assets/map/satellite.png';


export interface Props extends BaseProps {}

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
  visible?: boolean;
  satelliteMap?: boolean;
  chargingStationSelected?: ChargingStation;
}

export default class ChargingStations extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private siteArea: SiteArea;
  private currentLocation: Location;
  private locationEnabled: boolean;
  private currentRegion: Region;
  private parent: any;
  private darkMapTheme = require('../../../utils/map/google-maps-night-style.json');
  private backHandler: NativeEventSubscription;

  public constructor(props: Props) {
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
      showMap: true,
      visible: false,
      chargingStationSelected: null,
      satelliteMap: true
    };
  }

  public async componentDidMount() {
    // Get initial filters
    const { route, navigation } = this.props;
    await this.loadInitialFilters();
    this.siteArea = Utils.getParamFromNavigation(route, 'siteArea', null) as unknown as SiteArea;
    // Enable swipe for opening sidebar
    this.parent = navigation.getParent();
    this.parent.setOptions({
      swipeEnabled: !this.siteArea
    });
    // Bind the back button to the onBack method (Android)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack.bind(this));
    await super.componentDidMount();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    // Unbind the back button and reset its default behavior (Android)
    this.backHandler.remove();
    // Disable swipe for opening sidebar
    this.parent.setOptions({
      swipeEnabled: false
    });
  }

  public componentDidFocus(): void {
    // Bind the back button to the onBack method (Android)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack.bind(this));
    // Enable swipe for opening sidebar
    this.parent.setOptions({
      swipeEnabled: !this.siteArea
    });
  }

  public componentDidBlur(): void {
    // Unbind the back button and reset its default behavior (Android)
    this.backHandler.remove();
    // Disable swipe for opening sidebar
    this.parent.setOptions({
      swipeEnabled: false
    });
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async loadInitialFilters() {
    const centralServerProvider = await ProviderFactory.getProvider();
    const connectorStatus = (await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(),
      GlobalFilters.ONLY_AVAILABLE_CHARGING_STATIONS
    )) as ChargePointStatus;
    const connectorType = await SecuredStorage.loadFilterValue(centralServerProvider.getUserInfo(), GlobalFilters.CONNECTOR_TYPES);
    const location = Utils.convertToBoolean(
      await SecuredStorage.loadFilterValue(centralServerProvider.getUserInfo(), GlobalFilters.LOCATION)
    );
    this.setState({
      initialFilters: { connectorStatus, connectorType, location: location ?? true },
      filters: { connectorStatus, connectorType, location: location ?? true }
    });
  }

  public async getCurrentLocation(): Promise<Location> {
    const { filters } = this.state;
    // Get the current location
    let currentLocation = (await LocationManager.getInstance()).getLocation();
    this.locationEnabled = !!currentLocation;
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
      const params = {
        Search: searchText,
        SiteAreaID: this.siteArea?.id,
        Issuer: true,
        ConnectorStatus: filters.connectorStatus,
        ConnectorType: filters.connectorType,
        WithSiteArea: true,
        LocLatitude: this.currentLocation ? this.currentLocation.latitude : null,
        LocLongitude: this.currentLocation ? this.currentLocation.longitude : null,
        LocMaxDistanceMeters: this.currentLocation ? Constants.MAX_DISTANCE_METERS : null
      };
      // Get with the Site Area
      chargingStations = await this.centralServerProvider.getChargingStations(params, { skip, limit }, ['id']);
      // Get total number of records
      if (chargingStations.count === -1) {
        const chargingStationsNbrRecordsOnly = await this.centralServerProvider.getChargingStations(params, Constants.ONLY_RECORD_COUNT);
        chargingStations.count = chargingStationsNbrRecordsOnly.count;
      }
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'chargers.chargerUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
    return chargingStations;
  };

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next charging stations
      const chargingStations = await this.getChargingStations(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add charging stations
      this.setState((prevState) => ({
        chargingStations: chargingStations ? [...prevState.chargingStations, ...chargingStations.result] : prevState.chargingStations,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public onBack = (): boolean => {
    if (!this.state.showMap) {
      this.setState({ showMap: true });
      return true;
    }
    if (!!this.siteArea) {
      this.props.navigation.goBack();
      return true;
    }
    BackHandler.exitApp();
    return true;
  };

  public refreshCurrentRegion(chargingStations: ChargingStation[], force = false) {
    // Set current region
    if (!this.currentRegion || force) {
      let gpsCoordinates: number[];
      if (!Utils.isEmptyArray(chargingStations) && Utils.containsGPSCoordinates(chargingStations[0].coordinates)) {
        gpsCoordinates = chargingStations[0].coordinates;
      }
      this.currentRegion = {
        longitude: gpsCoordinates ? gpsCoordinates[0] : 2.3514616,
        latitude: gpsCoordinates ? gpsCoordinates[1] : 48.8566969,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      };
    }
  }

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const chargingStations = await this.getChargingStations(this.searchText, 0, skip + limit);
      // Refresh region
      if (chargingStations) {
        this.refreshCurrentRegion(chargingStations.result);
      }
      // Add ChargingStations
      this.setState(() => ({
        loading: false,
        refreshing: false,
        chargingStations: chargingStations ? chargingStations.result : [],
        count: chargingStations ? chargingStations.count : 0,
        isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false
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
    this.setState({ refreshing: true });
    this.searchText = searchText;
    delete this.currentRegion;
    await this.refresh();
  };

  public onMapRegionChange = (region: Region) => {
    this.currentRegion = region;
  };

  public filterChanged(newFilters: ChargingStationsFiltersDef) {
    delete this.currentRegion;
    this.setState({ filters: newFilters, refreshing: true }, async () => this.refresh());
  }

  public showMapChargingStationDetail = (chargingStation: ChargingStation) => {
    this.setState({
      visible: true,
      chargingStationSelected: chargingStation
    });
  };

  public setModalHeightByNumberOfConnector(connectors: Connector[]): number {
    if (connectors.length <= 4) {
      return 80 + 95 * connectors.length;
    }
    return 80 + 95 * 4;
  }

  public buildModal(isAdmin: boolean, navigation: any, chargingStationSelected: ChargingStation, modalStyle: any) {
    // ChargeX setup have more than 4 connectors.
    if (Platform.OS === 'ios') {
      return (
        <Modal style={modalStyle.modalBottomHalf} isVisible={this.state.visible} onBackdropPress={() => this.setState({ visible: false })}>
          <Modalize
            alwaysOpen={this.setModalHeightByNumberOfConnector(chargingStationSelected.connectors)}
            modalStyle={modalStyle.modalContainer}>
            <ChargingStationComponent
              chargingStation={chargingStationSelected}
              isAdmin={isAdmin}
              onNavigate={() => this.setState({ visible: false })}
              navigation={navigation}
              isSiteAdmin={this.securityProvider?.isSiteAdmin(
                chargingStationSelected.siteArea ? chargingStationSelected.siteArea.siteID : ''
              )}
            />
          </Modalize>
        </Modal>
      );
    } else {
      return (
        <Modal style={modalStyle.modalBottomHalf} isVisible={this.state.visible} onBackdropPress={() => this.setState({ visible: false })}>
          <View style={[modalStyle.modalContainer, { height: this.setModalHeightByNumberOfConnector(chargingStationSelected.connectors) }]}>
            <ScrollView>
              <ChargingStationComponent
                chargingStation={chargingStationSelected}
                isAdmin={isAdmin}
                onNavigate={() => this.setState({ visible: false })}
                navigation={navigation}
                isSiteAdmin={this.securityProvider?.isSiteAdmin(
                  chargingStationSelected.siteArea ? chargingStationSelected.siteArea.siteID : ''
                )}
              />
            </ScrollView>
          </View>
        </Modal>
      );
    }
  }

  public render() {
    const style = computeStyleSheet();
    const modalStyle = computeModalStyle();
    const { navigation } = this.props;
    const {
      loading,
      chargingStations,
      isAdmin,
      initialFilters,
      skip,
      count,
      limit,
      showMap,
      chargingStationSelected,
      refreshing,
      satelliteMap
    } = this.state;
    const mapIsDisplayed = showMap && !Utils.isEmptyArray(this.state.chargingStations);
    const chargingStationsWithGPSCoordinates = chargingStations.filter((chargingStation) =>
      Utils.containsGPSCoordinates(chargingStation.coordinates)
    );
    const isDarkModeEnabled = ThemeManager.getInstance()?.isThemeTypeIsDark();
    return (
      <Container style={style.container}>
        <View style={style.fabContainer}>
          {showMap && (
            <TouchableOpacity style={style.fab} onPress={() => this.setState({ satelliteMap: !satelliteMap })}>
              <Image
                source={satelliteMap ? standardLayout : satelliteLayout}
                style={style.imageStyle as ImageStyle}
              />
            </TouchableOpacity>
          )}
          <FAB
            icon={showMap ? 'format-list-bulleted' : 'map'}
            style={style.fab}
            onPress={() => this.setState({ showMap: !this.state.showMap })}
          />
        </View>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => this.setHeaderComponent(headerComponent)}
          navigation={navigation}
          title={this.siteArea?.name ?? I18n.t('chargers.title')}
          subTitle={count > 0 ? `(${I18nManager.formatNumber(count)})` : null}
          actions={[
            {
              onPress: () => navigation.navigate('QRCodeScanner'),
              renderIcon: () => <Icon type={'MaterialIcons'} name={'qr-code-scanner'} style={style.icon} />
            }
          ]}
          sideBar={!this.siteArea}
          backArrow={!!this.siteArea}
        />
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <View style={style.searchBar}>
              <SimpleSearchComponent onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
            </View>
            <ChargingStationsFilters
              initialFilters={initialFilters}
              locationEnabled={this.locationEnabled}
              onFilterChanged={(newFilters: ChargingStationsFiltersDef) => this.filterChanged(newFilters)}
              ref={(chargingStationsFilters: ChargingStationsFilters) => this.setScreenFilters(chargingStationsFilters)}
            />
            {mapIsDisplayed ? (
              <View style={style.map}>
                {this.currentRegion && (
                  <ClusterMap
                    customMapStyle={isDarkModeEnabled ? this.darkMapTheme : null}
                    style={style.map}
                    provider={null}
                    showsCompass={false}
                    showsUserLocation={true}
                    isClusterExpandClick={true}
                    renderClusterMarker={({ pointCount, clusterId }) => (
                      <View style={style.cluster}>
                        <Text style={style.text}>{pointCount}</Text>
                      </View>
                    )}
                    zoomControlEnabled={false}
                    toolbarEnabled={false}
                    mapType={satelliteMap ? 'satellite' : 'standard'}
                    region={this.currentRegion}
                    onRegionChange={this.onMapRegionChange}>
                    {chargingStationsWithGPSCoordinates.map((chargingStation) => (
                      <Marker
                        style={{height: 20, width: 20}}
                        image={Utils.buildChargingStationStatusMarker(chargingStation.connectors, chargingStation.inactive)}
                        key={chargingStation.id}
                        coordinate={{ longitude: chargingStation.coordinates[0], latitude: chargingStation.coordinates[1] }}
                        title={chargingStation.id}
                        onPress={() => this.showMapChargingStationDetail(chargingStation)}
                      />
                    ))}
                  </ClusterMap>
                )}
                {chargingStationSelected && this.buildModal(isAdmin, navigation, chargingStationSelected, modalStyle)}
              </View>
            ) : (
              <ItemsList<ChargingStation>
                skip={skip}
                count={count}
                onEndReached={this.onEndScroll}
                itemsSeparator={ItemsSeparatorType.DEFAULT}
                renderItem={(chargingStation: ChargingStation) => (
                  <ChargingStationComponent
                    chargingStation={chargingStation}
                    isAdmin={isAdmin}
                    navigation={navigation}
                    isSiteAdmin={this.securityProvider?.isSiteAdmin(chargingStation.siteArea ? chargingStation.siteArea.siteID : '')}
                  />
                )}
                data={chargingStations}
                manualRefresh={this.manualRefresh}
                refreshing={refreshing}
                emptyTitle={I18n.t('chargers.noChargers')}
                navigation={navigation}
                limit={limit}
              />
            )}
          </View>
        )}
      </Container>
    );
  }
}
