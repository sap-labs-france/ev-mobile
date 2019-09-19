import { Container } from "native-base";
import React from "react";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import HeaderComponent from "../../../components/header/HeaderComponent";
import Utils from "../../../utils/Utils";
import BaseScreen from "../../base-screen/BaseScreen";
import TransactionChart from "./TransactionChart";
import computeStyleSheet from "./TransactionChartStyles";

import I18n from "../../../I18n/I18n";

export default class TransactionChartContainer extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      transactionID: Utils.getParamFromNavigation(this.props.navigation, "transactionID", null),
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Refresh Admin
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    this.setState({
      isAdmin: securityProvider ? securityProvider.isAdmin() : false
    });
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

  render() {
    const style = computeStyleSheet();
    const { isAdmin } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("transactions.chargingCurve")}
            leftAction={this.onBack}
            leftActionIcon={"navigate-before"}
            rightAction={this.props.navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <TransactionChart
            transactionID={this.state.transactionID}
            navigation={this.props.navigation}
            showTransactionDetails={true}
            isAdmin={isAdmin}
          />
        </BackgroundComponent>
      </Container>
    );
  }
}
