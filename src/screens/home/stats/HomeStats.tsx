import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, DatePicker, Icon, Left, Spinner, Text, View } from 'native-base';
import React from 'react';
import { Alert, BackHandler } from 'react-native';
import BackgroundComponent from '../../../components/background/BackgroundComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import I18nManager from '../../../I18n/I18nManager';
import ProviderFactory from '../../../provider/ProviderFactory';
import BaseProps from '../../../types/BaseProps';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import computeStyleSheet from './HomeStatsStyles';

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  isAdmin?: boolean;
  startDateFilter?: Date;
  endDateFilter?: Date;
  startDate?: Date;
  endDate?: Date;
  totalNumberOfSession?: number;
  totalConsumptionWattHours?: number;
  totalDurationSecs?: number;
  totalInactivitySecs?: number;
  totalPrice?: number;
  priceCurrency?: string;
  isPricingActive?: boolean;
}

export default class HomeStats extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      isAdmin: false,
      totalNumberOfSession: 0,
      totalConsumptionWattHours: 0,
      totalDurationSecs: 0,
      totalInactivitySecs: 0,
      startDate: null,
      endDate: null,
      totalPrice: 0,
      isPricingActive: false
    };
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_LONG_PERIOD_MILLIS);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Refresh
    await this.refresh();
  }

  public refresh = async () => {
    // Get the provider
    const centralServerProvider = await ProviderFactory.getProvider();
    const securityProvider = centralServerProvider.getSecurityProvider();
    // Get the ongoing Transaction
    await this.getTransactions();
    // Set
    this.setState({
      isPricingActive: securityProvider.isComponentPricingActive(),
      loading: false
    });
  };

  public setStartDate = (startDate: Date) => {
    this.setState({
      startDateFilter: startDate
    });
  }

  public setEndDate = (endDate: Date) => {
    this.setState({
      endDateFilter: endDate
    });
  }

  public getTransactions = async () => {
    try {
      // Get active transaction
      const transactions = await this.centralServerProvider.getTransactions(
        {
          Statistics: 'history',
          StartDateTime: this.state.startDateFilter ? this.state.startDateFilter.toISOString() : null,
          EndDateTime: this.state.endDateFilter ? this.state.endDateFilter.toISOString() : null
        },
        Constants.ONLY_RECORD_COUNT_PAGING
      );
      console.log('====================================');
      console.log(transactions);
      console.log('====================================');
      // Set
      this.setState({
        startDateFilter: !this.state.startDateFilter ? new Date(transactions.stats.firstTimestamp) : this.state.startDateFilter,
        endDateFilter: !this.state.endDateFilter ? new Date(transactions.stats.lastTimestamp) : this.state.endDateFilter,
        startDate: !this.state.startDate ? new Date(transactions.stats.firstTimestamp) : this.state.startDate,
        endDate: !this.state.endDate ? new Date(transactions.stats.lastTimestamp) : this.state.endDate,
        totalNumberOfSession: transactions.stats.count,
        totalConsumptionWattHours: transactions.stats.totalConsumptionWattHours,
        totalDurationSecs: transactions.stats.totalDurationSecs,
        totalInactivitySecs: transactions.stats.totalInactivitySecs,
        totalPrice: transactions.stats.totalPrice
      });
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
      }
    }
  };

  public onBack = (): boolean => {
    Alert.alert(
      I18n.t('general.exitApp'),
      I18n.t('general.exitAppConfirm'),
      [{ text: I18n.t('general.no'), style: 'cancel' }, { text: I18n.t('general.yes'), onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
    return true;
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, totalNumberOfSession, totalConsumptionWattHours,
      startDateFilter, endDateFilter, startDate, endDate,
      totalDurationSecs, totalInactivitySecs, totalPrice, isPricingActive } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t('home.summary')}
            showSearchAction={false}
            rightAction={navigation.openDrawer}
            rightActionIcon={'menu'}
          />
          {loading ? (
            <Container style={style.container}>
              <Spinner style={style.spinner} />
            </Container>
          ) : (
            <Content style={style.content}>
              <View style={style.dateContainer}>
                <DatePicker
                  defaultDate={startDateFilter}
                  minimumDate={startDate}
                  maximumDate={endDateFilter}
                  locale={this.centralServerProvider.getUserLanguage()}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={'fade'}
                  androidMode={'spinner'}
                  placeHolderText={I18n.t('general.startDate')}
                  textStyle={style.dateValue}
                  placeHolderTextStyle={style.dateValue}
                  onDateChange={this.setStartDate}
                  disabled={false}
                  formatChosenDate={(date) => I18nManager.formatDateTime(date, 'LL')}
                />
                <Text>></Text>
                <DatePicker
                  defaultDate={endDateFilter}
                  minimumDate={startDateFilter}
                  maximumDate={endDate}
                  locale={this.centralServerProvider.getUserLanguage()}
                  timeZoneOffsetInMinutes={undefined}
                  modalTransparent={false}
                  animationType={'fade'}
                  androidMode={'spinner'}
                  placeHolderText={I18n.t('general.endDate')}
                  textStyle={style.dateValue}
                  placeHolderTextStyle={style.dateValue}
                  onDateChange={this.setEndDate}
                  disabled={false}
                  formatChosenDate={(date) => I18nManager.formatDateTime(date, 'LL')}
                />
              </View>
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
        </BackgroundComponent>
      </Container>
    );
  };
}
