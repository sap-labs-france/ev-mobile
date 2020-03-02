import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, Icon, Left, Spinner, Text } from 'native-base';
import React from 'react';
import { DrawerActions } from 'react-navigation-drawer';
import HeaderComponent from '../../components/header/HeaderComponent';
import I18nManager from '../../I18n/I18nManager';
import ProviderFactory from '../../provider/ProviderFactory';
import TransactionsHistoryFilters, { TransactionsHistoryFiltersDef } from '../../screens/transactions/list/TransactionsHistoryFilters';
import BaseProps from '../../types/BaseProps';
import { TransactionDataResult } from '../../types/DataResult';
import { GlobalFilters } from '../../types/Filter';
import Constants from '../../utils/Constants';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './StatisticsStyles';

export interface Props extends BaseProps {
}

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
  private headerComponent: HeaderComponent;

  constructor(props: Props) {
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

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async loadInitialFilters() {
    const userID = await SecuredStorage.loadFilterValue(GlobalFilters.MY_USER_FILTER);
    this.setState({
      initialFilters: { userID },
      filters: { userID }
    });
  }

  public refresh = async () => {
    // Get the provider
    const centralServerProvider = await ProviderFactory.getProvider();
    const securityProvider = centralServerProvider.getSecurityProvider();
    // Get the ongoing Transaction stats
    const transactionStats = await this.getTransactionsStats();
    // Set
    this.setState({
      initialFilters: {
        ...this.state.initialFilters,
        startDateTime: this.state.initialFilters.startDateTime ? this.state.initialFilters.startDateTime :
          transactionStats.stats.firstTimestamp ? new Date(transactionStats.stats.firstTimestamp) : new Date(),
        endDateTime: this.state.initialFilters.endDateTime ? this.state.initialFilters.endDateTime :
          transactionStats.stats.lastTimestamp ? new Date(transactionStats.stats.lastTimestamp) : new Date(),
      },
      totalNumberOfSession: transactionStats.stats.count,
      totalConsumptionWattHours: transactionStats.stats.totalConsumptionWattHours,
      totalDurationSecs: transactionStats.stats.totalDurationSecs,
      totalInactivitySecs: transactionStats.stats.totalInactivitySecs,
      totalPrice: transactionStats.stats.totalPrice,
      isPricingActive: securityProvider.isComponentPricingActive(),
      loading: false
    });
  };

  public getTransactionsStats = async (): Promise<TransactionDataResult> => {
    try {
      // Get active transaction
      const transactions = await this.centralServerProvider.getTransactions(
        {
          Statistics: 'history',
          UserID: this.state.filters.userID,
          StartDateTime: this.state.filters.startDateTime ? this.state.filters.startDateTime.toISOString() : null,
          EndDateTime: this.state.filters.endDateTime ? this.state.filters.endDateTime.toISOString() : null,
        },
        Constants.ONLY_RECORD_COUNT_PAGING
      );
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

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, totalNumberOfSession, totalConsumptionWattHours, initialFilters, filters,
      totalDurationSecs, totalInactivitySecs, totalPrice, isPricingActive } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          ref={(headerComponent: HeaderComponent) => {
            this.headerComponent = headerComponent;
          }}
          navigation={navigation}
          title={I18n.t('home.statistics')}
          leftAction={() => this.onBack()}
          leftActionIcon={'navigate-before'}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
          filters={filters}
        />
        {loading ? (
          <Spinner style={style.spinner} />
        ) : (
          <Content style={style.content}>
            <TransactionsHistoryFilters
              initialFilters={initialFilters}
              onFilterChanged={(newFilters: TransactionsHistoryFiltersDef) => this.setState({ filters: newFilters }, () => this.refresh())}
              ref={(transactionsHistoryFilters: TransactionsHistoryFilters) => {
                if (this.headerComponent && transactionsHistoryFilters && transactionsHistoryFilters.getFilterAggregatorContainerComponent()) {
                  this.headerComponent.setFilterAggregatorContainerComponent(transactionsHistoryFilters.getFilterAggregatorContainerComponent());
                }
              }}
            />
            <Card>
              <CardItem>
                <Left>
                  <Icon style={style.cardIcon} type='MaterialIcons' name='history' />
                  <Body>
                    <Text style={style.cardText}>{I18n.t('home.numberOfSessions',
                      { nbrSessions: I18nManager.formatNumber(totalNumberOfSession)})}</Text>
                    <Text note={true} style={style.cardNote}>{I18n.t('home.numberOfSessionsNote')}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Left>
                  <Icon style={style.cardIcon} type='FontAwesome' name='bolt' />
                  <Body>
                    <Text style={style.cardText}>{I18n.t('home.totalConsumptiom',
                      { totalConsumptiom: I18nManager.formatNumber(Math.round(totalConsumptionWattHours / 1000))})}</Text>
                    <Text note={true} style={style.cardNote}>{I18n.t('home.totalConsumptiomNote')}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Left>
                  <Icon style={style.cardIcon} type='MaterialIcons' name='timer' />
                  <Body>
                    <Text style={style.cardText}>{I18n.t('home.totalDuration',
                      { totalDuration: Utils.formatDuration(totalDurationSecs) })}</Text>
                    <Text note={true} style={style.cardNote}>{I18n.t('home.totalDurationNote')}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
            <Card>
              <CardItem>
                <Left>
                  <Icon style={style.cardIcon} type='MaterialIcons' name='timer-off' />
                  <Body>
                    <Text style={style.cardText}>{I18n.t('home.totalInactivity',
                      { totalInactivity: Utils.formatDuration(totalInactivitySecs),
                        totalInactivityPercent: I18nManager.formatPercentage((totalInactivitySecs / totalDurationSecs)) })}</Text>
                    <Text note={true} style={style.cardNote}>{I18n.t('home.totalInactivityNote')}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
            { isPricingActive &&
              <Card>
                <CardItem>
                  <Left>
                    <Icon style={style.cardIcon} type='FontAwesome' name='money' />
                    <Body>
                      <Text style={style.cardText}>{I18n.t('home.totalPrice',
                        { totalPrice: I18nManager.formatCurrency(totalPrice) }) }</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t('home.totalPriceNote')}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            }
          </Content>
        )}
      </Container>
    );
  };
}
