import I18n from 'i18n-js';
import { Body, Card, CardItem, Container, Content, Icon, Left, Text } from 'native-base';
import React from 'react';
import { Alert, BackHandler } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import Transaction from 'types/Transaction';
import computeCardStyleSheet from '../../CardStyles';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './HomeStyles';

export interface Props extends BaseProps {
}

interface State {
  isAdmin?: boolean;
  isComponentOrganizationActive?: boolean;
  transactionsActive?: Transaction[];
}

export default class Home extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private userID: string;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      isComponentOrganizationActive: false,
      isAdmin: false,
      transactionsActive: null,
    };
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Get the security provider
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    this.userID = this.centralServerProvider.getUserInfo().id;
    this.setState({
      loading: false,
      isComponentOrganizationActive: securityProvider ? securityProvider.isComponentOrganizationActive() : false,
    });
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public onBack = (): boolean => {
    Alert.alert(
      I18n.t('general.exitApp'),
      I18n.t('general.exitAppConfirm'),
      [{ text: I18n.t('general.no'), style: 'cancel' }, { text: I18n.t('general.yes'), onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
    return true;
  }

  public navigateToTransactionInProgress = async () => {
    const { navigation } = this.props;
    try {
      if (!this.state.isAdmin) {
        // Get the Transactions
        const transactions = await this.centralServerProvider.getTransactionsActive({
          UserID: this.userID,
        }, Constants.ONLY_ONE_PAGING);
        // User has only one transaction?
        if (transactions.count === 1) {
          navigation.navigate({
            routeName: 'ChargingStationConnectorDetailsTabs',
            params: {
              chargingStationID: transactions.result[0].chargeBoxID,
              connectorID: transactions.result[0].connectorId
            },
            key: `${Utils.randomNumber()}`
          });
        } else {
          navigation.navigate({ routeName: 'TransactionInProgressNavigator' });
        }
      } else {
        navigation.navigate({ routeName: 'TransactionInProgressNavigator' });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'transactions.transactionUnexpectedError', this.props.navigation);
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const cardStyle = computeCardStyleSheet();
    const { navigation } = this.props;
    const { isComponentOrganizationActive } = this.state;
    return (
      <Container style={style.container}>
        <HeaderComponent
          navigation={navigation}
          title={I18n.t('sidebar.home')}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
        />
        <Content style={cardStyle.cards}>
          {isComponentOrganizationActive && (
            <Card style={cardStyle.card}>
              <CardItem style={cardStyle.cardItem} button={true} onPress={() => navigation.navigate({ routeName: 'SitesNavigator' })}>
                <Left>
                  <Icon style={cardStyle.cardIcon} type='MaterialIcons' name='store-mall-directory' />
                  <Body>
                    <Text style={cardStyle.cardText}>{I18n.t('home.browseSites')}</Text>
                    <Text note={true} style={cardStyle.cardNote}>{I18n.t('home.browseSitesNote')}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          )}
          <Card style={cardStyle.card}>
            <CardItem style={cardStyle.cardItem} button={true} onPress={() => navigation.navigate({ routeName: 'ChargingStationsNavigator' })}>
              <Left>
                <Icon style={cardStyle.cardIcon} type='MaterialIcons' name='ev-station' />
                <Body>
                  <Text style={cardStyle.cardText}>{I18n.t('home.browseChargers')}</Text>
                  <Text note={true} style={cardStyle.cardNote}>{I18n.t('home.browseChargersNote')}</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          <Card style={cardStyle.card}>
            <CardItem style={cardStyle.cardItem} button={true} onPress={() => navigation.navigate({ routeName: 'TransactionHistoryNavigator' })}>
              <Left>
                <Icon style={cardStyle.cardIcon} type='MaterialCommunityIcons' name='history' />
                <Body>
                  <Text style={cardStyle.cardText}>{I18n.t('home.browseSessions')}</Text>
                  <Text note={true} style={cardStyle.cardNote}>{I18n.t('home.browseSessionsNote')}</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          <Card style={cardStyle.card}>
            <CardItem style={cardStyle.cardItem} button={true} onPress={this.navigateToTransactionInProgress}>
              <Left>
                <Icon style={cardStyle.cardIcon} type='MaterialIcons' name='play-arrow' />
                <Body>
                  <Text style={cardStyle.cardText}>{I18n.t('home.ongoingSessions')}</Text>
                  <Text note={true} style={cardStyle.cardNote}>{I18n.t('home.ongoingSessionsNote')}</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
          <Card style={cardStyle.card}>
            <CardItem style={cardStyle.cardItem} button={true} onPress={() => navigation.navigate({ routeName: 'StatisticsNavigator' })}>
              <Left>
                <Icon style={cardStyle.cardIcon} type='MaterialIcons' name='assessment' />
                <Body>
                  <Text style={cardStyle.cardText}>{I18n.t('home.browseStatistics')}</Text>
                  <Text note={true} style={cardStyle.cardNote}>{I18n.t('home.browseStatisticsNote')}</Text>
                </Body>
              </Left>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  };
}
