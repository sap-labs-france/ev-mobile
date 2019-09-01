import React from "react";
import { Container, Tab, Tabs, TabHeading, Spinner, Icon } from "native-base";
import { ScrollView } from "react-native";
import ChargerDetails from "./details/ChargerDetails";
import TransactionChart from "../transactions/chart/TransactionChart";
import ChargerConnectorDetails from "./connector/ChargerConnectorDetails";
import BaseAutoRefreshScreen from "../base-screen/BaseAutoRefreshScreen";
import HeaderComponent from "../../components/header/HeaderComponent";
import I18n from "../../I18n/I18n";
import computeStyleSheet from "./ChargerDetailsTabsStyles";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import BackgroundComponent from "../../components/background/BackgroundComponent";
import PropTypes from "prop-types";

export default class ChargerDetailsTabs extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    this.state = {
      charger: null,
      connector: null,
      siteAreaID: Utils.getParamFromNavigation(this.props.navigation, "siteAreaID", null),
      selectedTabIndex: 0,
      firstLoad: true,
      canStartTransaction: false,
      canStopTransaction: false,
      canDisplayTransaction: false,
      isAdmin: false
    };
    // Set refresh period
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS);
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Refresh Charger
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  refresh = async () => {
    if (this.isMounted()) {
      // Get Charger
      await this._getCharger();
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      this.setState({
        firstLoad: false,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      });
    }
  };

  _getCharger = async () => {
    // Get IDs
    const chargerID = Utils.getParamFromNavigation(this.props.navigation, "chargerID", null);
    const connectorID = Utils.getParamFromNavigation(this.props.navigation, "connectorID", null);
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
          this._computeAuths();
        }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  _computeAuths = () => {
    // Check Auth
    this._canStopTransaction();
    this._canStartTransaction();
    this._canReadTransaction();
  }

  _canStopTransaction = () => {
    const { charger, connector } = this.state;
    // Transaction?
    if (connector.activeTransactionID !== 0) {
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

  _canStartTransaction = () => {
    const { charger, connector } = this.state;
    // Transaction?
    if (connector.activeTransactionID === 0) {
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

  _canReadTransaction = () => {
    const { charger, connector } = this.state;
    // Transaction?
    if (connector.activeTransactionID !== 0) {
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

  render() {
    const style = computeStyleSheet();
    const connectorID = Utils.getParamFromNavigation(this.props.navigation, "connectorID", null);
    const { charger, connector, isAdmin, siteAreaID, firstLoad,
      canStopTransaction, canStartTransaction, canDisplayTransaction } = this.state;
    const { navigation } = this.props;
    const connectorLetter = Utils.getConnectorLetter(connectorID);
    return firstLoad ? (
      <Container style={style.container}>
        <Spinner style={style.spinner} />
      </Container>
    ) : (
      <ScrollView contentContainerStyle={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={charger.id}
            subTitle={`(${I18n.t("details.connector")} ${connectorLetter})`}
            leftAction={() => this.onBack()}
            leftActionIcon={"navigate-before"}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          {!isAdmin && !canStopTransaction ?
            <ChargerConnectorDetails charger={charger} connector={connector} isAdmin={isAdmin}
              canDisplayTransaction={canDisplayTransaction} canStartTransaction={canStartTransaction} canStopTransaction={canStopTransaction}
              navigation={navigation} />
          :
            <Tabs tabBarPosition="bottom" locked={false} initialPage={0}>
              <Tab
                heading={
                  <TabHeading style={style.tabHeader}>
                    <Icon style={style.tabIcon} type="FontAwesome" name="bolt" />
                  </TabHeading>
                }>
                <ChargerConnectorDetails charger={charger} connector={connector} isAdmin={isAdmin}
                  canStartTransaction={canStartTransaction} canStopTransaction={canStopTransaction}
                  navigation={navigation} />
              </Tab>
              {canDisplayTransaction ? (
                <Tab
                  heading={
                    <TabHeading style={style.tabHeader}>
                      <Icon style={style.tabIcon} type="AntDesign" name="linechart" />
                    </TabHeading>
                  }>
                  <TransactionChart transactionID={connector.activeTransactionID} navigation={navigation} isAdmin={isAdmin} />
                </Tab>
              ) : (
                undefined
              )}
              {isAdmin ? (
                <Tab
                  heading={
                    <TabHeading style={style.tabHeader}>
                      <Icon style={style.tabIcon} type="MaterialIcons" name="info" />
                    </TabHeading>
                  }>
                  <ChargerDetails charger={charger} connector={connector} navigation={navigation} />
                </Tab>
              ) : (
                undefined
              )}
            </Tabs>
          }
        </BackgroundComponent>
      </ScrollView>
    );
  }
}
