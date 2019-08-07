import React from "react";
import { Container, Tab, Tabs, TabHeading, Spinner, Icon } from "native-base";
import { ScrollView, RefreshControl } from "react-native";
import ChargerDetails from "../details/ChargerDetails";
import ChargerChartDetails from "../chart/ChargerChartDetails";
import ChargerConnectorDetails from "../connector/ChargerConnectorDetails";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import ProviderFactory from "../../../provider/ProviderFactory";
import HeaderComponent from "../../../components/header/HeaderComponent";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./ChargerTabDetailsStyles";
import Utils from "../../../utils/Utils";
import Constants from "../../../utils/Constants";
import BackgroundComponent from "../../../components/background/BackgroundComponent";

export default class ChargerTabDetails extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    this.state = {
      charger: null,
      connector: null,
      siteAreaID: Utils.getParamFromNavigation(this.props.navigation, "siteAreaID", null),
      selectedTabIndex: 0,
      firstLoad: true,
      isAuthorizedToStopTransaction: false,
      isAdmin: false,
      refreshing: false
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

  refresh = async () => {
    if (this.isMounted()) {
      // Get Charger
      await this._getCharger();
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      this.setState({
        firstLoad: false,
        isAdmin: (securityProvider ? securityProvider.isAdmin() : false)
      });
    }
  };

  _manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
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
          await this._isAuthorizedStopTransaction();
        }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  _isAuthorizedStopTransaction = async () => {
    const { charger, connector } = this.state;
    try {
      // Transaction?
      if (connector.activeTransactionID !== 0) {
        // Call
        const result = await this.centralServerProvider.isAuthorizedStopTransaction({
          Action: "StopTransaction",
          Arg1: charger.id,
          Arg2: connector.activeTransactionID
        });
        if (result) {
          // Assign
          this.setState({
            isAuthorizedToStopTransaction: result.IsAuthorized
          });
        }
      } else {
        // Not Authorized
        this.setState({
          isAuthorizedToStopTransaction: false
        });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  render() {
    const style = computeStyleSheet();
    const connectorID = Utils.getParamFromNavigation(this.props.navigation, "connectorID", null);
    const {
      charger,
      connector,
      isAdmin,
      isAuthorizedToStopTransaction,
      siteAreaID,
      firstLoad
    } = this.state;
    const { navigation } = this.props;
    const connectorLetter = String.fromCharCode(64 + connectorID);
    return firstLoad ? (
      <Container style={style.container}>
        <Spinner style={style.spinner} />
      </Container>
    ) : (
      <ScrollView
        contentContainerStyle={style.container}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this._manualRefresh} />
        }
      >
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={charger.id}
            subTitle={`(${I18n.t("details.connector")} ${connectorLetter})`}
            leftAction={() => navigation.navigate("Chargers", { siteAreaID })}
            leftActionIcon={"navigate-before"}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <Tabs tabBarPosition="bottom" locked={true} initialPage={0}>
            <Tab
              heading={
                <TabHeading style={style.tabHeader}>
                  <Icon style={style.tabIcon} type="FontAwesome" name="bolt" />
                </TabHeading>
              }
            >
              <ChargerConnectorDetails
                charger={charger}
                connector={connector}
                isAdmin={isAdmin}
                navigation={navigation}
              />
            </Tab>
            {connector.activeTransactionID && (isAuthorizedToStopTransaction || isAdmin) ? (
              <Tab
                heading={
                  <TabHeading style={style.tabHeader}>
                    <Icon style={style.tabIcon} type="AntDesign" name="linechart" />
                  </TabHeading>
                }
              >
                <ChargerChartDetails
                  transactionID={connector.activeTransactionID}
                  isAdmin={isAdmin}
                  navigation={navigation}
                />
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
                }
              >
                <ChargerDetails
                  charger={charger}
                  connector={connector}
                  isAdmin={isAdmin}
                  navigation={navigation}
                />
              </Tab>
            ) : (
              undefined
            )}
          </Tabs>
        </BackgroundComponent>
      </ScrollView>
    );
  }
}
