import I18n from "i18n-js";
import { Body, Card, CardItem, Container, Content, Icon, Left, Spinner, Text } from "native-base";
import React from "react";
import { Alert, BackHandler } from "react-native";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import HeaderComponent from "../../../components/header/HeaderComponent";
import I18nManager from "../../../I18n/I18nManager";
import ProviderFactory from "../../../provider/ProviderFactory";
import BaseProps from "../../../types/BaseProps";
import { ComponentEnum } from "../../../types/Component";
import { SettingContentTypes, SimplePricingSettings } from "../../../types/Setting";
import Constants from "../../../utils/Constants";
import Utils from "../../../utils/Utils";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import computeStyleSheet from "./HomeStatsStyles";

export interface Props extends BaseProps {
}

interface State {
  loading?: boolean;
  isAdmin?: boolean;
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
      totalPrice: 0,
      priceCurrency: '',
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
    // Get pricing info
    if (securityProvider.isComponentPricingActive()) {
      await this.getPricingSettings();
    }
    // Set
    this.setState({
      isPricingActive: securityProvider.isComponentPricingActive(),
      loading: false
    });
  };

  public getTransactions = async () => {
    try {
      // Get active transaction
      const transactions = await this.centralServerProvider.getTransactions({ Statistics: 'history' }, Constants.ONLY_RECORD_COUNT_PAGING);
      this.setState({
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

  public getPricingSettings = async () => {
    try {
      let priceCurrency = '';
      // Get active transaction
      const settings = await this.centralServerProvider.getSettings({ Identifier: ComponentEnum.PRICING });
      // Simple pricing?
      if (settings.count > 0 && settings.result[0].content.type === SettingContentTypes.SIMPLE) {
        const pricingSettings: SimplePricingSettings = settings.result[0].content.simple;
        // Set currency
        priceCurrency = pricingSettings.currency + ' ';
      }
      this.setState({
        priceCurrency
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

  public render = () => {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, totalNumberOfSession, totalConsumptionWattHours, totalDurationSecs, totalInactivitySecs, totalPrice, priceCurrency, isPricingActive } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={navigation}
            title={I18n.t("home.summary")}
            showSearchAction={false}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          {loading ? (
            <Container style={style.container}>
              <Spinner style={style.spinner} />
            </Container>
          ) : (
            <Content style={style.content}>
              <Card>
                <CardItem>
                  <Left>
                    <Icon style={style.cardIcon} type="MaterialIcons" name="history" />
                    <Body>
                      <Text style={style.cardText}>{I18n.t("home.numberOfSessions",
                        { nbrSessions: I18nManager.formatNumber(totalNumberOfSession)})}</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t("home.numberOfSessionsNote")}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card>
                <CardItem>
                  <Left>
                    <Icon style={style.cardIcon} type="FontAwesome" name="bolt" />
                    <Body>
                      <Text style={style.cardText}>{I18n.t("home.totalConsumptiom",
                        { totalConsumptiom: I18nManager.formatNumber(Math.round(totalConsumptionWattHours / 1000))})}</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t("home.totalConsumptiomNote")}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card>
                <CardItem>
                  <Left>
                    <Icon style={style.cardIcon} type="MaterialIcons" name="timer" />
                    <Body>
                      <Text style={style.cardText}>{I18n.t("home.totalDuration",
                        { totalDuration: Utils.formatDuration(totalDurationSecs) })}</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t("home.totalDurationNote")}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              <Card>
                <CardItem>
                  <Left>
                    <Icon style={style.cardIcon} type="MaterialIcons" name="timer-off" />
                    <Body>
                      <Text style={style.cardText}>{I18n.t("home.totalInactivity",
                        { totalInactivity: Utils.formatDuration(totalInactivitySecs),
                          totalInactivityPercent: I18nManager.formatPercentage(Math.round((totalInactivitySecs / totalDurationSecs) * 100)) })}</Text>
                      <Text note={true} style={style.cardNote}>{I18n.t("home.totalInactivityNote")}</Text>
                    </Body>
                  </Left>
                </CardItem>
              </Card>
              { isPricingActive &&
                <Card>
                  <CardItem>
                    <Left>
                      <Icon style={style.cardIcon} type="FontAwesome" name="money" />
                      <Body>
                        <Text style={style.cardText}>{I18n.t("home.totalPrice",
                          { totalPrice: I18nManager.formatCurrency(Math.round(totalPrice), { precision: 0, unit: priceCurrency }) }) }</Text>
                        <Text note={true} style={style.cardNote}>{I18n.t("home.totalPriceNote")}</Text>
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
