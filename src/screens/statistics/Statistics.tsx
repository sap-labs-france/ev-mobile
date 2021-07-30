import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, Icon, Left, Spinner, Text } from 'native-base';
import React from 'react';

import computeCardStyleSheet from '../../CardStyles';
import HeaderComponent from '../../components/header/HeaderComponent';
import I18nManager, { NumberFormatCompactStyleEnum, NumberFormatNotationEnum, NumberFormatStyleEnum } from '../../I18n/I18nManager';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseScreen from '../../screens/base-screen/BaseScreen';
import TransactionsHistoryFilters, { TransactionsHistoryFiltersDef } from '../../screens/transactions/history/TransactionsHistoryFilters';
import BaseProps from '../../types/BaseProps';
import { TransactionDataResult } from '../../types/DataResult';
import { GlobalFilters } from '../../types/Filter';
import { HTTPAuthError } from '../../types/HTTPError';
import Constants from '../../utils/Constants';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import computeStyleSheet from './StatisticsStyles';
import { View } from 'react-native';
import StatisticsComponent from '../../components/statistics/StatisticsComponent';

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

export default class Statistics extends BaseScreen<Props, State> {
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
  }

  public async componentDidMount() {
    // Get initial filters
    await this.loadInitialFilters();
    await super.componentDidMount();
    await this.refresh();
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
      priceCurrency: transactionsStats.stats.currency,
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
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionStatsUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
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
    const { navigation } = this.props;
    const commonColors = Utils.getCurrentCommonColor();
    const {
      loading,
      totalNumberOfSession,
      totalConsumptionWattHours,
      initialFilters,
      filters,
      totalDurationSecs,
      totalInactivitySecs,
      priceCurrency,
      totalPrice,
      isPricingActive
    } = this.state;
    const totalConsumption = I18nManager.formatNumberWithCompacts(totalConsumptionWattHours, {
      notation: NumberFormatNotationEnum.COMPACT,
      compactStyle: NumberFormatCompactStyleEnum.METRIC,
      compactDisplay: 'short',
      maximumFractionDigits: 1,
      minimumFractionDigits: 1
    });
    const totalSessions = I18nManager.formatNumberWithCompacts(totalNumberOfSession, {
      notation: NumberFormatNotationEnum.COMPACT,
      compactStyle: NumberFormatCompactStyleEnum.FINANCE,
      compactDisplay: 'long',
      compactThreshold: 1000000
    });
    const totalCost = I18nManager.formatNumberWithCompacts(totalPrice, {
      notation: NumberFormatNotationEnum.COMPACT,
      compactStyle: NumberFormatCompactStyleEnum.FINANCE,
      compactDisplay: 'short',
      compactThreshold: 1000000,
      style: NumberFormatStyleEnum.CURRENCY,
      currency: priceCurrency,
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    });
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
            <View style={style.boxContainer}>
              <StatisticsComponent
                backgroundColor={style.sessions.backgroundColor.toString()}
                textColor={commonColors.light}
                value={totalSessions?.value}
                secondLine={I18n.t('transactions.transactions')}
                renderIcon={(iconStyle) => <Icon style={iconStyle} type="MaterialIcons" name="history" />}
                description={I18n.t('home.numberOfSessionsNote')}
                prefix={totalSessions?.compact}
              />
              <StatisticsComponent
                backgroundColor={style.energy.backgroundColor.toString()}
                textColor={commonColors.light}
                value={totalConsumption?.value}
                secondLine={'W.h'}
                renderIcon={(iconStyle) => <Icon name={'bolt'} type={'FontAwesome'} style={iconStyle} />}
                description={I18n.t('home.totalConsumptionNote')}
                prefix={totalConsumption?.compact}
                prefixWithSecondLine={true}
              />
              <StatisticsComponent
                backgroundColor={style.duration.backgroundColor.toString()}
                textColor={commonColors.light}
                value={Utils.formatDuration(totalDurationSecs)}
                renderIcon={(iconStyle) => <Icon style={iconStyle} type="MaterialIcons" name="timer" />}
                description={I18n.t('home.totalDurationNote')}
              />
              <StatisticsComponent
                backgroundColor={style.inactivity.backgroundColor.toString()}
                textColor={commonColors.light}
                secondLine={I18nManager.formatPercentage(totalInactivitySecs / totalDurationSecs)}
                value={Utils.formatDuration(totalInactivitySecs)}
                renderIcon={(iconStyle) => <Icon style={iconStyle} type="MaterialIcons" name="timer-off" />}
                description={I18n.t('home.totalInactivityNote')}
              />
              {isPricingActive && (
                <StatisticsComponent
                  backgroundColor={style.cost.backgroundColor.toString()}
                  textColor={commonColors.light}
                  secondLine={totalCost?.currency}
                  value={totalCost?.value}
                  prefix={totalCost?.compact}
                  prefixWithSecondLine={true}
                  renderIcon={(iconStyle) => <Icon style={iconStyle} type="FontAwesome" name="money" />}
                  description={I18n.t('home.totalPriceNote')}
                />
              )}
            </View>
          </Content>
        )}
      </Container>
    );
  };
}
