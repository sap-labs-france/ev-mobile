import React from "react";

import BaseScreen from "../../base-screen/BaseScreen";
import ChargerChartDetails from "../chart/ChargerChartDetails";
import Utils from "../../../utils/Utils";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./ChartHistoryStyle";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import { Container, Icon, View, Thumbnail, Text } from "native-base";
import HeaderComponent from "../../../components/header/HeaderComponent";

export default class ChartHistory extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      transactionId: Utils.getParamFromNavigation(this.props.navigation, "transactionId", null)
    };
  }

  async componentWillMount() {
    // Call parent
    await super.componentWillMount();
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Get the sites
    // await this.refresh();
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
            title={"History"}
            leftAction={() => this.props.navigation.navigate("AllSessions", {})}
            leftActionIcon={"navigate-before"}
            rightAction={this.props.navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <ChargerChartDetails transactionID={this.state.transactionId} navigation={this.props.navigation} />
        </BackgroundComponent>
      </Container>
    );
  }
}
