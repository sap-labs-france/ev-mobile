import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, Icon, Left, Text } from 'native-base';
import React from 'react';
import { Alert, BackHandler } from 'react-native';

import computeCardStyleSheet from '../../CardStyles';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import QrCode from '../../types/QrCode';
import { TenantConnection } from '../../types/Tenant';
import Transaction from '../../types/Transaction';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import ChargingStationQrCode from './ChargingStationQrCode';
import computeStyleSheet from './HomeStyles';

export interface Props extends BaseProps {}

interface State {
  isAdmin?: boolean;
  chargingStation?: ChargingStation;
  connector?: number;
  isComponentOrganizationActive?: boolean;
  transactionsActive?: Transaction[];
  qrCodeVisible?: boolean;
  qrCodeData?: QrCode;
}

export default class Home extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private userID: string;
  private tenantSubDomain: string;
  private tenants: TenantConnection[] = [];

  public constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      isComponentOrganizationActive: false,
      isAdmin: false,
      transactionsActive: null,
      qrCodeVisible: false
    };
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Get the security provider
    this.tenants = await this.centralServerProvider.getTenants();
    this.tenantSubDomain = this.centralServerProvider.getUserTenant().subdomain;
    this.userID = this.centralServerProvider.getUserInfo().id;
    this.setState({
      loading: false,
      isComponentOrganizationActive: this.securityProvider ? this.securityProvider.isComponentOrganizationActive() : false
    });
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public onBack = (): boolean => {
    Alert.alert(
      I18n.t('general.exitApp'),
      I18n.t('general.exitAppConfirm'),
      [
        { text: I18n.t('general.no'), style: 'cancel' },
        { text: I18n.t('general.yes'), onPress: () => BackHandler.exitApp() }
      ],
      { cancelable: false }
    );
    return true;
  };

  public navigateToTransactionInProgress = async () => {
    const { navigation } = this.props;
    try {
      if (!this.state.isAdmin) {
        // Get the Transactions
        const transactions = await this.centralServerProvider.getTransactionsActive(
          {
            UserID: this.userID
          },
          Constants.ONLY_ONE_RECORD
        );
        // User has only one transaction?
        if (transactions.count === 1) {
          navigation.navigate('TransactionInProgressNavigator', {
            screen: 'ChargingStationConnectorDetailsTabs',
            params: {
              params: {
                chargingStationID: transactions.result[0].chargeBoxID,
                connectorID: transactions.result[0].connectorId
              }
            },
            key: `${Utils.randomNumber()}`
          });
        } else {
          navigation.navigate('TransactionInProgressNavigator', {
            screen: 'TransactionsInProgress',
            key: `${Utils.randomNumber()}`
          });
        }
      } else {
        navigation.navigate('TransactionInProgressNavigator', {
          screen: 'TransactionsInProgress',
          key: `${Utils.randomNumber()}`
        });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'transactions.transactionUnexpectedError', this.props.navigation);
    }
  };

  public render = () => {
    const style = computeStyleSheet();
    const cardStyle = computeCardStyleSheet();
    const { navigation } = this.props;
    const { isComponentOrganizationActive, qrCodeVisible } = this.state;
    return (
      <Container style={style.container}>
        {qrCodeVisible ? (
          <ChargingStationQrCode
            navigation={this.props.navigation}
            tenants={this.tenants}
            currentTenantSubDomain={this.tenantSubDomain}
            close={() => {
              this.setState({ qrCodeVisible: false });
              return true;
            }}
          />
        ) : (
          <Container style={style.container}>
            <HeaderComponent
              navigation={navigation}
              title={I18n.t('sidebar.home')}
              rightAction={() => {
                navigation.dispatch(DrawerActions.openDrawer());
                return true;
              }}
              rightActionIcon={'menu'}
              tenantLogo={this.centralServerProvider?.getCurrentTenantLogo()}
            />
            <Content style={cardStyle.cards}>
              {isComponentOrganizationActive && (
                <Card style={cardStyle.card}>
                  <CardItem
                    style={cardStyle.cardItem}
                    button
                    onPress={() => navigation.navigate('SitesNavigator', { screen: 'Sites', key: `${Utils.randomNumber()}` })}>
                    <Left>
                      <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="store-mall-directory" />
                      <Body>
                        <Text style={cardStyle.cardText}>{I18n.t('home.browseSites')}</Text>
                        <Text note style={cardStyle.cardNote}>
                          {I18n.t('home.browseSitesNote')}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
              <Card style={cardStyle.card}>
                <CardItem
                  style={cardStyle.cardItem}
                  button
                  onPress={() =>
                    navigation.navigate('ChargingStationsNavigator', { screen: 'ChargingStations', key: `${Utils.randomNumber()}` })
                  }>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="ev-station" />
                    <Body>
                      <Text style={cardStyle.cardText}>{I18n.t('home.browseChargers')}</Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.browseChargersNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card style={cardStyle.card}>
                <CardItem style={cardStyle.cardItem} button onPress={() => this.setState({ qrCodeVisible: true })}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="AntDesign" name="qrcode" />
                    <Body>
                      <Text style={cardStyle.cardText}>{I18n.t('qrCode.browseScan&Charge')}</Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('qrCode.browseScan&ChargeNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card style={cardStyle.card}>
                <CardItem
                  style={cardStyle.cardItem}
                  button
                  onPress={() =>
                    navigation.navigate('TransactionHistoryNavigator', { screen: 'TransactionsHistory', key: `${Utils.randomNumber()}` })
                  }>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialCommunityIcons" name="history" />
                    <Body>
                      <Text style={cardStyle.cardText}>{I18n.t('home.browseSessions')}</Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.browseSessionsNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card style={cardStyle.card}>
                <CardItem style={cardStyle.cardItem} button onPress={this.navigateToTransactionInProgress}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="play-arrow" />
                    <Body>
                      <Text style={cardStyle.cardText}>{I18n.t('home.ongoingSessions')}</Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.ongoingSessionsNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              {this.securityProvider?.canListTags() && (
                <Card style={cardStyle.card}>
                  <CardItem
                    style={cardStyle.cardItem}
                    button
                    onPress={() => navigation.navigate('TagsNavigator', { key: `${Utils.randomNumber()}` })}>
                    <Left>
                      <Icon style={cardStyle.cardIcon} type="MaterialCommunityIcons" name="credit-card" />
                      <Body>
                        <Text style={cardStyle.cardText}>{I18n.t('home.tags')}</Text>
                        <Text note style={cardStyle.cardNote}>
                          {I18n.t('home.tagsNote')}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
              {this.securityProvider?.canListUsers() && (
                <Card style={cardStyle.card}>
                  <CardItem
                    style={cardStyle.cardItem}
                    button
                    onPress={() =>
                      navigation.navigate('UsersNavigator', { params: { userIDs: undefined }, key: `${Utils.randomNumber()}` })
                    }>
                    <Left>
                      <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="people" />
                      <Body>
                        <Text style={cardStyle.cardText}>{I18n.t('home.users')}</Text>
                        <Text note style={cardStyle.cardNote}>
                          {I18n.t('home.usersNote')}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
              {this.securityProvider?.canListCars() && this.securityProvider?.isComponentCarActive() && (
                <Card style={cardStyle.card}>
                  <CardItem
                    style={cardStyle.cardItem}
                    button={true}
                    onPress={() => navigation.navigate('CarsNavigator', { key: `${Utils.randomNumber()}` })}>
                    <Left>
                      <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="directions-car" />
                      <Body>
                        <Text style={cardStyle.cardText}>{I18n.t('home.cars')}</Text>
                        <Text note={true} style={cardStyle.cardNote}>
                          {I18n.t('home.carsNote')}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
              {this.securityProvider?.canListPaymentMethods() && this.securityProvider?.isComponentBillingActive() && (
                <Card style={cardStyle.card}>
                  <CardItem
                    style={cardStyle.cardItem}
                    button={true}
                    onPress={() => navigation.navigate('PaymentMethodsNavigator', { key: `${Utils.randomNumber()}` })}>
                    <Left>
                      <Icon style={cardStyle.cardIcon} type="FontAwesome5" name="credit-card" />
                      <Body>
                        <Text style={cardStyle.cardText}>{I18n.t('home.paymentMethods')}</Text>
                        <Text note={true} style={cardStyle.cardNote}>
                          {I18n.t('home.paymentMethodsNote')}
                        </Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
              <Card style={cardStyle.card}>
                <CardItem
                  style={cardStyle.cardItem}
                  button
                  onPress={() => navigation.navigate('StatisticsNavigator', { key: `${Utils.randomNumber()}` })}>
                  <Left>
                    <Icon style={cardStyle.cardIcon} type="MaterialIcons" name="assessment" />
                    <Body>
                      <Text style={cardStyle.cardText}>{I18n.t('home.browseStatistics')}</Text>
                      <Text note style={cardStyle.cardNote}>
                        {I18n.t('home.browseStatisticsNote')}
                      </Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
            </Content>
          </Container>
        )}
      </Container>
    );
  };
}
