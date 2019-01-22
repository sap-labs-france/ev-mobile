import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Image } from "react-native";
import computeStyleSheet from "./styles";
import { Button, Icon, Text, View, Header, Body, Left, Right } from "native-base";
import I18n from "../../../I18n/I18n";

export class ChargerHeader extends ResponsiveComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
  }

  render() {
    const style = computeStyleSheet();
    const { charger, connector, navigation } = this.props;
    const connectorLetter = String.fromCharCode(64 + connector.connectorId);
    return (
      <Header style={style.header}>
        <Left style={style.leftHeader}>
          <Button transparent onPress={() => navigation.navigate("Chargers", { siteAreaID: charger.siteAreaID })}>
            <Icon active name="arrow-back" style={style.iconHeader} />
          </Button>
        </Left>
        <Body style={style.bodyHeader}>
          <Text style={style.titleHeader}>{charger.id}</Text>
          <Text style={style.subTitleHeader}>({I18n.t("details.connector")} {connectorLetter})</Text>
        </Body>
        <Right style={style.rightHeader}>
          <Image source={require("../../../../assets/logo-low.gif")} style={style.logoHeader} />
        </Right>
      </Header>
    );
  }
}

export default ChargerHeader;
