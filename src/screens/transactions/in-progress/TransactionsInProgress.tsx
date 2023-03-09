import I18n from 'i18n-js';
import { Spinner } from 'native-base';
import React from 'react';

import HeaderComponent from '../../../components/header/HeaderComponent';
import ItemsList from '../../../components/list/ItemsList';
import TransactionInProgressComponent
  from '../../../components/transaction/in-progress/TransactionInProgressComponent';
import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import { DataResult } from '../../../types/DataResult';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../TransactionsStyles';
import TransactionsInProgressFilters, { TransactionsInProgressFiltersDef } from './TransactionsInProgressFilters';
import { View } from 'react-native';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  transactions?: Transaction[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  isPricingActive: boolean;
  isAdmin?: boolean;
  hasSiteAdmin: boolean;
  filters?: TransactionsInProgressFiltersDef;
}

export default class TransactionsInProgress extends BaseAutoRefreshScreen<Props, State> {
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
      hasSiteAdmin: false,
      filters: {}
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

  private async handleNavigationParameters(): Promise<void> {
    const transactionID = Utils.getParamFromNavigation(this.props.route, 'TransactionID', null, true) as number;
    if (transactionID) {
      try {
        const transaction = await this.centralServerProvider.getTransaction(transactionID);
        this.props.navigation.navigate('ChargingStationConnectorDetailsTabs', {
          params: {
            chargingStationID: transaction?.chargeBoxID,
            connectorID: transaction?.connectorId
          },
          key: `${Utils.randomNumber()}`
        });
      } catch (e) {

      }
    }
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public getTransactionsInProgress = async (searchText: string, skip: number, limit: number): Promise<DataResult<Transaction>> => {
    try {
      const { users, issuer } = this.state.filters;
      const params = {
        UserID: users?.map(user => user.id).join('|'),
        Search: searchText,
        Issuer: !issuer
      };
      // Get the Transactions
      const transactions = await this.centralServerProvider.getTransactionsActive(params, { skip, limit }, ['-timestamp']);
      // Get total number of records
      if (transactions?.count === -1) {
        const transactionsNbrRecordsOnly = await this.centralServerProvider.getTransactionsActive(params, Constants.ONLY_RECORD_COUNT);
        transactions.count = transactionsNbrRecordsOnly?.count;
      }
      return transactions;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'transactions.transactionUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
    return null;
  };

  public async refresh(showSpinner = false) {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      const newState = showSpinner ? (Utils.isEmptyArray(this.state.transactions) ? {loading: true} : {refreshing: true}) : this.state;
      this.setState(newState, async () => {
        // Get transactions
        const transactions = await this.getTransactionsInProgress(this.searchText, 0, skip + limit);
        // Set
        this.setState({
          loading: false,
          refreshing: false,
          transactions: transactions ? transactions.result : [],
          count: transactions ? transactions.count : 0,
          isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
          hasSiteAdmin: this.securityProvider ? this.securityProvider.hasSiteAdmin() : false,
          isPricingActive: this.securityProvider ? this.securityProvider.isComponentPricingActive() : false
        });
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

  public async search(searchText: string) {
    this.searchText = searchText;
    await this.refresh(true);
  };

  private onFiltersChanged(newFilters: TransactionsInProgressFiltersDef): void {
    this.setState({filters: newFilters}, () => this.refresh(true));
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, isAdmin, transactions, isPricingActive, skip, count, limit, refreshing, filters } = this.state;
    return (
      <View style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => this.setHeaderComponent(headerComponent, true)}
          navigation={navigation}
          title={I18n.t('transactions.transactionsInProgress')}
          sideBar={this.canOpenDrawer}
          subTitle={count > 0 ? `(${I18nManager.formatNumber(count)})` : null}
          containerStyle={style.headerContainer}
        />
        <TransactionsInProgressFilters
          onFilterChanged={(newFilters: TransactionsInProgressFiltersDef) => this.onFiltersChanged(newFilters)}
          ref={(transactionsInProgressFilters: TransactionsInProgressFilters) => this.setScreenFilters(transactionsInProgressFilters, true)}
        />
        {(loading || !filters) ? (
          <Spinner size={scale(30)} style={style.spinner} color="grey" />
        ) : (
          <View style={style.content}>
            <ItemsList<Transaction>
              skip={skip}
              count={count}
              onEndReached={this.onEndScroll}
              renderItem={(transaction: Transaction) => (
                <TransactionInProgressComponent
                  transaction={transaction}
                  navigation={navigation}
                  isAdmin={isAdmin}
                  containerStyle={[style.transactionComponentContainer]}
                  isSiteAdmin={this.securityProvider?.isSiteAdmin(transaction.siteID)}
                  isPricingActive={isPricingActive}
                />
              )}
              data={transactions}
              manualRefresh={this.manualRefresh.bind(this)}
              refreshing={refreshing}
              emptyTitle={I18n.t('transactions.noTransactionsInProgress')}
              navigation={navigation}
              limit={limit}
            />
          </View>
        )}
      </View>
    );
  };
}
