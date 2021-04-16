import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList from '../../../components/list/ItemsList';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import TransactionHistoryComponent from '../../../components/transaction/history/TransactionHistoryComponent';
import I18nManager from '../../../I18n/I18nManager';
import ProviderFactory from '../../../provider/ProviderFactory';
import BaseProps from '../../../types/BaseProps';
import { TransactionDataResult } from '../../../types/DataResult';
import { GlobalFilters } from '../../../types/Filter';
import { HTTPAuthError } from '../../../types/HTTPError';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../TransactionsStyles';
import TransactionsHistoryFilters, { TransactionsHistoryFiltersDef } from './TransactionsHistoryFilters';

export interface Props extends BaseProps {}

interface State {
  transactions?: Transaction[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  isPricingActive?: boolean;
  isAdmin?: boolean;
  initialFilters?: TransactionsHistoryFiltersDef;
  filters?: TransactionsHistoryFiltersDef;
}

export default class TransactionsHistory extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;

  public constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      transactions: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      isPricingActive: false,
      isAdmin: false,
      initialFilters: {},
      filters: {}
    };
    // Set refresh period
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public async componentDidMount() {
    // Get initial filters
    await this.loadInitialFilters();
    await super.componentDidMount();
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async loadInitialFilters() {
    const centralServerProvider = await ProviderFactory.getProvider();
    const userID = await SecuredStorage.loadFilterValue(centralServerProvider.getUserInfo(), GlobalFilters.MY_USER_FILTER);
    const startDateTimeString = await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(),
      GlobalFilters.TRANSACTIONS_START_DATE_FILTER
    );
    const endDateTimeString = await SecuredStorage.loadFilterValue(
      centralServerProvider.getUserInfo(),
      GlobalFilters.TRANSACTIONS_END_DATE_FILTER
    );
    const startDateTime = startDateTimeString ? new Date(startDateTimeString) : null;
    const endDateTime = endDateTimeString ? new Date(endDateTimeString) : null;
    const initialFilters = {
      userID,
      startDateTime,
      endDateTime
    };
    this.setState({
      initialFilters,
      filters: initialFilters
    });
  }

  public async getTransactions(
    searchText: string,
    skip: number,
    limit: number,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<TransactionDataResult> {
    try {
      // Get active transaction
      const transactions = await this.centralServerProvider.getTransactions(
        {
          Statistics: 'history',
          UserID: this.state.filters.userID,
          StartDateTime: startDateTime ? startDateTime.toISOString() : null,
          EndDateTime: endDateTime ? endDateTime.toISOString() : null,
          Search: searchText
        },
        { skip, limit }
      );
      // Check
      if (transactions.count === -1) {
        // Request nbr of records
        const transactionsNbrRecordsOnly = await this.centralServerProvider.getTransactions(
          {
            Statistics: 'history',
            UserID: this.state.filters.userID,
            StartDateTime: startDateTime ? startDateTime.toISOString() : null,
            EndDateTime: endDateTime ? endDateTime.toISOString() : null,
            Search: searchText
          },
          Constants.ONLY_RECORD_COUNT
        );
        // Set
        transactions.count = transactionsNbrRecordsOnly.count;
        transactions.stats = transactionsNbrRecordsOnly.stats;
      }
      return transactions;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
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

  public async refresh() {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit, filters } = this.state;
      // Refresh All
      const transactions = await this.getTransactions(this.searchText, 0, skip + limit, filters.startDateTime, filters.endDateTime);
      // Retrieve all the transactions for the current userID
      const allTransactions = await this.getTransactions(this.searchText, 0, skip + limit, null, null);
      const allTransactionsStats = allTransactions.stats;
      const minTransactionDate = allTransactionsStats.firstTimestamp ? new Date(allTransactions.stats.firstTimestamp) : new Date();
      const maxTransactionDate = allTransactionsStats.lastTimestamp ? new Date(allTransactions.stats.lastTimestamp) : new Date();
      // Set
      this.setState({
        loading: false,
        transactions: transactions ? transactions.result : [],
        initialFilters: { ...this.state.initialFilters, minTransactionDate, maxTransactionDate },
        count: transactions ? transactions.count : 0,
        isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
        isPricingActive: this.securityProvider ? this.securityProvider.isComponentPricingActive() : false
      });
    }
  }

  public onEndScroll = async () => {
    const { count, skip, limit, filters } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const transactions = await this.getTransactions(
        this.searchText,
        skip + Constants.PAGING_SIZE,
        limit,
        filters.startDateTime,
        filters.endDateTime
      );
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
  };

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, isAdmin, transactions, isPricingActive, skip, count, limit, initialFilters, filters, refreshing } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => {
            this.setHeaderComponent(headerComponent);
          }}
          navigation={navigation}
          title={I18n.t('transactions.transactionsHistory')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('transactions.transactions')}` : null}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
          filters={filters}
        />
        <SimpleSearchComponent onChange={async (searchText) => this.search(searchText)} navigation={navigation} />
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <TransactionsHistoryFilters
              initialFilters={initialFilters}
              onFilterChanged={(newFilters: TransactionsHistoryFiltersDef) =>
                this.setState({ filters: newFilters }, async () => this.refresh())
              }
              ref={(transactionsHistoryFilters: TransactionsHistoryFilters) => this.setScreenFilters(transactionsHistoryFilters)}
            />
            <ItemsList<Transaction>
              skip={skip}
              count={count}
              onEndReached={this.onEndScroll}
              renderItem={(transaction: Transaction) => (
                <TransactionHistoryComponent
                  navigation={navigation}
                  transaction={transaction}
                  isAdmin={isAdmin}
                  isSiteAdmin={this.securityProvider?.isSiteAdmin(transaction.siteID)}
                  isPricingActive={isPricingActive}
                />
              )}
              data={transactions}
              manualRefresh={this.manualRefresh}
              refreshing={refreshing}
              emptyTitle={I18n.t('transactions.noTransactionsHistory')}
              navigation={navigation}
              limit={limit}
            />
          </View>
        )}
      </Container>
    );
  };
}
