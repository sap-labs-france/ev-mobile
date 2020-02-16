import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../../components/list/footer/ListFooterComponent';
import TransactionInProgressComponent from '../../../components/transaction/in-progress/TransactionInProgressComponent';
import I18nManager from '../../../I18n/I18nManager';
import { StatisticsFiltersDef } from '../../../screens/statistics/StatisticsFilters';
import BaseProps from '../../../types/BaseProps';
import { DataResult } from '../../../types/DataResult';
import { FilterGlobalInternalIDs } from '../../../types/Filter';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../TransactionsStyles';
import TransactionsInProgressFilters from './TransactionsInProgressFilters';

export interface Props extends BaseProps {
}

interface State {
  transactions?: Transaction[];
  loading?: boolean;
  refreshing?: boolean;
  userID?: string;
  skip?: number;
  limit?: number;
  count?: number;
  isPricingActive: boolean;
  isAdmin?: boolean;
  filters?: StatisticsFiltersDef;
}

export default class TransactionsInProgress extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private headerComponent: HeaderComponent;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      transactions: [],
      loading: true,
      refreshing: false,
      userID: null,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      isPricingActive: false,
      isAdmin: false,
      filters: {}
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async loadInitialFilters() {
    const userID = await SecuredStorage.loadFilterValue(FilterGlobalInternalIDs.MY_USER_FILTER);
    if (userID) {
      this.setState({
        userID,
        filters: {
          UserID: userID
        }
      });
    }
  }

  public async componentDidMount() {
    // Get initial filters
    await this.loadInitialFilters();
    await super.componentDidMount();
  }

  public getTransactionsInProgress = async (searchText: string, skip: number, limit: number): Promise<DataResult<Transaction>> => {
    try {
      // Get the Sites
      const transactions = await this.centralServerProvider.getTransactionsActive(
        { ...this.state.filters, Search: searchText }, { skip, limit });
      // Check
      if (transactions.count === -1) {
        // Request nbr of records
        const transactionsNbrRecordsOnly = await this.centralServerProvider.getTransactionsActive(
          { ...this.state.filters, Search: searchText }, Constants.ONLY_RECORD_COUNT_PAGING
        );
        // Set
        transactions.count = transactionsNbrRecordsOnly.count;
      }
      return transactions;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    return null;
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate({ routeName: 'HomeNavigator' });
    // Do not bubble up
    return true;
  };

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const transactions = await this.getTransactionsInProgress(this.searchText, 0, skip + limit);
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Set
      this.setState({
        loading: false,
        transactions: transactions ? transactions.result : [],
        count: transactions ? transactions.count : 0,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false,
        isPricingActive: securityProvider.isComponentPricingActive()
      });
    }
  };

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
    // No: get next sites
      const transactions = await this.getTransactionsInProgress(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState) => ({
        transactions: transactions ? [...prevState.transactions, ...transactions.result] : prevState.transactions,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public search = async (searchText: string) => {
    this.searchText = searchText;
    await this.refresh();
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, isAdmin, transactions, isPricingActive, userID,
      skip, count, limit } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => {
            this.headerComponent = headerComponent;
          }}
          navigation={navigation}
          title={I18n.t('transactions.transactionsInProgress')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('transactions.transactions')}` : null}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
        />
        {loading ? (
          <Spinner style={style.spinner} />
        ) : (
          <View style={style.content}>
            {isAdmin &&
              <TransactionsInProgressFilters
                initialFilters={{
                  UserID: userID ? userID : null
                }}
                onFilterChanged={(filters: any) => this.setState({ filters }, () => this.refresh())}
                ref={(transactionsInProgressFilters: TransactionsInProgressFilters) => {
                  if (this.headerComponent && transactionsInProgressFilters && transactionsInProgressFilters.getFilterContainerComponent()) {
                    this.headerComponent.setFilterContainerComponent(transactionsInProgressFilters.getFilterContainerComponent());
                  }
                }}
              />
            }
            <FlatList
              data={transactions}
              renderItem={({ item }) => (
                <TransactionInProgressComponent
                  transaction={item}
                  navigation={navigation}
                  isAdmin={isAdmin}
                  isPricingActive={isPricingActive}
                />
              )}
              keyExtractor={(item) => `${item.id}`}
              refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
              onEndReached={this.onEndScroll}
              onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
              ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
              ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('transactions.noTransactionsInProgress')} />}
            />
          </View>
        )}
      </Container>
    );
  };
}
