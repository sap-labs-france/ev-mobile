import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container, Icon, Spinner } from 'native-base';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

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
import { FAB } from 'react-native-paper';

interface State extends SelectableState<Car> {
  cars?: Car[];
  skip?: number;
  limit?: number;
  refreshing?: boolean;
  loading?: boolean;
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

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.refresh();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public async componentDidFocus() {
    Orientation.lockToPortrait();
    this.setState({ refreshing: true });
    await this.refresh();
  }

  public async getCars(searchText: string, skip: number, limit: number): Promise<DataResult<Car>> {
    try {
      const params = {
        Search: searchText,
        WithUser: true,
        UserID: this.props.userIDs?.join('|')
      };
      const cars = await this.centralServerProvider.getCars(params, { skip, limit }, ['-createdOn']);
      // Get total number of records
      if (cars.count === -1) {
        const carsNbrRecordsOnly = await this.centralServerProvider.getCars(params, Constants.ONLY_RECORD_COUNT);
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

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('HomeNavigator', { screen: 'Home' });
    // Do not bubble up
    return true;
  };

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

  public async refresh(): Promise<void> {
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const cars = await this.getCars(this.searchText, 0, skip + limit);
      const carsResult = cars ? cars.result : [];
      // Set
      this.setState({
        loading: false,
        cars: carsResult,
        count: cars ? cars.count : 0,
        refreshing: false
      });
    }
  }

  public search = async (searchText: string): Promise<void> => {
    this.setState({ refreshing: true });
    this.searchText = searchText;
    await this.refresh();
  };

  public render() {
    const transactionStyles = computeTransactionStyles();
    const style = computeStyleSheet();
    const { cars, count, skip, limit, refreshing, loading } = this.state;
    const { navigation, selectionMode, isModal } = this.props;
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <Container style={transactionStyles.container}>
        {!isModal && (
          <FAB color={commonColors.light} onPress={() => navigation.navigate('CarsNavigator', { screen: 'AddCar' })} icon={'plus'} style={style.fab} />
        )}
        <HeaderComponent
          title={this.buildHeaderTitle()}
          subTitle={this.buildHeaderSubtitle()}
          navigation={this.props.navigation}
          leftAction={isModal ? null : this.onBack}
          leftActionIcon={isModal ? null : 'navigate-before'}
          displayTenantLogo={false}
          rightAction={isModal ? null : () => { navigation.dispatch(DrawerActions.openDrawer()); return true; }}
          rightActionIcon={isModal ? null : 'menu'}
        />
        <View style={transactionStyles.searchBar}>
          <SimpleSearchComponent onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
        </View>
        {loading ? (
          <Spinner style={transactionStyles.spinner} color="grey" />
        ) : (
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
                  navigation={navigation}
                  selected={selected}
                  car={item}
                />
              )}
              refreshing={refreshing}
              manualRefresh={this.manualRefresh}
              onEndReached={this.onEndScroll}
              emptyTitle={I18n.t('cars.noCars')}
            />
          </View>
        )}
      </Container>
    );
  }
}
