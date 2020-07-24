import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import { Location } from 'react-native-location';
import MapView, { Marker, Region } from 'react-native-maps';
import { DrawerActions } from 'react-navigation-drawer';

import HeaderComponent from '../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import SiteAreaComponent from '../../components/site-area/SiteAreaComponent';
import LocationManager from '../../location/LocationManager';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseProps from '../../types/BaseProps';
import { DataResult } from '../../types/DataResult';
import { GlobalFilters } from '../../types/Filter';
import SiteArea from '../../types/SiteArea';
import Constants from '../../utils/Constants';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import SiteAreasFilters, { SiteAreasFiltersDef } from './SiteAreasFilters';
import computeStyleSheet from './SiteAreasStyles';

export interface Props extends BaseProps {
}

interface State {
  siteAreas?: SiteArea[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  initialFilters?: SiteAreasFiltersDef;
  filters?: SiteAreasFiltersDef;
  showMap?: boolean;
}

export default class SiteAreas extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private siteID: string;
  private currentLocation: Location;
  private locationEnabled: boolean;
  private currentRegion: Region;

  constructor(props: Props) {
    super(props);
    this.state = {
      siteAreas: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      initialFilters: {},
      showMap: false,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Get initial filters
    await this.loadInitialFilters();
    // Get initial filters
    this.siteID = Utils.getParamFromNavigation(this.props.navigation, 'siteID', null);
    await super.componentDidMount();
  }

  public async loadInitialFilters() {
    const centralServerProvider = await ProviderFactory.getProvider();
    let location = Utils.convertToBoolean(await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(), GlobalFilters.LOCATION));
    if (!location) {
      location = false;
    }
    this.setState({
      initialFilters: { location },
      filters: { location }
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

  public getSiteAreas = async (searchText: string, skip: number, limit: number): Promise<DataResult<SiteArea>> => {
    let siteAreas: DataResult<SiteArea>;
    try {
      // Get current location
      this.currentLocation = await this.getCurrentLocation();
      // Get the Site Areas
      siteAreas = await this.centralServerProvider.getSiteAreas({
        Search: searchText,
        SiteID: this.siteID,
        Issuer: true,
        WithAvailableChargers: true,
        LocLatitude: this.currentLocation ? this.currentLocation.latitude : null,
        LocLongitude: this.currentLocation ? this.currentLocation.longitude : null,
        LocMaxDistanceMeters: this.currentLocation ? Constants.MAX_DISTANCE_METERS : null
      },
        { skip, limit }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'siteAreas.siteAreaUnexpectedError', this.props.navigation, this.refresh);
    }
    // Return
    return siteAreas;
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public refreshCurrentRegion(siteAreas: SiteArea[], force = false) {
    // Set current region
    if (!this.currentRegion || force) {
      let gpsCoordinates: number[];
      if (!Utils.isEmptyArray(siteAreas) && Utils.containsAddressGPSCoordinates(siteAreas[0].address)) {
        gpsCoordinates = siteAreas[0].address.coordinates;
      }
      this.currentRegion = {
        longitude: gpsCoordinates ? gpsCoordinates[0] : 2.3514616,
        latitude: gpsCoordinates ? gpsCoordinates[1] : 48.8566969,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      };
    }
  }

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const siteAreas = await this.getSiteAreas(this.searchText, 0, skip + limit);
      // Refresh region
      this.refreshCurrentRegion(siteAreas.result);
      // Set Site Areas
      this.setState({
        loading: false,
        siteAreas: siteAreas ? siteAreas.result : [],
        count: siteAreas ? siteAreas.count : 0
      });
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

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const siteAreas = await this.getSiteAreas(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        siteAreas: [...prevState.siteAreas, ...siteAreas.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public search = async (searchText: string) => {
    this.searchText = searchText;
    await this.refresh();
  }

  public onMapRegionChange = (region: Region) => {
    this.currentRegion = region;
  }

  public filterChanged(newFilters: SiteAreasFiltersDef) {
    delete this.currentRegion;
    this.setState({ filters: newFilters }, () => this.refresh());
  }

  public toggleDisplayMap = () => {
    // Refresh region
    this.refreshCurrentRegion(this.state.siteAreas, true);
    // Toggle map
    this.setState({ showMap: !this.state.showMap })
  }

  public render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, skip, count, limit, initialFilters, showMap } = this.state;
    const mapIsDisplayed = showMap && !Utils.isEmptyArray(this.state.siteAreas)
    return (
      <Container style={style.container}>
        <HeaderComponent
          navigation={navigation}
          title={I18n.t('siteAreas.title')}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
          diplayMap={!Utils.isEmptyArray(this.state.siteAreas)}
          mapIsDisplayed={mapIsDisplayed}
          diplayMapAction={() => this.toggleDisplayMap()}
        />
        {loading ? (
          <Spinner style={style.spinner} />
        ) : (
          <View style={style.content}>
            <SimpleSearchComponent
              onChange={(searchText) => this.search(searchText)}
              navigation={navigation}
            />
            <SiteAreasFilters
              initialFilters={initialFilters} locationEnabled={this.locationEnabled}
              onFilterChanged={(newFilters: SiteAreasFiltersDef) => this.setState({ filters: newFilters }, () => this.refresh())}
              ref={(siteAreasFilters: SiteAreasFilters) => this.setScreenFilters(siteAreasFilters)}
            />
            {mapIsDisplayed ?
              <MapView
                style={style.map}
                region={this.currentRegion}
                onRegionChange={this.onMapRegionChange}
              >
                {this.state.siteAreas.map((siteArea: SiteArea) => {
                  if (Utils.containsAddressGPSCoordinates(siteArea.address)) {
                    return (
                      <Marker
                        key={siteArea.id}
                        coordinate={{ longitude: siteArea.address.coordinates[0], latitude: siteArea.address.coordinates[1] }}
                        title={siteArea.name}
                        description={siteArea.name}
                      />
                    );
                  }
                  return undefined;
                })}
              </MapView>
            :
              <FlatList
                data={this.state.siteAreas}
                renderItem={({ item }) => <SiteAreaComponent siteArea={item} navigation={this.props.navigation} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this.onEndScroll}
                onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
                ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('siteAreas.noSiteAreas')} />}
                ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
              />
            }
          </View>
        )
      }
      </Container>
    );
  }
}
