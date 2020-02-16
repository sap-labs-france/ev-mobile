import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import TransactionHistoryComponent from '../../../components/transaction/history/TransactionHistoryComponent';
import I18nManager from '../../../I18n/I18nManager';
import { StatisticsFiltersDef } from '../../../screens/statistics/StatisticsFilters';
import BaseProps from '../../../types/BaseProps';
import { TransactionDataResult } from '../../../types/DataResult';
import { FilterGlobalInternalIDs } from '../../../types/Filter';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../TransactionsStyles';
import TransactionsHistoryFilters from './TransactionsHistoryFilters';

export interface Props extends BaseProps {
}

interface State {
  transactions?: Transaction[];
  loading?: boolean,
  refreshing?: boolean;
  userID?: string;
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  limit?: number;
  count?: number;
  isPricingActive?: boolean;
  isAdmin?: boolean;
  filters?: StatisticsFiltersDef;
}

export default class TransactionsHistory extends BaseAutoRefreshScreen<Props, State> {
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
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0,
      userID: null,
      startDate: null,
      endDate: null,
      isPricingActive: false,
      isAdmin: false,
      filters: {}
    };
    // Set refresh period
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
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

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getTransactions = async (searchText: string, skip: number, limit: number): Promise<TransactionDataResult> => {
    try {
      // Get active transaction
      const transactions = await this.centralServerProvider.getTransactions(
        { Statistics: 'history', ...this.state.filters, Search: searchText },
        { skip, limit }
      );
      // Check
      if (transactions.count === -1) {
        // Request nbr of records
        const transactionsNbrRecordsOnly = await this.centralServerProvider.getTransactions(
          { Statistics: 'history', ...this.state.filters, Search: searchText }, Constants.ONLY_RECORD_COUNT_PAGING
        );
        // Set
        transactions.count = transactionsNbrRecordsOnly.count;
        transactions.stats = transactionsNbrRecordsOnly.stats;
      }
        return transactions;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
      }
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
      // Set
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Refresh All
      const transactions = await this.getTransactions(this.searchText, 0, skip + limit);
      // Set
      this.setState({
        loading: false,
        transactions: transactions ? transactions.result : [],
        startDate: this.state.startDate ? this.state.startDate : transactions.stats.firstTimestamp ? new Date(transactions.stats.firstTimestamp) : new Date(),
        endDate: this.state.endDate ? this.state.endDate : transactions.stats.lastTimestamp ? new Date(transactions.stats.lastTimestamp) : new Date(),
        count: transactions ? transactions.count : 0,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false,
        isPricingActive: securityProvider ? securityProvider.isComponentPricingActive() : false
      });
    }
  };

  public onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count || count === -1) {
      // No: get next sites
      const transactions = await this.getTransactions(this.searchText, skip + Constants.PAGING_SIZE, limit);
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
      startDate, endDate, skip, count, limit } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => {
            this.headerComponent = headerComponent;
          }}
          navigation={navigation}
          title={I18n.t('transactions.transactionsHistory')}
          subTitle={count > 0 ? `${I18nManager.formatNumber(count)} ${I18n.t('transactions.transactions')}` : null}
          leftAction={this.onBack}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
        />
        <SimpleSearchComponent
          onChange={(searchText) => this.search(searchText)}
          navigation={navigation}
        />
          {loading ? (
            <Spinner style={style.spinner} />
          ) : (
            <View style={style.content}>
              <TransactionsHistoryFilters
                initialFilters={{
                  UserID: userID ? userID : null,
                  StartDateTime: startDate ? startDate.toISOString() : null,
                  EndDateTime: endDate ? endDate.toISOString() : null
                }}
                onFilterChanged={(filters: any) => this.setState({ filters }, () => this.refresh())}
                ref={(transactionsHistoryFilters: TransactionsHistoryFilters) => {
                  if (this.headerComponent && transactionsHistoryFilters && transactionsHistoryFilters.getFilterContainerComponent()) {
                    this.headerComponent.setFilterContainerComponent(transactionsHistoryFilters.getFilterContainerComponent());
                  }
                }}
              />
              <FlatList
                data={transactions}
                renderItem={({ item }) => (
                  <TransactionHistoryComponent
                    navigation={navigation}
                    transaction={item}
                    isAdmin={isAdmin}
                    isPricingActive={isPricingActive}
                  />
                )}
                keyExtractor={(item) => `${item.id}`}
                refreshControl={<RefreshControl onRefresh={this.manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this.onEndScroll}
                onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
                ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
                ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={I18n.t('transactions.noTransactionsHistory')} />}
              />
            </View>
          )}
      </Container>
    );
  };
}
