import I18n from 'i18n-js';
import { Container, Icon, Spinner, View } from 'native-base';
import React from 'react';
import { Image, ImageStyle, Platform, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Marker, Region } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Modalize } from 'react-native-modalize';

import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import SiteComponent from '../../components/site/SiteComponent';
import I18nManager from '../../I18n/I18nManager';
import computeModalStyle from '../../ModalStyles';
import BaseProps from '../../types/BaseProps';
import { DataResult } from '../../types/DataResult';
import Site from '../../types/Site';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import SitesFilters, { SitesFiltersDef } from './SitesFilters';
import computeStyleSheet from './SitesStyles';
import ClusterMap from '../../components/map/ClusterMap';
import standardDarkLayout from '../../../assets/map/standard-dark.png';
import standardLightLayout from '../../../assets/map/standard-light.png';
import satelliteLayout from '../../../assets/map/satellite.png';
import computeFabStyles from '../../components/fab/FabComponentStyles';
import ThemeManager from '../../custom-theme/ThemeManager';
import { ChargingStationsFiltersDef } from '../charging-stations/list/ChargingStationsFilters';

export interface Props extends BaseProps {}

interface State {
  sites?: Site[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  initialFilters?: SitesFiltersDef;
  filters?: SitesFiltersDef;
  count?: number;
  showMap?: boolean;
  visible?: boolean;
  selectedSite?: Site;
  satelliteMap?: boolean;
}

export default class Sites extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private currentRegion: Region;
  private mapLimit = 100;
  private listLimit = 25;

