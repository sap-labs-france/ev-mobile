import { Body, Card, CardItem, Container, Content, Icon, Left, Text } from "native-base";
import React from "react";
import { Alert, BackHandler } from "react-native";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import HeaderComponent from "../../../components/header/HeaderComponent";
import I18n from "../../../I18n/I18n";
import BaseProps from "../../../types/BaseProps";
import BaseScreen from "../../base-screen/BaseAutoRefreshScreen";
import computeStyleSheet from "./HomeStyles";

export interface Props extends BaseProps {
}

interface State {
  isAdmin?: boolean;
  isComponentOrganizationActive?: boolean;
}

export default class Home extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Init State
    this.state = {
      isComponentOrganizationActive: false,
      isAdmin: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    this.setState({
      isComponentOrganizationActive: securityProvider ? securityProvider.isComponentOrganizationActive() : false,
    });
  }

  public onBack = (): boolean => {
    Alert.alert(
      I18n.t("general.exitApp"),
      I18n.t("general.exitAppConfirm"),
      [{ text: I18n.t("general.no"), style: "cancel" }, { text: I18n.t("general.yes"), onPress: () => BackHandler.exitApp() }],
      { cancelable: false }
    );
    return true;
  }

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { isAdmin, isComponentOrganizationActive } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t("sidebar.home")}
            showSearchAction={false}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <Content>
            {isComponentOrganizationActive && (
              <Card>
                <CardItem button={true} onPress={() => navigation.navigate({ routeName: "SitesNavigator" })}>
                  <Left>
                    <Icon style={style.cardIcon} type="MaterialIcons" name="store-mall-directory" />
                    <Body>
                      <Text>{I18n.t("home.browseSites")}</Text>
                      <Text note={true}>{I18n.t("home.browseSitesNote")}</Text>
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
                    <Text>{I18n.t("home.browseChargers")}</Text>
                    <Text note={true}>{I18n.t("home.browseChargersNote")}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
            <Card>
              <CardItem button={true} onPress={() => navigation.navigate({ routeName: "TransactionsNavigator" })}>
                <Left>
                  <Icon style={style.cardIcon} type="MaterialCommunityIcons" name="history" />
                  <Body>
                    <Text>{I18n.t("home.browseSessions")}</Text>
                    <Text note={true}>{I18n.t("home.browseSessionsNote")}</Text>
                  </Body>
                </Left>
              </CardItem>
            </Card>
          </Content>
        </BackgroundComponent>
      </Container>
    );
  };
}
