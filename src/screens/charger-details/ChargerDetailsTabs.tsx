import I18n from 'i18n-js';
import { Container, Icon, Spinner, Tab, TabHeading, Tabs } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native';
import BackgroundComponent from '../../components/background/BackgroundComponent';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import ChargingStation from '../../types/ChargingStation';
import Connector from '../../types/Connector';
import Utils from '../../utils/Utils';
import BaseAutoRefreshScreen from '../base-screen/BaseAutoRefreshScreen';
import TransactionChart from '../transactions/chart/TransactionChart';
import computeStyleSheet from './ChargerDetailsTabsStyles';
import ChargerConnectorDetails from './connector/ChargerConnectorDetails';
import ChargerDetails from './details/ChargerDetails';

export interface Props extends BaseProps {
}

interface State {
  charger?: ChargingStation;
  connector?: Connector;
  selectedTabIndex?: number;
  firstLoad?: boolean;
  canStartTransaction?: boolean;
  canStopTransaction?: boolean;
  canDisplayTransaction?: boolean;
  isAdmin?: boolean;
}

export default class ChargerDetailsTabs extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      charger: null,
      connector: null,
      selectedTabIndex: 0,
      firstLoad: true,
      canStartTransaction: false,
      canStopTransaction: false,
      canDisplayTransaction: false,
      isAdmin: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public refresh = async () => {
    if (this.isMounted()) {
      // Get Charger
      await this.getCharger();
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      this.setState({
        firstLoad: false,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      });
    }
  };

  public getCharger = async () => {
    // Get IDs
    const chargerID = Utils.getParamFromNavigation(this.props.navigation, 'chargerID', null);
    const connectorID: number = parseInt(Utils.getParamFromNavigation(this.props.navigation, 'connectorID', null), 10);
    try {
      // Get Charger
      const charger = await this.centralServerProvider.getCharger({ ID: chargerID });
      this.setState(
        {
          charger,
          connector: charger.connectors[connectorID - 1]
        },
        async () => {
          // Check Auth
          this.computeAuths();
        }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  public computeAuths = () => {
    // Check Auth
    this.canStopTransaction();
    this.canStartTransaction();
    this.canReadTransaction();
  };

  public canStopTransaction = () => {
    const { charger, connector } = this.state;
    // Transaction?
    if (connector && connector.activeTransactionID !== 0) {
      // Get the Security Provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Check Auth
      const isAuth = securityProvider.canStopTransaction(charger.siteArea, connector.activeTagID);
      // Assign
      this.setState({
        canStopTransaction: isAuth
      });
    } else {
      // Not Authorized
      this.setState({
        canStopTransaction: false
      });
    }
  };

  public canStartTransaction = () => {
    const { charger, connector } = this.state;
    // Transaction?
    if (connector && connector.activeTransactionID === 0) {
      // Get the Security Provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Check Auth
      const isAuth = securityProvider.canStartTransaction(charger.siteArea);
      // Assign
      this.setState({
        canStartTransaction: isAuth
      });
    } else {
      // Not Authorized
      this.setState({
        canStartTransaction: false
      });
    }
  };

  public canReadTransaction = () => {
    const { charger, connector } = this.state;
    // Transaction?
    if (connector && connector.activeTransactionID !== 0) {
      // Get the Security Provider
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      // Check Auth
      const isAuth = securityProvider.canReadTransaction(charger.siteArea, connector.activeTagID);
      // Assign
      this.setState({
        canDisplayTransaction: isAuth
      });
    } else {
      // Not Authorized
      this.setState({
        canDisplayTransaction: false
      });
    }
  };

  public render() {
    const style = computeStyleSheet();
    const connectorID = parseInt(Utils.getParamFromNavigation(this.props.navigation, 'connectorID', null), 10);
    const { charger, connector, isAdmin, firstLoad, canStopTransaction, canStartTransaction, canDisplayTransaction } = this.state;
    const { navigation } = this.props;
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connectorID);
    return firstLoad ? (
      <Container style={style.container}>
        <Spinner style={style.spinner} />
      </Container>
    ) : (
      <ScrollView contentContainerStyle={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={this.props.navigation}
            title={charger ? charger.id : I18n.t('connector.unknown')}
            subTitle={`(${I18n.t('details.connector')} ${connectorLetter})`}
            leftAction={() => this.onBack()}
            leftActionIcon={'navigate-before'}
            rightAction={navigation.openDrawer}
            rightActionIcon={'menu'}
          />
          {!isAdmin && !canStopTransaction ? (
            <ChargerConnectorDetails
              charger={charger}
              connector={connector}
              isAdmin={isAdmin}
              canStartTransaction={canStartTransaction}
              canStopTransaction={canStopTransaction}
              navigation={navigation}
            />
          ) : (
            <Tabs tabBarPosition='bottom' locked={false} initialPage={0}>
              <Tab
                heading={
                  <TabHeading style={style.tabHeader}>
                    <Icon style={style.tabIcon} type='FontAwesome' name='bolt' />
                  </TabHeading>
                }>
                <ChargerConnectorDetails
                  charger={charger}
                  connector={connector}
                  isAdmin={isAdmin}
                  canStartTransaction={canStartTransaction}
                  canStopTransaction={canStopTransaction}
                  navigation={navigation}
                />
              </Tab>
              {canDisplayTransaction && (
                <Tab
                  heading={
                    <TabHeading style={style.tabHeader}>
                      <Icon style={style.tabIcon} type='AntDesign' name='linechart' />
                    </TabHeading>
                  }>
                  <TransactionChart transactionID={connector ? connector.activeTransactionID : 0} navigation={navigation} isAdmin={isAdmin} />
                </Tab>
              )}
              {isAdmin && (
                <Tab
                  heading={
                    <TabHeading style={style.tabHeader}>
                      <Icon style={style.tabIcon} type='MaterialIcons' name='info' />
                    </TabHeading>
                  }>
                  <ChargerDetails charger={charger} connector={connector} navigation={navigation} />
                </Tab>
              )}
            </Tabs>
          )}
        </BackgroundComponent>
      </ScrollView>
    );
  }
}
