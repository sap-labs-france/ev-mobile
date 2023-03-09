import I18n from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

import CarComponent from '../../components/car/CarComponent';
import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import Car from '../../types/Car';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import computeStyleSheet from './CarsStyles';
import computeTransactionStyles from '../transactions/TransactionsStyles'

import SelectableList, { SelectableProps, SelectableState } from '../base-screen/SelectableList';
import Orientation from 'react-native-orientation-locker';
import computeFabStyles from '../../components/fab/FabComponentStyles';
import CarsFilters, { CarsFiltersDef } from './CarsFilters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

interface State extends SelectableState<Car> {
  cars?: Car[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
  filters?: CarsFiltersDef;
}

export interface Props extends SelectableProps<Car> {
  userIDs?: string[];
}

export default class Cars extends SelectableList<Car> {
  public props: Props;
  public state: State;
  private searchText: string;

  public constructor(props: Props) {
    super(props);
    this.selectMultipleTitle = 'cars.selectCars';
    this.selectSingleTitle = 'cars.selectCar';
    this.singleItemTitle = I18n.t('cars.car');
    this.multiItemsTitle = I18n.t('cars.cars');
    this.state = {
      cars: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true,
      selectedItems: []
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ): void => {
    super.setState(state, callback);
  };

  public componentWillUnmount() {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public async componentDidFocus() {
    super.componentDidFocus();
    Orientation.lockToPortrait();
    await this.refresh(true);
  }

  public async getCars(searchText: string, skip: number, limit: number): Promise<DataResult<Car>> {
    const { isModal } = this.props;
    try {
      const userID = isModal ? this.props.userIDs?.join('|') : this.state.filters?.users?.map(user => user.id).join('|');
      const params = {
        Search: searchText,
        WithUser: true,
        UserID: userID
      };
      const cars = await this.centralServerProvider.getCars(params, { skip, limit }, ['-createdOn']);
      // Get total number of records
      if (cars?.count === -1) {
        const carsNbrRecordsOnly = await this.centralServerProvider.getCars(params, Constants.ONLY_RECORD_COUNT);
        cars.count = carsNbrRecordsOnly?.count;
      }
      return cars;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'cars.carUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  }

  public onEndScroll = async (): Promise<void> => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const cars = await this.getCars(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        cars: cars ? [...prevState.cars, ...cars.result] : prevState.cars,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public async refresh(showSpinner:boolean = false): Promise<void> {
    if (this.isMounted()) {
      const newState = showSpinner ? (Utils.isEmptyArray(this.state.cars) ? {loading: true} : {refreshing: true})  : this.state;
      this.setState(newState, async () => {
        const { skip, limit } = this.state;
        const { isModal, onContentUpdated } = this.props;
        // Refresh All
        const cars = await this.getCars(this.searchText, 0, skip + limit);
        const carsResult = cars ? cars.result : [];
        // Set
        this.setState({
          loading: false,
          cars: carsResult,
          count: cars ? cars.count : 0,
          refreshing: false
        }, isModal ? () => onContentUpdated() : () => null);
      });
    }
  }

  public async search(searchText: string): Promise<void> {
    this.searchText = searchText;
    this.refresh(true);
  };

  public render() {
    const transactionStyles = computeTransactionStyles();
    const style = computeStyleSheet();
    const { cars, count, skip, limit, refreshing, loading } = this.state;
    const { navigation, selectionMode, isModal } = this.props;
    const fabStyles = computeFabStyles();
    return (
      <View style={style.container}>
        {!isModal && (
          <SafeAreaView style={fabStyles.fabContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CarsNavigator', { screen: 'AddCar' })} style={fabStyles.fab}>
              <Icon style={fabStyles.fabIcon} size={scale((18))} as={MaterialCommunityIcons} name={'plus'} />
            </TouchableOpacity>
          </SafeAreaView>
        )}
        {!isModal && (
          <HeaderComponent
            title={this.buildHeaderTitle()}
            subTitle={this.buildHeaderSubtitle()}
            modalized={isModal}
            sideBar={!isModal && this.canOpenDrawer}
            navigation={this.props.navigation}
            containerStyle={style.headerContainer}
          />
        )}
        {this.renderFilters()}
        {loading ? <Spinner size={scale(30)} style={transactionStyles.spinner} color="grey" /> : (
          <View style={style.content}>
            <ItemsList<Car>
              data={cars}
              ref={this.itemsListRef}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              onSelect={this.onItemsSelected.bind(this)}
              selectionMode={selectionMode}
              renderItem={(item: Car, selected: boolean) => (
                <CarComponent
                  containerStyle={[style.carComponentContainer]}
                  navigation={navigation}
                  selected={selected}
                  car={item}
                />
              )}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh.bind(this)}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('cars.noCars')}
            />
          </View>
        )}
      </View>
    );
  }

  private onFilterChanged(newFilters: CarsFiltersDef) : void {
    this.setState({filters: newFilters}, () => this.refresh(true));
  }

  private renderFilters() {
    const style = computeStyleSheet();
    const { isModal } = this.props;
    const areModalFiltersActive = this.screenFilters?.areModalFiltersActive();
    return (
      <View style={style.filtersContainer}>
        {!isModal && (
          <CarsFilters
            onFilterChanged={(newFilters: CarsFiltersDef) => this.onFilterChanged(newFilters)}
            ref={(chargingStationsFilters: CarsFilters) => this.setScreenFilters(chargingStationsFilters)}
          />
        )}
        <SimpleSearchComponent containerStyle={style.searchBarComponent} onChange={async (searchText) => this.search(searchText)} navigation={this.props.navigation} />
        {!isModal && this.screenFilters?.canFilter() && (
          <TouchableOpacity onPress={() => this.screenFilters?.openModal()}  style={style.filterButton}>
            <Icon size={scale(25)} style={style.filterButtonIcon} as={MaterialCommunityIcons} name={areModalFiltersActive ? 'filter' : 'filter-outline'} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
