import I18n from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';
import {
  Image,
  ImageStyle,
  SafeAreaView,
  TouchableOpacity,
  View
} from 'react-native';
import ClusterMap from '../../components/map/ClusterMap';
import { Marker, Region } from 'react-native-maps';
import Modal from 'react-native-modal';

import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import SiteAreaComponent from '../../components/site-area/SiteAreaComponent';
import I18nManager from '../../I18n/I18nManager';
import computeModalStyle from '../../ModalStyles';
import BaseProps from '../../types/BaseProps';
import { DataResult } from '../../types/DataResult';
import Site from '../../types/Site';
import SiteArea from '../../types/SiteArea';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import SiteAreasFilters, { SiteAreasFiltersDef } from './SiteAreasFilters';
import computeStyleSheet from './SiteAreasStyles';
import standardDarkLayout from '../../../assets/map/standard-dark.png';
import standardLightLayout from '../../../assets/map/standard-light.png';
import satelliteLayout from '../../../assets/map/satellite.png';
import computeFabStyles from '../../components/fab/FabComponentStyles';
import ThemeManager from '../../custom-theme/ThemeManager';
import { SitesFiltersDef } from '../sites/SitesFilters';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  siteAreas?: SiteArea[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  count?: number;
  filters?: SiteAreasFiltersDef;
  showMap?: boolean;
  visible?: boolean;
  selectedSiteArea?: SiteArea;
  satelliteMap?: boolean;
}