  public constructor(props: Props) {
    super(props);
    this.state = {
      sites: [],
      loading: true,
      refreshing: false,
      skip: 0,
      initialFilters: {},
      count: 0,
      showMap: false,
      visible: false,
      selectedSite: null,
      satelliteMap: false
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
    // No Site Management: Go to chargers
    if (this.securityProvider && !this.securityProvider.isComponentOrganizationActive()) {
      this.props.navigation.navigate('ChargingStations', { key: `${Utils.randomNumber()}` });
    }
    this.refresh(true);
  }

  public getSites = async (searchText = '', skip: number, limit: number): Promise<DataResult<Site>> => {
    if (this.state.filters) {
      const { showMap } = this.state;
      const currentLocation = await Utils.getUserCurrentLocation();
      try {
        const params = {
          Search: searchText,
          Issuer: !this.state.filters.issuer,
          WithAvailableChargers: true,
          LocLatitude: showMap ? this.currentRegion?.latitude : currentLocation?.latitude,
          LocLongitude: showMap ? this.currentRegion?.longitude : currentLocation?.longitude,
          LocMaxDistanceMeters: showMap ? Utils.computeMaxBoundaryDistanceKm(this.currentRegion) : null
        };
        // Get the Sites
        const sites = await this.centralServerProvider.getSites(params, { skip, limit }, ['name']);
        // Get total number of records
        if (sites?.count === -1) {
          const sitesNbrRecordsOnly = await this.centralServerProvider.getSites(params, Constants.ONLY_RECORD_COUNT);
          sites.count = sitesNbrRecordsOnly?.count;
        }
        return sites;
      } catch (error) {
        // Other common Error
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'sites.siteUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  };

  public onBack () {
    // Back mobile button: Force navigation
    if (this.state.showMap) {
      this.setState({ showMap: false, refreshing: true }, () => this.refresh());
      return true;
    } else {
      this.props.navigation.goBack();
      return true;
    }
  };

  public async computeRegion(sites: Site[]): Promise<Region> {
    // If currentLocation available, use it
    const currentLocation = await Utils.getUserCurrentLocation();
    if ( currentLocation ) {
      return {
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      }
    }
    // Else, use coordinates of the first site
    if (!Utils.isEmptyArray(sites)) {
      let gpsCoordinates: number[];
      if ( !Utils.isEmptyArray(sites) && Utils.containsGPSCoordinates(sites[0].address?.coordinates) ) {
        gpsCoordinates = sites[0].address?.coordinates;
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
      if (showRefreshing) {
        this.setState({ refreshing: true});
      }
      // Refresh All
      const limit = showMap ? this.mapLimit : this.listLimit;
      const sites = await this.getSites(this.searchText, 0, skip + limit);
      // Refresh region
      if (!this.currentRegion) {
        this.currentRegion = await this.computeRegion(sites?.result);
      }
      // Add sites
      this.setState({
        loading: false,
        refreshing: false,
        sites: sites ? sites.result : [],
        count: sites ? sites.count : 0
      });
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

  public onEndScroll = async () => {
    const { count, skip, showMap } = this.state;
    const limit = showMap ? this.mapLimit : this.listLimit;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const sites = await this.getSites(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        sites: sites ? [...prevState.sites, ...sites.result] : prevState.sites,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public search = async (searchText: string) => {
    this.setState({ refreshing: true });
    this.searchText = searchText;
    delete this.currentRegion;
    await this.refresh(true);
  };

  public onMapRegionChange = (region: Region) => {
    this.currentRegion = region;
  };

  public filterChanged(newFilters: SitesFiltersDef) {
    delete this.currentRegion;
    this.setState({ filters: newFilters,
      ...(Utils.isEmptyArray(this.state.sites) ? {loading: true} : {refreshing : true})
      },
      async () => this.refresh(true));
  }

  public showMapSiteDetail = (site: Site) => {
    this.setState({
      visible: true,
      selectedSite: site
    });
  };

  public buildModal(navigation: any, siteSelected: Site, modalStyle: any) {
    if (Platform.OS === 'ios') {
      return (
        <Modal style={modalStyle.modalBottomHalf} isVisible={this.state.visible} onBackdropPress={() => this.setState({ visible: false })}>
          <Modalize alwaysOpen={175} modalStyle={modalStyle.modalContainer}>
            <SiteComponent site={siteSelected} navigation={navigation} onNavigate={() => this.setState({ visible: false })} />
          </Modalize>
        </Modal>
      );
    } else {
      return (
        <Modal style={modalStyle.modalBottomHalf} isVisible={this.state.visible} onBackdropPress={() => this.setState({ visible: false })}>
          <View style={modalStyle.modalContainer}>
            <ScrollView>
              <SiteComponent site={siteSelected} navigation={navigation} onNavigate={() => this.setState({ visible: false })} />
            </ScrollView>
          </View>
        </Modal>
      );
    }
  }

  public onMapRegionChangeComplete = (region: Region) => {
    if(region.latitude.toFixed(6) !== this.currentRegion.latitude.toFixed(6) ||
      region.longitude.toFixed(6) !== this.currentRegion.longitude.toFixed(6)) {
      this.currentRegion = region;
      this.refresh();
    }
  }

  public render() {
    const style = computeStyleSheet();
    const modalStyle = computeModalStyle();
    const { navigation } = this.props;
    const { loading, skip, count, showMap, selectedSite, refreshing, sites } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          navigation={navigation}
          title={I18n.t('sidebar.sites')}
          subTitle={count > 0 ? `(${I18nManager.formatNumber(count)})` : null}
        />
        <View style={style.content}>
          {this.renderFilters()}
          {this.renderFabs()}
          {selectedSite && this.buildModal(navigation, selectedSite, modalStyle)}
          {loading ? <Spinner style={style.spinner} color="grey" /> : (
            <View style={style.sitesContainer}>
              {showMap ? this.renderMap() : (
                <ItemsList<Site>
                  skip={skip}
                  count={count}
                  onEndReached={this.onEndScroll}
                  renderItem={(site: Site) => <SiteComponent site={site} navigation={navigation}/>}
                  data={sites}
                  manualRefresh={this.manualRefresh}
                  refreshing={refreshing}
                  emptyTitle={I18n.t('sites.noSites')}
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
          onPress={() => this.setState({ showMap: !showMap, sites: []}, () => this.refresh()) }
        >
          <Icon style={fabStyles.fabIcon} type={'MaterialCommunityIcons'} name={showMap ? 'format-list-bulleted' : 'map'} />
        </TouchableOpacity>
      </View>
    );
  }

  private renderMap() {
    const style = computeStyleSheet();
    const { sites, satelliteMap } = this.state
    const sitesWithGPSCoordinates = sites.filter((site) =>
      Utils.containsGPSCoordinates(site.address.coordinates)
    );
    return (
      <View style={style.map}>
        <ClusterMap<Site>
          items={sitesWithGPSCoordinates}
          satelliteMap={satelliteMap}
          renderMarker={(site, index) => (
            <Marker
              key={`${site.id}${index}${site.name}`}
              tracksViewChanges={false}
              coordinate={{ longitude: site.address.coordinates[0], latitude: site.address.coordinates[1] }}
              title={site.name}
              onPress={() => this.showMapSiteDetail(site)}
            >
              <Icon type={'MaterialIcons'} name={'location-pin'} style={[style.siteMarker, Utils.computeSiteMarkerStyle(site?.connectorStats)]} />
            </Marker>
          )}
          initialRegion={this.currentRegion}
          onMapRegionChangeComplete={(region) => this.onMapRegionChangeComplete(region)}
        />
      </View>
    )
  }

  private renderFilters() {
    const { showMap } = this.state;
    const areModalFiltersActive = this.screenFilters?.areModalFiltersActive();
    const style = computeStyleSheet();
    const fabStyles = computeFabStyles();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={[style.filtersContainer, showMap && style.mapFiltersContainer]}>
        <SitesFilters
          onFilterChanged={(newFilters: ChargingStationsFiltersDef) => this.filterChanged(newFilters)}
          ref={(sitesFilters: SitesFilters) => this.setScreenFilters(sitesFilters)}
        />
        <SimpleSearchComponent containerStyle={showMap ? style.mapSearchBarComponent : style.listSearchBarComponent} onChange={async (searchText) => this.search(searchText)} navigation={this.props.navigation} />
        <TouchableOpacity onPress={() => this.screenFilters?.openModal()}  style={showMap? [fabStyles.fab, style.mapFilterButton] : style.listFilterButton}>
          <Icon style={{color: commonColors.textColor}} type={'MaterialCommunityIcons'} name={areModalFiltersActive ? 'filter' : 'filter-outline'} />
        </TouchableOpacity>
      </View>
    );
  }
}
