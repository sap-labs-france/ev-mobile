import I18n from "i18n-js";
import { Icon, Spinner, Tab, TabHeading, Tabs } from "native-base";
import React from "react";
import { ScrollView } from "react-native";
import BackgroundComponent from "../../components/background/BackgroundComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import TransactionChart from "../../screens/transactions/chart/TransactionChart";
import BaseProps from "../../types/BaseProps";
import Transaction from "../../types/Transaction";
import Utils from "../../utils/Utils";
import BaseScreen from "../base-screen/BaseScreen";
import TransactionDetails from "./details/TransactionDetails";
import computeStyleSheet from "./TransactionDetailsTabsStyles";

export interface Props extends BaseProps {
}

interface State {
  transaction?: Transaction;
  selectedTabIndex?: number;
  firstLoad?: boolean;
  isAdmin?: boolean;
}

export default class TransactionDetailsTabs extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      transaction: null,
      selectedTabIndex: 0,
      firstLoad: true,
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
      await this.getTransaction();
      // Refresh Admin
      const securityProvider = this.centralServerProvider.getSecurityProvider();
      this.setState({
        firstLoad: false,
        isAdmin: securityProvider ? securityProvider.isAdmin() : false
      });
    }
  };

  public getTransaction = async () => {
    // Get IDs
    const transactionID = Utils.getParamFromNavigation(this.props.navigation, "transactionID", null);
    try {
      // Get Transaction
      const transaction = await this.centralServerProvider.getTransaction({ ID: transactionID });
      this.setState({
        transaction
      });
    } catch (error) {
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  public render() {
    const style = computeStyleSheet();
    const { transaction, isAdmin, firstLoad } = this.state;
    const { navigation } = this.props;
    const connectorLetter = transaction ? Utils.getConnectorLetterFromConnectorID(transaction.connectorId) : '';
    return firstLoad ? (
      <Spinner style={style.spinner} />
    ) : (
      <ScrollView contentContainerStyle={style.container}>
        <BackgroundComponent navigation={navigation} active={false}>
          <HeaderComponent
            navigation={this.props.navigation}
            title={transaction ? transaction.chargeBoxID : ''}
            subTitle={`(${I18n.t("details.connector")} ${connectorLetter})`}
            leftAction={() => this.onBack()}
            leftActionIcon={"navigate-before"}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <Tabs tabBarPosition="bottom" locked={false} initialPage={0}>
            <Tab
              heading={
                <TabHeading style={style.tabHeader}>
                  <Icon style={style.tabIcon} type="MaterialIcons" name="info" />
                </TabHeading>
              }>
              <TransactionDetails transaction={transaction} isAdmin={isAdmin} navigation={navigation} />
            </Tab>
              <Tab
                heading={
                  <TabHeading style={style.tabHeader}>
                    <Icon style={style.tabIcon} type="AntDesign" name="linechart" />
                  </TabHeading>
                }>
                <TransactionChart transactionID={transaction ? transaction.id : null} navigation={navigation} isAdmin={isAdmin} />
              </Tab>
          </Tabs>
        </BackgroundComponent>
      </ScrollView>
    );
  }
}