export default class SiteAreas extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private site: Site;
  private currentRegion: Region;
  private mapLimit = 200;
  private listLimit = 25;

  public constructor(props: Props) {
    super(props);
    this.site = Utils.getParamFromNavigation(this.props.route, 'site', null) as unknown as Site;
    this.state = {
      siteAreas: [],
      loading: true,
      refreshing: false,
      skip: 0,
      count: 0,
      showMap: false,
      selectedSiteArea: null,
      satelliteMap: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount(triggerRefresh: boolean = true): Promise<void> {
    await super.componentDidMount();
    // When filters are enabled, first refresh is triggered via onFiltersChanged
    if (!this.screenFilters) {
      this.refresh(true);
    }
  }

  public componentDidFocus() {
    super.componentDidFocus();
    this.site = Utils.getParamFromNavigation(this.props.route, 'site', null) as unknown as Site;
  }

  public componentDidBlur() {
    super.componentDidBlur();
    delete this.site
  }

  public getSiteAreas = async (searchText: string = '', skip: number, limit: number): Promise<DataResult<SiteArea>> => {
    try {
      // Get current location
      const currentLocation = await Utils.getUserCurrentLocation();
      const { showMap } = this.state;
      const params = {
        Search: searchText,
        SiteID: this.site?.id,
        WithAvailableChargers: true,
        LocLatitude: showMap ? this.currentRegion?.latitude : currentLocation?.latitude,
        LocLongitude: showMap ? this.currentRegion?.longitude : currentLocation?.longitude,
        LocMaxDistanceMeters: showMap ? Utils.computeMaxBoundaryDistanceKm(this.currentRegion) : null
      };
      // Get the Site Areas
      const siteAreas = await this.centralServerProvider.getSiteAreas(params, { skip, limit }, ['name']);
      // Get total number of records
      if (siteAreas?.count === -1) {
        const sitesAreasNbrRecordsOnly = await this.centralServerProvider.getSiteAreas(params, Constants.ONLY_RECORD_COUNT);
        siteAreas.count = sitesAreasNbrRecordsOnly?.count;
      }
      return siteAreas;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'siteAreas.siteAreaUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
  return null;
  };

  public onBack () {
    // Back mobile button: Force navigation
    if (this.state.showMap) {
      this.setState({ showMap: false, siteAreas: [] }, () => this.refresh(true));
      return true;
    } else {
      this.props.navigation.goBack();
      return true;
    }
  };

  public async computeRegion(siteAreas: SiteArea[]): Promise<Region> {
    // If currentLocation available, use it
    const currentLocation = await Utils.getUserCurrentLocation();
/*    if ( currentLocation ) {
      return {
        longitude: currentLocation.longitude,
        latitude: currentLocation.latitude,
        longitudeDelta: 0.01,
        latitudeDelta: 0.01
      }
    }*/
    // Else, use coordinates of the first site area
    if (!Utils.isEmptyArray(siteAreas)) {
      let gpsCoordinates: number[];
      if ( !Utils.isEmptyArray(siteAreas) && Utils.containsGPSCoordinates(siteAreas[0].address?.coordinates) ) {
        gpsCoordinates = siteAreas[0].address?.coordinates;
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

  public async refresh(showSpinner = false) {
    // Component Mounted?
    if (this.isMounted()) {
      const newState = showSpinner ?  (Utils.isEmptyArray(this.state.siteAreas) ?  { loading: true } :  { refreshing: true }) : this.state;
      this.setState(newState, async () => {
        const { skip, showMap } = this.state;
        // Refresh All
        const limit = showMap ? this.mapLimit : this.listLimit;
        const siteAreas = await this.getSiteAreas(this.searchText, 0, skip + limit);
        // Refresh region
        if (!this.currentRegion) {
          this.currentRegion = await this.computeRegion(siteAreas?.result);
        }
        // Set Site Areas
        this.setState({
          loading: false,
          refreshing: false,
          siteAreas: siteAreas ? siteAreas.result : [],
          count: siteAreas ? siteAreas.count : 0
        });
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
    // No reached the end?
    const limit = showMap ? this.mapLimit : this.listLimit;
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
    await this.refresh(true);
  };

  public onMapRegionChange = (region: Region) => {
    this.currentRegion = region;
  };

  public filterChanged(newFilters: SitesFiltersDef) {
    this.setState({ filters: newFilters }, async () => this.refresh(true));
  }

  public showMapSiteAreaDetail = (siteArea: SiteArea) => {
    this.setState({
      selectedSiteArea: siteArea
    });
  };

  public buildModal(navigation: any, siteAreaSelected: SiteArea, modalStyle: any) {
    const style = computeStyleSheet();
    return (
      <Modal
        useNativeDriverForBackdrop={true}
        statusBarTranslucent={true}
        animationInTiming={500}
        animationOutTiming={500}
        swipeDirection={['down']}
        hideModalContentWhileAnimating={true}
        onSwipeComplete={() => this.setState({ selectedSiteArea: null })}
        style={modalStyle.modalBottomHalf}
        isVisible={true}
        propagateSwipe={true}
        onBackButtonPress={() => this.setState({ selectedSiteArea: null })}
      >
        <SafeAreaView style={style.siteAreaDetailsModalContainer}>
          <View style={style.siteAreaDetailsModalHeader}>
            <TouchableOpacity onPress={() => this.setState({ selectedSiteArea: null })}>
              <Icon size={scale(37)} margin={scale(8)} style={style.closeIcon} as={EvilIcons} name={'close'} />
            </TouchableOpacity>
          </View>
          <View style={{flexGrow: 1, flexShrink: 1, flexBasis: 'auto'}}>
            <SiteAreaComponent
              siteArea={siteAreaSelected}
              navigation={navigation}
              onNavigate={() => this.setState({ selectedSiteArea: null })}
              containerStyle={[{width: '95%'}]}
            />
          </View>
        </SafeAreaView>
      </Modal>
    );

/*    if (Platform.OS === 'ios') {
      return (
        <Modal style={modalStyle.modalBottomHalf} isVisible={this.state.visible} onBackdropPress={() => this.setState({ visible: false })}>
          <Modalize alwaysOpen={175} modalStyle={modalStyle.modalContainer}>
            <SiteAreaComponent siteArea={siteAreaSelected} navigation={navigation} onNavigate={() => this.setState({ visible: false })} />
          </Modalize>
        </Modal>
      );
    } else {
      return (
        <Modal style={modalStyle.modalBottomHalf} isVisible={this.state.visible} onBackdropPress={() => this.setState({ visible: false })}>
          <View style={modalStyle.modalContainer}>
            <ScrollView>
              <SiteAreaComponent siteArea={siteAreaSelected} navigation={navigation} onNavigate={() => this.setState({ visible: false })} />
            </ScrollView>
          </View>
        </Modal>
      );
    }*/
  }

  public render() {
    const style = computeStyleSheet();
    const modalStyle = computeModalStyle();
    const { navigation } = this.props;
    const { loading, skip, count, showMap, selectedSiteArea, siteAreas, refreshing } = this.state;
    return (
      <View style={style.container}>
        <HeaderComponent
          navigation={navigation}
          title={this.site?.name}
          subTitle={count > 0 ? `(${I18nManager.formatNumber(count)} ${count > 1 ? I18n.t('siteAreas.siteAreas') : I18n.t('siteAreas.siteArea')})` : null}
        />
        <View style={style.content}>
          {this.renderFilters()}
          {this.renderFabs()}
          {selectedSiteArea && this.buildModal(navigation, selectedSiteArea, modalStyle)}
          {showMap ? this.renderMap() : (
            <View style={style.siteAreasContainer}>
              {loading ? <Spinner size={scale(30)} style={style.spinner} color="grey" /> : (
                <ItemsList<SiteArea>
                  skip={skip}
                  count={count}
                  onEndReached={this.onEndScroll}
                  renderItem={(siteArea: SiteArea) => <SiteAreaComponent containerStyle={[style.siteAreaComponentContainer]} siteArea={siteArea} navigation={this.props.navigation} />}
                  data={siteAreas}
                  manualRefresh={this.manualRefresh}
                  refreshing={refreshing}
                  emptyTitle={I18n.t('siteAreas.noSiteAreas')}
                  navigation={navigation}
                  limit={this.listLimit}
                />
              )}
            </View>
          )}
        </View>
      </View>
    );
  }

  private renderFabs() {
    const style = computeStyleSheet();
    const fabStyles = computeFabStyles();
    const { showMap, satelliteMap } = this.state;
    const isDarkModeEnabled = ThemeManager.getInstance()?.isThemeTypeIsDark();
    return (
      <SafeAreaView style={style.fabContainer}>
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
          onPress={() => this.setState({ showMap: !showMap, siteAreas: []}, () => this.refresh(true)) }
        >
          <Icon style={fabStyles.fabIcon} size={scale(18)} as={MaterialCommunityIcons} name={showMap ? 'format-list-bulleted' : 'map'} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  private renderMap() {
    const style = computeStyleSheet();
    const { siteAreas, satelliteMap } = this.state;
    const siteAreasWithGPSCoordinates = siteAreas.filter((siteArea) =>
      Utils.containsGPSCoordinates(siteArea.address.coordinates)
    );
    return (
      <View style={style.map}>
        <ClusterMap<SiteArea>
          items={siteAreasWithGPSCoordinates}
          satelliteMap={satelliteMap}
          renderMarker={(siteArea, index) => (
            <Marker
              key={`${siteArea.id}${index}${siteArea.name}`}
              tracksViewChanges={false}
              coordinate={{ longitude: siteArea.address.coordinates[0], latitude: siteArea.address.coordinates[1] }}
              title={siteArea.name}
              onPress={() => this.showMapSiteAreaDetail(siteArea)}
            >
              <Icon size={scale(40)} as={MaterialIcons} name={'location-pin'} style={Utils.computeSiteMarkerStyle(siteArea?.connectorStats)} />
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
        <SiteAreasFilters
          onFilterChanged={(newFilters: SiteAreasFiltersDef) => this.filterChanged(newFilters)}
          ref={(siteAreasFilters: SiteAreasFilters) => this.setScreenFilters(siteAreasFilters)}
        />
        <SimpleSearchComponent
          containerStyle={showMap ? style.mapSearchBarComponent : style.listSearchBarComponent}
          onChange={async (searchText) => this.search(searchText)} navigation={this.props.navigation} />
        {this.screenFilters?.canFilter() && (
          <TouchableOpacity
            onPress={() => this.screenFilters?.openModal()}
            style={showMap? [fabStyles.fab, style.mapFilterButton] : style.listFilterButton}>
            <Icon color={commonColors.textColor} size={scale(25)} as={MaterialCommunityIcons} name={areModalFiltersActive ? 'filter' : 'filter-outline'} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  private onMapRegionChangeComplete = (region: Region) => {
    if(region.latitude.toFixed(6) !== this.currentRegion.latitude.toFixed(6) ||
      region.longitude.toFixed(6) !== this.currentRegion.longitude.toFixed(6)) {
      this.currentRegion = region;
      this.refresh();
    }
  };

}
