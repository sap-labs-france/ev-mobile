import I18n from 'i18n-js';
import { Container, Icon, Spinner, View } from 'native-base';
import React from 'react';
import {
  BackHandler, Image, ImageStyle,
  NativeEventSubscription,
  Platform,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { Marker, Region } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Modalize } from 'react-native-modalize';
import computeConnectorStatusStyles from '../../../components/connector-status/ConnectorStatusComponentStyles';

import ChargingStationComponent from '../../../components/charging-station/ChargingStationComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList, { ItemsSeparatorType } from '../../../components/list/ItemsList';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import I18nManager from '../../../I18n/I18nManager';
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
import statusMarkerFaulted from '../../../../assets/icon/charging_station_faulted.png';
import ClusterMap from '../../../components/map/ClusterMap';
import computeFabStyles from '../../../components/fab/FabComponentStyles';
import ThemeManager from '../../../custom-theme/ThemeManager';
import standardDarkLayout from '../../../../assets/map/standard-dark.png';
import standardLightLayout from '../../../../assets/map/standard-light.png';
import satelliteLayout from '../../../../assets/map/satellite.png';



export interface Props extends BaseProps {}

interface State {
  chargingStations?: ChargingStation[];
  loading?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  skip?: number;
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
  private currentRegion: Region;
  private parent: any;
  private backHandler: NativeEventSubscription;
  private mapLimit = 500;
  private listLimit = 25;

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
      count: 0,
      showMap: true,
      visible: false,
      chargingStationSelected: null,
      satelliteMap: false
    };
  }

  public async componentDidMount() {
    // Get initial filters
    await super.componentDidMount();
    const { navigation } = this.props;
    await this.loadInitialFilters();
    // Enable swipe for opening sidebar
    this.parent = navigation.getParent();
    this.parent?.setOptions({
      swipeEnabled: !this.siteArea
    });
    // Bind the back button to the onBack method (Android)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack.bind(this));
    this.refresh(true);
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    // Unbind the back button and reset its default behavior (Android)
    this.backHandler.remove();
    // Disable swipe for opening sidebar
    this.parent?.setOptions({
      swipeEnabled: false
    });
  }

  public componentDidFocus(): void {
    // Bind the back button to the onBack method (Android)
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.onBack.bind(this));
    this.siteArea = Utils.getParamFromNavigation(this.props.route, 'siteArea', null) as unknown as SiteArea;
    this.refresh(true);
    // Enable swipe for opening sidebar
    this.parent?.setOptions({
      swipeEnabled: !this.siteArea
    });
  }

  public componentDidBlur(): void {
    delete this.siteArea;
    // Unbind the back button and reset its default behavior (Android)
    this.backHandler.remove();
    // Disable swipe for opening sidebar
    this.parent?.setOptions({
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
    const connectorStatus = await SecuredStorage.loadFilterValue(centralServerProvider.getUserInfo(), GlobalFilters.ONLY_AVAILABLE_CHARGING_STATIONS);
    const connectorType = await SecuredStorage.loadFilterValue(centralServerProvider.getUserInfo(), GlobalFilters.CONNECTOR_TYPES);
    this.setState({
      initialFilters: { connectorStatus, connectorType },
      filters: { connectorStatus, connectorType }
    });
  }

  public getChargingStations = async (searchText: string, skip: number, limit: number): Promise<DataResult<ChargingStation>> => {
    let chargingStations: DataResult<ChargingStation>;
    const { filters, showMap } = this.state;
    const currentLocation = await Utils.getUserCurrentLocation();
    try {
      const params = {
        Search: searchText,
        SiteAreaID: this.siteArea?.id,
        Issuer: true,
        ConnectorStatus: filters.connectorStatus,
        ConnectorType: filters.connectorType,
        WithSiteArea: true,
        LocLatitude: showMap ? this.currentRegion?.latitude : currentLocation.latitude,
        LocLongitude: showMap ? this.currentRegion?.longitude : currentLocation.longitude,
        LocMaxDistanceMeters: showMap ? Utils.computeMaxBoundaryDistanceKm(this.currentRegion) : null
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
    const { count, skip, showMap } = this.state;
    const limit = showMap ? this.mapLimit : this.listLimit;
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
      this.setState({ showMap: true }, () => this.refresh());
      return true;
    }
    if (!!this.siteArea) {
      this.props.navigation.goBack();
      return true;
    }
    BackHandler.exitApp();
    return true;
  };

  public async computeRegion(chargingStations: ChargingStation[]): Promise<Region> {
    // If Site Area, use its coordinates
    if(this.siteArea) {
      return {
        longitude: this.siteArea.address.coordinates[0],
        latitude: this.siteArea.address.coordinates[1],
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      }
    }
    // Else, if currentLocation available, use it
    const currentLocation = await Utils.getUserCurrentLocation();
    if ( currentLocation ) {
        return {
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
          longitudeDelta: 0.01,
          latitudeDelta: 0.01
        }
    }
    // Else, use coordinates of the first charging station
    if (!Utils.isEmptyArray(chargingStations)) {
      let gpsCoordinates: number[];
      if ( !Utils.isEmptyArray(chargingStations) && Utils.containsGPSCoordinates(chargingStations[0].coordinates) ) {
        gpsCoordinates = chargingStations[0].coordinates;
      }
      return {
        longitude: gpsCoordinates ? gpsCoordinates[0] : 2.3514616,
        latitude: gpsCoordinates ? gpsCoordinates[1] : 48.8566969,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      };
    }
    return this.currentRegion;
  }

  public refresh = async (showRefreshing = false) => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, showMap } = this.state;
      const limit = showMap ? this.mapLimit : this.listLimit;
      if (showRefreshing) {
        this.setState({ refreshing: true })
      }
      // Refresh All
      const chargingStations = await this.getChargingStations(this.searchText, 0, skip + limit);
      // Refresh region
      if(!this.currentRegion) {
        this.currentRegion = await this.computeRegion(chargingStations.result);
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
    await this.refresh(true);
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
    await this.refresh(true);
  };

  public onMapRegionChangeComplete = (region: Region) => {
    this.currentRegion = region;
    this.refresh();
  }

  public filterChanged(newFilters: ChargingStationsFiltersDef) {
    this.setState({ filters: newFilters, refreshing: true }, async () => this.refresh(true));
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
    const fabStyles = computeFabStyles();
    const isDarkModeEnabled = ThemeManager.getInstance()?.isThemeTypeIsDark();
    const {
      loading,
      chargingStations,
      isAdmin,
      initialFilters,
      skip,
      count,
      showMap,
      chargingStationSelected,
      refreshing,
      satelliteMap
    } = this.state;
    return (
      <Container style={style.container}>
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
        <View style={style.fabContainer}>
          {showMap && (
            <TouchableOpacity style={fabStyles.fab} onPress={() => this.setState({ satelliteMap: !satelliteMap })}>
              <Image
                source={satelliteMap ? isDarkModeEnabled ? standardDarkLayout : standardLightLayout : satelliteLayout}
                style={[style.imageStyle, satelliteMap && style.outlinedImage] as ImageStyle}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={fabStyles.fab}
            onPress={() => this.setState({ showMap: ! showMap}, () => this.refresh(true)) }
          >
            <Icon style={fabStyles.fabIcon} type={'MaterialCommunityIcons'} name={showMap ? 'format-list-bulleted' : 'map'} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <View style={style.searchBar}>
              <SimpleSearchComponent onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
            </View>
            <ChargingStationsFilters
              initialFilters={initialFilters}
              onFilterChanged={(newFilters: ChargingStationsFiltersDef) => this.filterChanged(newFilters)}
              ref={(chargingStationsFilters: ChargingStationsFilters) => this.setScreenFilters(chargingStationsFilters)}
            />
            {showMap ? (
              <View style={style.map}>
                {this.renderMap()}
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
                limit={this.listLimit}
              />
            )}
          </View>
        )}
      </Container>
    );
  }

  private renderMap() {
    const style = computeStyleSheet();
    const { chargingStations, satelliteMap } = this.state
    const chargingStationsWithGPSCoordinates = chargingStations.filter((chargingStation) =>
      Utils.containsGPSCoordinates(chargingStation.coordinates)
    );
    return (
      <View style={style.map}>
        <ClusterMap<ChargingStation>
          items={chargingStationsWithGPSCoordinates}
          satelliteMap={satelliteMap}
          renderMarker={(chargingStation, index) => (
            <Marker
              key={`${chargingStation.id}${index}${chargingStation.chargingStationURL}`}
              tracksViewChanges={false}
              coordinate={{ longitude: chargingStation.coordinates[0], latitude: chargingStation.coordinates[1] }}
              title={chargingStation.id}
              onPress={() => this.showMapChargingStationDetail(chargingStation)}
            >
              <Icon type={'FontAwesome5'} name={'charging-station'} style={[style.chargingStationMarker, this.buildMarkerStyle(chargingStation?.connectors, chargingStation?.inactive)]} />
            </Marker>
          )}
          initialRegion={this.currentRegion}
          onMapRegionChangeComplete={this.onMapRegionChangeComplete}
        />
      </View>
    )
  }

  private buildMarkerStyle(connectors: Connector[], inactive: boolean) {
    const connectorStatusStyles = computeConnectorStatusStyles();
    if (inactive) {
      //TODO handle reserved status when implemented
      return connectorStatusStyles.unavailableConnectorDescription;
    } else if (connectors.find((connector) => connector.status === ChargePointStatus.AVAILABLE)) {
      return connectorStatusStyles.availableConnectorDescription;
    } else if (
      connectors.find((connector) => connector.status === ChargePointStatus.FINISHING) ||
      connectors.find((connector) => connector.status === ChargePointStatus.PREPARING)
    ) {
      return connectorStatusStyles.preparingConnectorDescription;
    } else if (
      connectors.find((connector) => connector.status === ChargePointStatus.CHARGING) ||
      connectors.find((connector) => connector.status === ChargePointStatus.OCCUPIED)
    ) {
      return connectorStatusStyles.chargingConnectorDescription;
    } else if (
      connectors.find((connector) => connector.status === ChargePointStatus.SUSPENDED_EVSE) ||
      connectors.find((connector) => connector.status === ChargePointStatus.SUSPENDED_EV)
    ) {
      return connectorStatusStyles.suspendedConnectorDescription;
    } else if (connectors.find((connector) => connector.status === ChargePointStatus.FAULTED)) {
      return statusMarkerFaulted;
    }
    return connectorStatusStyles.unavailableConnectorDescription;
  }
}
