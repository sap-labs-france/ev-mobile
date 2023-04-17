import I18n from 'i18n-js';
import { Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';

import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import Car, { CarCatalog } from '../../types/Car';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import computeTransactionStyles from '../transactions/TransactionsStyles';
import computeCarsStyles from './CarsStyles';

import SelectableList, { SelectableProps, SelectableState } from '../base-screen/SelectableList';
import Orientation from 'react-native-orientation-locker';
import CarCatalogComponent from '../../components/car/CarCatalogComponent';
import { scale } from 'react-native-size-matters';

interface State extends SelectableState<Car> {
  cars?: CarCatalog[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
}

export default class CarCatalogs extends SelectableList<Car> {
  public props: SelectableProps<Car>;
  public state: State;
  private searchText: string;

  public constructor(props: SelectableProps<Car>) {
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
    state: State | ((prevState: Readonly<State>, props: Readonly<SelectableProps<Car>>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ): void => {
    super.setState(state, callback);
  };

  public componentWillUnmount() {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public async getCarCatalog(searchText: string, skip: number, limit: number): Promise<DataResult<CarCatalog>> {
    try {
      const params = {
        Search: searchText
      };
      const cars = await this.centralServerProvider.getCarCatalog(params, { skip, limit }, ['vehicleMake|vehicleModel|vehicleModelVersion']);
      // Get total number of records
      if (cars.count === -1) {
        const carsNbrRecordsOnly = await this.centralServerProvider.getCarCatalog(params, Constants.ONLY_RECORD_COUNT);
        cars.count = carsNbrRecordsOnly.count;
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
      const cars = await this.getCarCatalog(this.searchText, skip + Constants.PAGING_SIZE, limit);
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
      const { skip, limit } = this.state;
      const { isModal, onContentUpdated } = this.props;
      this.setState({ refreshing: true });
      // Refresh All
      const cars = await this.getCarCatalog(this.searchText, 0, skip + limit);
      const carsResult = cars ? cars.result : [];
      // Set
      this.setState({
        loading: false,
        refreshing: false,
        cars: carsResult,
        count: cars ? cars.count : 0
      }, isModal ? () => onContentUpdated() : () => null);
    }
  }

  public search = async (searchText: string): Promise<void> => {
    this.searchText = searchText;
    await this.refresh();
  };

  public render() {
    const transactionStyles = computeTransactionStyles();
    const carsStyles = computeCarsStyles();
    const { cars, count, skip, limit, refreshing, loading } = this.state;
    const { navigation, selectionMode, isModal } = this.props;
    return (
      <View style={transactionStyles.container}>
        {!isModal && (
          <HeaderComponent
            title={this.buildHeaderTitle()}
            subTitle={this.buildHeaderSubtitle()}
            modalized={isModal}
            backArrow={!isModal}
            navigation={this.props.navigation}
          />
        )}
        <View style={carsStyles.filtersContainer}>
          <SimpleSearchComponent containerStyle={carsStyles.searchBarComponent} onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
        </View>
        {loading ? (
          <Spinner size={scale(30)} style={transactionStyles.spinner} color="grey" />
        ) : (
          <View style={carsStyles.content}>
            <ItemsList<CarCatalog>
              data={cars}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              onSelect={this.onItemsSelected.bind(this)}
              selectionMode={selectionMode}
              renderItem={(item: CarCatalog, selected: boolean) => (
                <CarCatalogComponent
                  containerStyle={[carsStyles.carComponentContainer]}
                  navigation={navigation}
                  selected={selected}
                  carCatalog={item}
                />
              )}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('cars.noCars')}
            />
          </View>
        )}
      </View>
    );
  }
}
