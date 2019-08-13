import React from "react";
import BaseScreen from "../../base-screen/BaseScreen";
import SessionChart from "./SessionChart";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./SessionChartStyles";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import { Container } from "native-base";
import HeaderComponent from "../../../components/header/HeaderComponent";
import I18n from "../../../I18n/I18n";

export default class SessionChartContainer extends BaseScreen {
  constructor(props) {
    super(props);

    this.state = {
      sessionID: Utils.getParamFromNavigation(this.props.navigation, "sessionID", null)
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
            title={I18n.t("sessions.chargingCurve")}
            leftAction={() => this.props.navigation.navigate("Sessions", {})}
            leftActionIcon={"navigate-before"}
            rightAction={this.props.navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <SessionChart sessionID={this.state.sessionID} navigation={this.props.navigation} />
        </BackgroundComponent>
      </Container>
    );
  }
}
