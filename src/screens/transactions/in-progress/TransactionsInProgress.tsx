import I18n from 'i18n-js';
import { Container, Spinner, View } from 'native-base';
import React from 'react';
import { FlatList, Platform, RefreshControl } from 'react-native';
import BackgroundComponent from '../../../components/background/BackgroundComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import ListEmptyTextComponent from '../../../components/list/empty-text/ListEmptyTextComponent';
import ListFooterComponent from '../../../components/list/footer/ListFooterComponent';
import SimpleSearchComponent from '../../../components/search/simple/SimpleSearchComponent';
import TransactionInProgressComponent from '../../../components/transaction/in-progress/TransactionInProgressComponent';
import BaseProps from '../../../types/BaseProps';
import { DataResult } from '../../../types/DataResult';
import Transaction from '../../../types/Transaction';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from '../TransactionsCommonStyles';

export interface Props extends BaseProps {
}

interface State {
  transactions?: Transaction[];
  loading?: boolean;
  refreshing?: boolean;
  skip?: number;
  limit?: number;
  count?: number;
  isPricingActive: boolean;
  isAdmin?: boolean;
}

export default class TransactionsInProgress extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;

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
      isPricingActive: false,
      isAdmin: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getTransactionsInProgress = async (searchText: string, skip: number, limit: number): Promise<DataResult<Transaction>> => {
    let transactions;
    try {
      // Get the Sites
      transactions = await this.centralServerProvider.getTransactionsActive({ Search: searchText }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return transactions;
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
      this.setState((prevState, props) => ({
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
    const { loading, isAdmin, transactions, isPricingActive, skip, count, limit } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t('transactions.transactionsInProgress')}
            leftAction={this.onBack}
            leftActionIcon={'navigate-before'}
            rightAction={navigation.openDrawer}
            rightActionIcon={'menu'}
          />
          {/* <SimpleSearchComponent
            onChange={(searchText) => this.search(searchText)}
            navigation={navigation}
          /> */}
          <View style={style.content}>
            {loading ? (
              <Spinner style={style.spinner} />
            ) : (
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
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  };
}
