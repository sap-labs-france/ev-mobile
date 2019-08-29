import React from "react";
import BaseScreen from "../../base-screen/BaseScreen";
import TransactionChart from "./TransactionChart";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./TransactionChartStyles";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import { Container } from "native-base";
import HeaderComponent from "../../../components/header/HeaderComponent";
import I18n from "../../../I18n/I18n";

export default class TransactionChartContainer extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      transactionID: Utils.getParamFromNavigation(this.props.navigation, "transactionID", null)
    };
  }

  async componentWillMount() {
    // Call parent
    await super.componentWillMount();
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  render() {
    const style = computeStyleSheet();
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("transactions.chargingCurve")}
            leftAction={() => this.props.navigation.navigate("Transactions", {})}
            leftActionIcon={"navigate-before"}
            rightAction={this.props.navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <TransactionChart transactionID={this.state.transactionID} navigation={this.props.navigation} showTransactionDetails={true} />
        </BackgroundComponent>
      </Container>
    );
  }
}
