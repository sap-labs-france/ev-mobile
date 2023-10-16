import I18n from 'i18n-js';
import { Icon, View, Spinner } from 'native-base';
import React from 'react';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList, { ItemSelectionMode } from '../../../components/list/ItemsList';
import computeListItemCommonStyles from '../../../components/list/ListItemCommonStyle';
import SelectableList, { SelectableProps, SelectableState } from '../../../screens/base-screen/SelectableList';
import ChargingStation from '../../../types/ChargingStation';
import { DataResult } from '../../../types/DataResult';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './ReservableChargingStationsStyles';
import ChargingStationsFilters, { ChargingStationsFiltersDef } from './ChargingStationsFilters';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import { TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ReservableChargingStationComponent from '../../../components/charging-station/ReservableChargingStationComponent';

export interface ReservableChargingStationsFiltersDef {
  fromDate?: Date;
  toDate?: Date;
  arrivalTime?: Date;
  departureTime?: Date;
  issuer?: boolean;
  WithSite?: boolean;
  WithSiteArea?: boolean;
}

export interface Props extends SelectableProps<ChargingStation> {
  filters?: ReservableChargingStationsFiltersDef;
}

export interface State extends SelectableState<ChargingStation> {
  chargingStations?: ChargingStation[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
  filters?: ReservableChargingStationsFiltersDef;
}

export default class ReservableChargingStations extends SelectableList<ChargingStation> {
  public static defaultProps: { selectionMode: ItemSelectionMode.NONE; isModal: false };
  public state: State;
  public props: Props;
  private searchText: string;

  public constructor(props: Props) {
    super(props);
    this.singleItemTitle = I18n.t('chargers.charger');
    this.multiItemsTitle = I18n.t('chargers.chargers');
    this.selectMultipleTitle = 'chargers.selectChargers';
    this.selectSingleTitle = 'chargers.selectCharger';
    this.state = {
      chargingStations: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true,
      selectedItems: []
    };
  }

  public async getReservableChargingStations(searchText: string, skip: number, limit: number): Promise<DataResult<ChargingStation>> {
    try {
      const issuer = this.props?.filters?.hasOwnProperty('issuer') ? this.props.filters.issuer : !this.state.filters?.issuer;
      const params = {
        Search: searchText,
        Issuer: issuer,
        WithSite: this.props?.filters?.WithSite,
        WithSiteArea: this.props?.filters?.WithSiteArea,
        FromDate: this.props?.filters?.fromDate,
        ToDate: this.props?.filters?.toDate,
        ArrivalTime: this.props?.filters?.toDate,
        DepartureTime: this.props?.filters?.toDate
      };
      const chargingStations = await this.centralServerProvider.getReservableChargingStations(params, { skip, limit }, ['id']);
      if (chargingStations?.count === -1) {
        const chargingStationsNbrsRecordsOnly = await this.centralServerProvider.getReservableChargingStations(
          params,
          Constants.ONLY_RECORD_COUNT
        );
        chargingStations.count = chargingStationsNbrsRecordsOnly?.count;
      }
      return chargingStations;
    } catch (error) {
      if (!error.request) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'chargers.chargerUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
      return null;
    }
  }

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const chargingStations = await this.getReservableChargingStations(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        chargingStations: chargingStations ? [...prevState.chargingStations, ...chargingStations.result] : prevState.chargingStations,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async refresh(showSpinner = false): Promise<void> {
    if (this.isMounted()) {
      const newState = showSpinner
        ? { ...(Utils.isEmptyArray(this.state.chargingStations) ? { loading: true } : { refreshing: true }) }
        : this.state;
      this.setState(newState, async () => {
        const { skip, limit } = this.state;
        const { isModal, onContentUpdated } = this.props;
        // Refresh All
        const chargingStations = await this.getReservableChargingStations(this.searchText, 0, skip + limit);
        const chargingStationsResult = chargingStations ? chargingStations.result : [];
        // Set
        this.setState(
          {
            loading: false,
            refreshing: false,
            chargingStations: chargingStationsResult,
            count: chargingStations?.count ?? 0
          },
          isModal ? () => onContentUpdated() : () => null
        );
      });
    }
  }

  public async search(searchText: string): Promise<void> {
    this.searchText = searchText;
    await this.refresh(true);
  }

  public render(): React.ReactElement {
    const style = computeStyleSheet();
    const listItemCommonStyles = computeListItemCommonStyles();
    const { chargingStations, count, skip, limit, refreshing, loading } = this.state;
    const { navigation, isModal, selectionMode } = this.props;
    return (
      <View style={style.container}>
        {!isModal && (
          <HeaderComponent
            title={this.buildHeaderTitle()}
            subTitle={this.buildHeaderSubtitle()}
            modalized={isModal}
            sideBar={!isModal && this.canOpenDrawer}
            navigation={this.props.navigation}
            displayTenantLogo={false}
            containerStyle={style.headerContainer}
          />
        )}
        {this.renderFilters()}
        {loading ? (
          <Spinner size={scale(30)} style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <ItemsList<ChargingStation>
              ref={this.itemsListRef}
              selectionMode={selectionMode}
              onSelect={this.onItemsSelected.bind(this)}
              data={chargingStations}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              renderItem={(item: ChargingStation, selected: boolean) => (
                <ReservableChargingStationComponent
                  chargingStation={item}
                  containerStyle={[style.chargingStationComponentContainer, selected && listItemCommonStyles.outlinedSelected]}
                  selected={selected}
                  navigation={navigation}
                />
              )}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh.bind(this)}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('chargers.noChargers')}
            />
          </View>
        )}
      </View>
    );
  }

  private onFiltersChanged(newFilters: ChargingStationsFilters): void {
    this.setState({ filters: newFilters }, async () => this.refresh(true));
  }

  private renderFilters(): React.ReactElement {
    const areModalFiltersActive = this.screenFilters?.areModalFiltersActive();
    const { isModal } = this.props;
    const style = computeStyleSheet();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={style.filtersContainer}>
        {!isModal && (
          <ChargingStationsFilters
            onFilterChanged={(newFilters: ChargingStationsFiltersDef) => this.onFiltersChanged(newFilters)}
            ref={(chargingStationsFilters: ChargingStationsFilters) => this.setScreenFilters(chargingStationsFilters, false)}
          />
        )}
        <SimpleSearchComponent
          containerStyle={style.searchBarComponent}
          onChange={async (searchText) => this.search(searchText)}
          navigation={this.props.navigation}
        />
        {!isModal && this.screenFilters?.canFilter() && (
          <TouchableOpacity onPress={() => this.screenFilters?.openModal()} style={style.filterButton}>
            <Icon
              size={scale(25)}
              color={commonColors.textColor}
              as={MaterialCommunityIcons}
              name={areModalFiltersActive ? 'filter' : 'filter-outline'}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
