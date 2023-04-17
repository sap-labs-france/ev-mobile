import I18n from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList from '../../../components/list/ItemsList';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import TransactionHistoryComponent from '../../../components/transaction/history/TransactionHistoryComponent';
import I18nManager from '../../../I18n/I18nManager';
import BaseScreen from '../../../screens/base-screen/BaseScreen';
import BaseProps from '../../../types/BaseProps';
import { TransactionDataResult } from '../../../types/DataResult';
import { HTTPAuthError } from '../../../types/HTTPError';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import computeStyleSheet from '../TransactionsStyles';
import TransactionsHistoryFilters, { TransactionsHistoryFiltersDef } from './TransactionsHistoryFilters';
import { TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

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
  filters?: TransactionsHistoryFiltersDef;
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

export default class TransactionsHistory extends BaseScreen<Props, State> {
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
      filters: {},
      maxTransactionDate: null,
      minTransactionDate: null
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    // When filters are enabled, first refresh is triggered via onFiltersChanged
    if (!this.screenFilters) {
      await this.refresh(true);
    }
    this.handleNavigationParameters();
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    const prevNavParams = JSON.stringify(prevProps.route?.params);
    const currentNavParams = JSON.stringify(this.props.route?.params);
    if (currentNavParams &&  currentNavParams !== prevNavParams) {
      this.handleNavigationParameters();
    }
  }

  private handleNavigationParameters(): void {
    const transactionID = Utils.getParamFromNavigation(this.props.route, 'TransactionID', null, true);
    if (transactionID) {
      this.props.navigation.navigate('TransactionDetailsTabs', {
        params: {transactionID},
        key: `${Utils.randomNumber()}`
      });
    }
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async getTransactions(paging: {skip: number, limit: number}, params?: {}): Promise<TransactionDataResult> {
    try {
      const { startDateTime, endDateTime, users, issuer } = this.state.filters;
      // Get active transaction
      params = params ?? {
        Statistics: 'history',
        UserID: users?.map(user => user?.id).join('|'),
        WithUser: true,
        StartDateTime: startDateTime?.toISOString(),
        EndDateTime: endDateTime?.toISOString(),
        Search: this.searchText,
        Issuer: !issuer
      };
      const transactions = await this.centralServerProvider.getTransactions(params, paging, ['-timestamp']);
      // Get total number of records
      if (transactions?.count === -1) {
        const transactionsNbrRecordsOnly = await this.centralServerProvider.getTransactions(params, Constants.ONLY_RECORD_COUNT);
        transactions.count = transactionsNbrRecordsOnly?.count;
        transactions.stats = transactionsNbrRecordsOnly?.stats;
      }
      return transactions;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        await Utils.handleHttpUnexpectedError(
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

  public async refresh(showSpinner = false) {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      const newState = showSpinner ? (Utils.isEmptyArray(this.state.transactions) ? { loading: true } : { refreshing: true}) : this.state;
      this.setState(newState, async () => {
        // Refresh All
        const allTransactions = await this.getTransactions(Constants.ONLY_RECORD_COUNT, {Statistics: 'history'});
        const allTransactionsStats = allTransactions?.stats;
        const minTransactionDate = allTransactionsStats?.firstTimestamp ? new Date(allTransactionsStats.firstTimestamp) : new Date();
        const maxTransactionDate = allTransactionsStats?.lastTimestamp ? new Date(allTransactionsStats.lastTimestamp) : new Date();
        const transactions = await this.getTransactions({skip, limit});
        // Set
        this.setState({
          loading: false,
          refreshing: false,
          transactions: transactions ? transactions.result : [],
          minTransactionDate,
          maxTransactionDate,
          count: transactions ? transactions.count : 0,
          isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
          isPricingActive: this.securityProvider ? this.securityProvider.isComponentPricingActive() : false
        });
      });
    }
  }

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const transactions = await this.getTransactions({skip: skip + Constants.PAGING_SIZE, limit});
      // Add sites
      this.setState((prevState) => ({
        transactions: transactions ? [...prevState.transactions, ...transactions.result] : prevState.transactions,
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  public async search (searchText: string) {
    this.searchText = searchText;
    this.refresh(true);
  };

  private manualRefresh() {
    this.refresh(true);
  }

  public render () {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, isAdmin, transactions, isPricingActive, skip, count, limit, refreshing } = this.state;
    return (
      <View style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => {
            this.setHeaderComponent(headerComponent);
          }}
          navigation={navigation}
          title={I18n.t('transactions.transactionsHistory')}
          subTitle={count > 0 ? `(${I18nManager.formatNumber(count)})` : null}
          sideBar={this.canOpenDrawer}
          containerStyle={style.headerContainer}
        />
        {this.renderFilters()}
        {loading ? <Spinner size={scale(30)} style={style.spinner} color="grey" /> : (
          <View style={style.content}>
            <ItemsList<Transaction>
              skip={skip}
              count={count}
              onEndReached={this.onEndScroll}
              renderItem={(transaction: Transaction) => (
                <TransactionHistoryComponent
                  navigation={navigation}
                  transaction={transaction}
                  containerStyle={[style.transactionComponentContainer]}
                  isAdmin={isAdmin}
                  isSiteAdmin={this.securityProvider?.isSiteAdmin(transaction.siteID)}
                  isPricingActive={isPricingActive}
                />
              )}
              data={transactions}
              manualRefresh={this.manualRefresh.bind(this)}
              refreshing={refreshing}
              emptyTitle={I18n.t('transactions.noTransactionsHistory')}
              navigation={navigation}
              limit={limit}
            />
          </View>
        )}
      </View>
    );
  }

  private onFiltersChanged(newFilters: TransactionsHistoryFiltersDef): void {
    this.setState({ filters: newFilters }, () => this.refresh(true));
  }

  private renderFilters() {
    const areModalFiltersActive = this.screenFilters?.areModalFiltersActive();
    const style = computeStyleSheet();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={style.filtersContainer}>
        <TransactionsHistoryFilters
          maxTransactionDate={this.state.maxTransactionDate}
          minTransactionDate={this.state.minTransactionDate}
          onFilterChanged={(newFilters: TransactionsHistoryFiltersDef) => this.onFiltersChanged(newFilters)}
          ref={(transactionsHistoryFilters: TransactionsHistoryFilters) => this.setScreenFilters(transactionsHistoryFilters, false)}
        />
        <SimpleSearchComponent containerStyle={style.searchBarComponent} onChange={async (searchText) => this.search(searchText)} navigation={this.props.navigation} />
        {this.screenFilters?.canFilter() && (
          <TouchableOpacity onPress={() => this.screenFilters?.openModal()}  style={style.filterButton}>
            <Icon color={commonColors.textColor} size={scale(25)} as={MaterialCommunityIcons} name={areModalFiltersActive ? 'filter' : 'filter-outline'} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
