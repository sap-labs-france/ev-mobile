import I18n from "i18n-js";
import { Body, Card, CardItem, Container, Content, Icon, Left, Spinner, Text } from "native-base";
import React from "react";
import { Alert, BackHandler } from "react-native";
import Transaction from "types/Transaction";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import HeaderComponent from "../../../components/header/HeaderComponent";
import BaseProps from "../../../types/BaseProps";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import computeStyleSheet from "./HomeStyles";

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  isAdmin?: boolean;
  isComponentOrganizationActive?: boolean;
  transactionsActive?: Transaction[];
  transactionsActiveCount?: number;
}

export default class Home extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      isComponentOrganizationActive: false,
      loading: true,
      isAdmin: false,
      transactionsActive: null,
      transactionsActiveCount: 0
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public refresh = async () => {
    // Get the security provider
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    // Get the ongoing Transaction
    await this.getTransactionsActive();
    // Set
    this.setState({
      loading: false,
      isComponentOrganizationActive: securityProvider ? securityProvider.isComponentOrganizationActive() : false,
    });
  };

  public getTransactionsActive = async () => {
    try {
      // Get active transaction
      const transactionsActive = await this.centralServerProvider.getTransactionsActive({}, Constants.ONLY_ONE_PAGING);
      this.setState({
        transactionsActive : transactionsActive.result,
        transactionsActiveCount: transactionsActive.count
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
      I18n.t("general.exitApp"),
      I18n.t("general.exitAppConfirm"),
      [{ text: I18n.t("general.no"), style: "cancel" }, { text: I18n.t("general.yes"), onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
    return true;
  }

  public navigateToOngoingSession = () => {
    const { navigation } = this.props;
    const { transactionsActive, transactionsActiveCount } = this.state;
    if (transactionsActiveCount === 1) {
      // Only One Session
      navigation.navigate("ChargerDetailsTabs", {
        chargerID: transactionsActive[0].chargeBoxID,
        connectorID: transactionsActive[0].connectorId
      });
    } else if (transactionsActiveCount > 1) {
      // Many Sessions
      navigation.navigate("TransactionTabs", {
        activeTab: "InProgress"
      });
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, isComponentOrganizationActive, transactionsActiveCount } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t("sidebar.home")}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          {loading ? (
            <Spinner style={style.spinner} />
          ) : (
            <Content style={style.content}>
              {isComponentOrganizationActive && (
                <Card>
                  <CardItem button={true} onPress={() => navigation.navigate({ routeName: "SitesNavigator" })}>
                    <Left>
                      <Icon style={style.cardIcon} type="MaterialIcons" name="store-mall-directory" />
                      <Body>
                        <Text style={style.cardText}>{I18n.t("home.browseSites")}</Text>
                        <Text note={true} style={style.cardNote}>{I18n.t("home.browseSitesNote")}</Text>
                      </Body>
                    </Left>
                  </CardItem>
                </Card>
              )}
              <Card>
                <CardItem button={true} onPress={() => navigation.navigate({ routeName: "ChargersNavigator" })}>
                  <Left>
                    <Icon style={style.cardIcon} type="MaterialIcons" name="ev-station" />
                    <Body>
                      <Text style={style.cardText}>{I18n.t("home.browseChargers")}</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t("home.browseChargersNote")}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card>
                <CardItem button={true} onPress={() => navigation.navigate({ routeName: "TransactionsNavigator" })}>
                  <Left>
                    <Icon style={style.cardIcon} type="MaterialCommunityIcons" name="history" />
                    <Body>
                      <Text style={style.cardText}>{I18n.t("home.browseSessions")}</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t("home.browseSessionsNote")}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              {transactionsActiveCount > 0 &&
                <Card>
                  <CardItem button={true} onPress={() => this.navigateToOngoingSession()}>
                    <Left>
                      <Icon style={style.cardIcon} type="FontAwesome" name="bolt" />
                      <Body>
                        <Text style={style.cardText}>{transactionsActiveCount ?
                          `${I18n.t("home.ongoingSessions", { nbrSessions: transactionsActiveCount })}`
                        :
                          `${I18n.t("home.noOngoingSessions")}`
                        }</Text>
                        <Text note={true} style={style.cardNote}>{I18n.t("home.ongoingSessionsNote")}</Text>
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
