import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container, Spinner } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import I18nManager from '../../I18n/I18nManager';
import CarComponent from '../../components/car/CarComponent';
import HeaderComponent from '../../components/header/HeaderComponent';
import ItemsList from '../../components/list/ItemsList';
import SimpleSearchComponent from '../../components/search/simple/SimpleSearchComponent';
import BaseProps from '../../types/BaseProps';
import Car from '../../types/Car';
import { DataResult } from '../../types/DataResult';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../transactions/TransactionsStyles';

interface State {
  cars?: Car[];
  skip?: number;
  limit?: number;
  count?: number;
  refreshing?: boolean;
  loading?: boolean;
}

export interface Props extends BaseProps {}

export default class Cars extends BaseAutoRefreshScreen<Props, State> {
  public props: Props;
  public state: State;
  private searchText: string;

  public constructor(props: Props) {
    super(props);
    this.state = {
      cars: [],
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      refreshing: false,
      loading: true
    };
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ): void => {
    super.setState(state, callback);
  };

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
  }

  public async getCars(searchText: string, skip: number, limit: number): Promise<DataResult<Car>> {
    try {
      const cars = await this.centralServerProvider.getCars(
        {
          Search: searchText,
          WithUsers: true
        },
        { skip, limit }
      );
      if (cars.count === -1) {
        // Request nbr of records
        const carsNbrRecordsOnly = await this.centralServerProvider.getCars(
          {
            Search: searchText,
            WithUsers: true
          },
          Constants.ONLY_RECORD_COUNT
        );
        // Set
        cars.count = carsNbrRecordsOnly.count;
      }
      return cars;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'cars.carUnexpectedError', this.props.navigation, this.refresh);
      }
    }
    return null;
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('HomeNavigator');
    // Do not bubble up
    return true;
  };

  public onEndScroll = async (): Promise<void> => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const cars = await this.getCars(this.searchText, +Constants.PAGING_SIZE, limit);
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
        count: cars ? cars.count : 0
      });
    }
  }

  public search = async (searchText: string): Promise<void> => {
    this.searchText = searchText;
    await this.refresh();
  };

  public render() {
    const style = computeStyleSheet();
    const { cars, count, skip, limit, refreshing, loading } = this.state;
    const { navigation } = this.props;
    return (
      <Container style={style.container}>
        <HeaderComponent
          title={I18n.t('sidebar.cars')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('cars.cars')}` : null}
          navigation={this.props.navigation}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
        />
        <SimpleSearchComponent onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <ItemsList<Car>
              data={cars}
              navigation={navigation}
              count={count}
              limit={limit}
              skip={skip}
              renderItem={(item: Car, selected: boolean) => <CarComponent navigation={navigation} selected={selected} car={item} />}
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
