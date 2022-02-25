import I18n from 'i18n-js';
import { Container, Icon, Spinner, View } from 'native-base';
import React from 'react';
import { ActivityIndicator, BackHandler, Image, ImageStyle, SafeAreaView, TouchableOpacity } from 'react-native';
import { Marker, Region } from 'react-native-maps';
import Modal from 'react-native-modal';
import computeConnectorStatusStyles from '../../../components/connector-status/ConnectorStatusComponentStyles';

import ChargingStationComponent from '../../../components/charging-station/ChargingStationComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList from '../../../components/list/ItemsList';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import I18nManager from '../../../I18n/I18nManager';
import computeModalStyle from '../../../ModalStyles';
import BaseProps from '../../../types/BaseProps';
import ChargingStation, { ChargePointStatus, Connector } from '../../../types/ChargingStation';
import { DataResult } from '../../../types/DataResult';
import SiteArea from '../../../types/SiteArea';
import Constants from '../../../utils/Constants';
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
  filters?: ChargingStationsFiltersDef;
  showMap?: boolean;
  visible?: boolean;
  satelliteMap?: boolean;
  chargingStationSelected?: ChargingStation;
  loadingChargingStationDetails?: boolean;
}

export default class ChargingStations extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private siteArea: SiteArea;
  private currentRegion: Region;
  private parent: any;
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
      filters: null,
      skip: 0,
      count: 0,
      showMap: true,
      visible: false,
      chargingStationSelected: null,
      satelliteMap: false,
      loadingChargingStationDetails: true
    };
  }

  public async componentDidMount() {
    // Get initial filters
    await super.componentDidMount()
    this.siteArea = Utils.getParamFromNavigation(this.props.route, 'siteArea', null) as unknown as SiteArea;
    const { navigation } = this.props;
    // Enable swipe for opening sidebar
    this.parent = navigation.getParent();
    this.parent?.setOptions({
      swipeEnabled: !this.siteArea
    });
    this.refresh(true);
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    // Disable swipe for opening sidebar
    this.parent?.setOptions({
      swipeEnabled: false
    });
  }

  public componentDidFocus(): void {
    super.componentDidFocus();
    this.siteArea = Utils.getParamFromNavigation(this.props.route, 'siteArea', null) as unknown as SiteArea;
    this.refresh(true);
    // Enable swipe for opening sidebar
    this.parent?.setOptions({
      swipeEnabled: !this.siteArea
    });
  }

  public componentDidBlur(): void {
    super.componentDidBlur();
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

  public getChargingStations = async (searchText: string, skip: number, limit: number): Promise<DataResult<ChargingStation>> => {
    if(this.state.filters) {
      let chargingStations: DataResult<ChargingStation>;
      const { filters, showMap } = this.state;
      const currentLocation = await Utils.getUserCurrentLocation();
      const projectFields = 'id|coordinates|inactive|connectors.connectorId|connectors.coordinates|connectors.status|siteArea.siteID'
      try {
        const params = {
          Search: searchText,
          SiteAreaID: this.siteArea?.id,
          Issuer: !filters.issuer,
          ConnectorStatus: filters?.connectorStatus,
          ConnectorType: filters.connectorTypes,
          WithSiteArea: true,
          LocLatitude: showMap ? this.currentRegion?.latitude : currentLocation?.latitude,
          LocLongitude: showMap ? this.currentRegion?.longitude : currentLocation?.longitude,
          LocMaxDistanceMeters: showMap ? Utils.computeMaxBoundaryDistanceKm(this.currentRegion) : null,
          ProjectFields: showMap ? projectFields : ''
        };
        // Get with the Site Area
        chargingStations = await this.centralServerProvider.getChargingStations(params, { skip, limit }, ['id']);
        // Get total number of records
        if (chargingStations?.count === -1) {
          const chargingStationsNbrRecordsOnly = await this.centralServerProvider.getChargingStations(params, Constants.ONLY_RECORD_COUNT);
          chargingStations.count = chargingStationsNbrRecordsOnly?.count;
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
    }
    return null;
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

  public onBack (): boolean {
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
        this.currentRegion = await this.computeRegion(chargingStations?.result);
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

  public search = async (searchText: string) => {
    this.setState({ refreshing: true });
    this.searchText = searchText;
    await this.refresh(true);
  };

  public onMapRegionChangeComplete = (region: Region) => {
    if(region.latitude.toFixed(6) !== this.currentRegion.latitude.toFixed(6) ||
      region.longitude.toFixed(6) !== this.currentRegion.longitude.toFixed(6)) {
      this.currentRegion = region;
      this.refresh();
    }
  }

  public filterChanged(newFilters: ChargingStationsFiltersDef) {
    this.setState({ filters: newFilters, refreshing: true }, async () => this.refresh(true));
  }

  public async showMapChargingStationDetail(chargingStationID: string) {
    this.setState({visible: true, loadingChargingStationDetails: true}, async () => {
      const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationID, {ProjectFields: 'id', Issuer: true});
      this.setState({
        loadingChargingStationDetails: false,
        chargingStationSelected: chargingStation
      });
    });
  };

  public buildModal(isAdmin: boolean, navigation: any, chargingStationSelected: ChargingStation, modalStyle: any) {
    // ChargeX setup have more than 4 connectors.
    const style = computeStyleSheet();
    return (
      <Modal
        useNativeDriver={true}
        animationIn={'slideInUp'}
        animationInTiming={800}
        animationOut={'slideOutDown'}
        animationOutTiming={1000}
        hideModalContentWhileAnimating={true}
        onSwipeComplete={() => this.setState({ visible: false })}
        style={modalStyle.modalBottomHalf}
        isVisible={true}
        propagateSwipe={true}
        onBackdropPress={() => this.setState({ visible: false })}
        onBackButtonPress={() => this.setState({ visible: false })}
      >
        <SafeAreaView style={style.chargingStationDetailsModalContainer}>
          <View style={style.chargingStationDetailsModalHeader}>
            <TouchableOpacity onPress={() => this.setState({ visible: false })}>
              <Icon style={style.closeIcon} type="EvilIcons" name={'close'} />
            </TouchableOpacity>
          </View>
          {this.state.loadingChargingStationDetails ? (
            <View style={style.chargingStationDetailsModalSpinnerContainer}>
              <ActivityIndicator size={style.chargingStationDetailsModalSpinner.fontSize} color={style.chargingStationDetailsModalSpinner.color} />
            </View>
          ) : (
            <View style={{flexGrow: 1, flexShrink: 1, flexBasis: 'auto'}}>
              <ChargingStationComponent
                chargingStation={chargingStationSelected}
                isAdmin={isAdmin}
                onNavigate={() => this.setState({ visible: false })}
                navigation={navigation}
                isSiteAdmin={this.securityProvider?.isSiteAdmin(
                  chargingStationSelected?.siteArea?.siteID ?? ''
                )}
              />
            </View>
          )}
        </SafeAreaView>
      </Modal>
    );
  }

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const modalStyle = computeModalStyle();
    const { loading, chargingStations, isAdmin, skip, count, showMap, visible, chargingStationSelected, refreshing } = this.state;
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
              renderAction: () => (
                <View style={style.qrcodeButton}>
                  <Icon type={'MaterialIcons'} name={'qr-code-scanner'} style={style.icon} />
                </View>
              )
            }
          ]}
          sideBar={!this.siteArea}
          backArrow={!!this.siteArea}
        />
        <View style={style.content}>
          {this.renderFilters()}
          {this.renderFabs()}
          {visible && this.buildModal(isAdmin, navigation, chargingStationSelected, modalStyle)}
          {loading ? <Spinner style={style.spinner} color="grey" /> : (
            <View style={style.chargingStationsContainer}>
              {showMap ? this.renderMap() : (
                <ItemsList<ChargingStation>
                  skip={skip}
                  count={count}
                  onEndReached={this.onEndScroll}
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
        </View>
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
              key={chargingStation.id}
              identifier={chargingStation.id}
              tracksViewChanges={false}
              coordinate={{ longitude: chargingStation.coordinates[0], latitude: chargingStation.coordinates[1] }}
              title={chargingStation.id}
              onPress={() => this.showMapChargingStationDetail(chargingStation.id)}
            >
              <Icon type={'FontAwesome5'} name={'charging-station'} style={[style.chargingStationMarker, this.buildMarkerStyle(chargingStation?.connectors, chargingStation?.inactive)]} />
            </Marker>
          )}
          initialRegion={this.currentRegion}
          onMapRegionChangeComplete={(region) => this.onMapRegionChangeComplete(region)}
        />
      </View>
    )
  }

  private renderFabs() {
    const style = computeStyleSheet();
    const fabStyles = computeFabStyles();
    const { showMap, satelliteMap } = this.state;
    const isDarkModeEnabled = ThemeManager.getInstance()?.isThemeTypeIsDark();
    return (
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
          delayPressIn={0}
          style={[fabStyles.fab, style.fab]}
          onPress={() => this.setState({ showMap: !showMap, chargingStations: []}, () => this.refresh()) }
        >
          <Icon style={fabStyles.fabIcon} type={'MaterialCommunityIcons'} name={showMap ? 'format-list-bulleted' : 'map'} />
        </TouchableOpacity>
      </View>
    );
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

  private renderFilters() {
    const { showMap } = this.state;
    const areModalFiltersActive = this.screenFilters?.areModalFiltersActive();
    const style = computeStyleSheet();
    const fabStyles = computeFabStyles();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={[style.filtersContainer, showMap && style.mapFiltersContainer]}>
        <ChargingStationsFilters
          onFilterChanged={(newFilters: ChargingStationsFiltersDef) => this.filterChanged(newFilters)}
          ref={(chargingStationsFilters: ChargingStationsFilters) => this.setScreenFilters(chargingStationsFilters)}
        />
        <SimpleSearchComponent containerStyle={showMap ? style.mapSearchBarComponent : style.listSearchBarComponent} onChange={async (searchText) => this.search(searchText)} navigation={this.props.navigation} />
        <TouchableOpacity onPress={() => this.screenFilters?.openModal()}  style={showMap? [fabStyles.fab, style.mapFilterButton] : style.listFilterButton}>
          <Icon style={{color: commonColors.textColor}} type={'MaterialCommunityIcons'} name={areModalFiltersActive ? 'filter' : 'filter-outline'} />
        </TouchableOpacity>
      </View>
    );
  }
}
