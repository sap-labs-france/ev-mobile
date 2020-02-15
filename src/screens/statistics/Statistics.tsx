import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, Icon, Left, Spinner, Text } from 'native-base';
import React from 'react';
import HeaderComponent from '../../components/header/HeaderComponent';
import I18nManager from '../../I18n/I18nManager';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseProps from '../../types/BaseProps';
import { TransactionDataResult } from '../../types/DataResult';
import { FilterGlobalInternalIDs } from '../../types/Filter';
import Constants from '../../utils/Constants';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import StatisticsFilters, { StatisticsFiltersDef } from './StatisticsFilters';
import computeStyleSheet from './StatisticsStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  userID?: string;
  startDate?: Date;
  endDate?: Date;
  totalNumberOfSession?: number;
  totalConsumptionWattHours?: number;
  totalDurationSecs?: number;
  totalInactivitySecs?: number;
  totalPrice?: number;
  priceCurrency?: string;
  isPricingActive?: boolean;
  showFilter?: boolean;
  filters?: StatisticsFiltersDef;
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
      userID: null,
      startDate: null,
      endDate: null,
      totalPrice: 0,
      isPricingActive: false,
      showFilter: false,
      filters: {}
    };
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Get initial filters
    const userID = await SecuredStorage.loadFilterValue(FilterGlobalInternalIDs.MY_USER_FILTER);
    if (userID) {
      this.setState({
        userID,
        filters: {
          UserID: userID
        }
      });
    }
    await super.componentDidMount();
  }

  public refresh = async () => {
    // Get the provider
    const centralServerProvider = await ProviderFactory.getProvider();
    const securityProvider = centralServerProvider.getSecurityProvider();
    // Get the ongoing Transaction stats
    const transactionStats = await this.getTransactionsStats();
    // Set
    this.setState({
      startDate: this.state.startDate ? this.state.startDate : transactionStats.stats.firstTimestamp ? new Date(transactionStats.stats.firstTimestamp) : new Date(),
      endDate: this.state.endDate ? this.state.endDate : transactionStats.stats.lastTimestamp ? new Date(transactionStats.stats.lastTimestamp) : new Date(),
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
        { Statistics: 'history', ...this.state.filters },
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

  public onFilterChanged = async (filters: any) => {
    // Set Fitlers and Refresh
    this.setState({ filters }, () => this.refresh());
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, totalNumberOfSession, totalConsumptionWattHours, userID, startDate, endDate,
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
          rightAction={navigation.openDrawer}
          rightActionIcon={'menu'}
          hasFilter={true}
        />
        {loading ? (
          <Spinner style={style.spinner} />
        ) : (
          <Content style={style.content}>
            <StatisticsFilters
              initialFilters={{
                UserID: userID ? userID : null,
                StartDateTime: startDate ? startDate.toISOString() : null,
                EndDateTime: endDate ? endDate.toISOString() : null
              }}
              onFilterChanged={this.onFilterChanged}
              ref={(statisticsFilters: StatisticsFilters) => {
                if (statisticsFilters && this.headerComponent) {
                  statisticsFilters.setHeaderComponent(this.headerComponent);
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
