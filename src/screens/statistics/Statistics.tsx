import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, Icon, Left, Spinner, Text } from 'native-base';
import React from 'react';

import computeCardStyleSheet from '../../CardStyles';
import HeaderComponent from '../../components/header/HeaderComponent';
import I18nManager from '../../I18n/I18nManager';
import ProviderFactory from '../../provider/ProviderFactory';
import TransactionsHistoryFilters, { TransactionsHistoryFiltersDef } from '../../screens/transactions/history/TransactionsHistoryFilters';
import BaseProps from '../../types/BaseProps';
import { TransactionDataResult } from '../../types/DataResult';
import { GlobalFilters } from '../../types/Filter';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './StatisticsStyles';

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  totalNumberOfSession?: number;
  totalConsumptionWattHours?: number;
  totalDurationSecs?: number;
  totalInactivitySecs?: number;
  totalPrice?: number;
  priceCurrency?: string;
  isPricingActive?: boolean;
  showFilter?: boolean;
  initialFilters?: TransactionsHistoryFiltersDef;
  filters?: TransactionsHistoryFiltersDef;
}

export default class Statistics extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      totalNumberOfSession: 0,
      totalConsumptionWattHours: 0,
      totalDurationSecs: 0,
      totalInactivitySecs: 0,
      totalPrice: 0,
      isPricingActive: false,
      showFilter: false,
      initialFilters: {},
      filters: {}
    };
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

  public refresh = async () => {
    const { filters } = this.state;
    // Get the ongoing Transaction stats
    const transactionsStats = await this.getTransactionsStats(filters.startDateTime, filters.endDateTime);
    // Retrieve all the transactions for the current userID
    const allTransactions = await this.getTransactionsStats(null, null);
    const allTransactionsStats = allTransactions.stats;
    const minTransactionDate = allTransactionsStats.firstTimestamp ? new Date(allTransactions.stats.firstTimestamp) : new Date();
    const maxTransactionDate = allTransactionsStats.lastTimestamp ? new Date(allTransactions.stats.lastTimestamp) : new Date();
    // Set
    this.setState({
      initialFilters: { ...this.state.initialFilters, minTransactionDate, maxTransactionDate },
      totalNumberOfSession: transactionsStats.stats.count,
      totalConsumptionWattHours: transactionsStats.stats.totalConsumptionWattHours,
      totalDurationSecs: transactionsStats.stats.totalDurationSecs,
      totalInactivitySecs: transactionsStats.stats.totalInactivitySecs,
      totalPrice: transactionsStats.stats.totalPrice,
      isPricingActive: this.securityProvider?.isComponentPricingActive(),
      loading: false
    });
  };

  public getTransactionsStats = async (startDateTime: Date, endDateTime: Date): Promise<TransactionDataResult> => {
    try {
      // Get active transaction
      const transactions = await this.centralServerProvider.getTransactions(
        {
          Statistics: 'history',
          UserID: this.state.filters.userID,
          StartDateTime: startDateTime ? startDateTime.toISOString() : null,
          EndDateTime: endDateTime ? endDateTime.toISOString() : null
        },
        Constants.ONLY_RECORD_COUNT
      );
      return transactions;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionStatsUnexpectedError',
          this.props.navigation,
          this.refresh
        );
      }
    }
    return null;
  };

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.navigate('HomeNavigator');
    // Do not bubble up
    return true;
  };

  public render = () => {
    const style = computeStyleSheet();
    const cardStyle = computeCardStyleSheet();
    const { navigation } = this.props;
    const {
      loading,
      totalNumberOfSession,
      totalConsumptionWattHours,
      initialFilters,
      filters,
      totalDurationSecs,
      totalInactivitySecs,
      totalPrice,
      isPricingActive
    } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => this.setHeaderComponent(headerComponent)}
          navigation={navigation}
          title={I18n.t('home.statistics')}
          leftAction={() => this.onBack()}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
          filters={filters}
        />
        {loading ? (
          <Spinner style={style.spinner} color="grey" />
        ) : (
          <Content style={style.content}>
            <TransactionsHistoryFilters
              initialFilters={initialFilters}
              onFilterChanged={(newFilters: TransactionsHistoryFiltersDef) =>
                this.setState({ filters: newFilters }, async () => this.refresh())
              }
              ref={(transactionsHistoryFilters: TransactionsHistoryFilters) => this.setScreenFilters(transactionsHistoryFilters)}
            />
            <Content style={cardStyle.cards}>
              <Card style={cardStyle.card}>
                <CardItem style={cardStyle.cardItem}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="history" />
                    <Body>
                      <Text style={cardStyle.cardText}>
                        {I18n.t('home.numberOfSessions', { nbrSessions: I18nManager.formatNumber(totalNumberOfSession) })}
                      </Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.numberOfSessionsNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card style={cardStyle.card}>
                <CardItem style={cardStyle.cardItem}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="FontAwesome" name="bolt" />
                    <Body>
                      <Text style={cardStyle.cardText}>
                        {I18n.t('home.totalConsumptiom', {
                          totalConsumptiom: I18nManager.formatNumber(Math.round(totalConsumptionWattHours / 1000))
                        })}
                      </Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.totalConsumptiomNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card style={cardStyle.card}>
                <CardItem style={cardStyle.cardItem}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="timer" />
                    <Body>
                      <Text style={cardStyle.cardText}>
                        {I18n.t('home.totalDuration', { totalDuration: Utils.formatDuration(totalDurationSecs) })}
                      </Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.totalDurationNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card style={cardStyle.card}>
                <CardItem style={cardStyle.cardItem}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="timer-off" />
                    <Body>
                      <Text style={cardStyle.cardText}>
                        {I18n.t('home.totalInactivity', {
                          totalInactivity: Utils.formatDuration(totalInactivitySecs),
                          totalInactivityPercent: I18nManager.formatPercentage(totalInactivitySecs / totalDurationSecs)
                        })}
                      </Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.totalInactivityNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              {isPricingActive && (
                <Card style={cardStyle.card}>
                  <CardItem style={cardStyle.cardItem}>
                    <Left>
                      <Icon style={cardStyle.cardIcon} type="FontAwesome" name="money" />
                      <Body>
                        <Text style={cardStyle.cardText}>
                          {I18n.t('home.totalPrice', { totalPrice: I18nManager.formatCurrency(totalPrice) })}
                        </Text>
                        <Text note style={cardStyle.cardNote}>
                          {I18n.t('home.totalPriceNote')}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
            </Content>
          </Content>
        )}
      </Container>
    );
  };
}
