import React from "react";
import { Container, View, Text } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./styles";
import ChargerHeader from "../ChargerHeader";

class ChargerDetails extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector
    };
  }

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { charger, connector } = this.state;
    return (
      <Container>
        <ChargerHeader charger={charger} connector={connector} navigation={navigation} />
        <View style={style.scrollViewContainer}>
          <View style={style.rowContainer}>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.vendor")}</Text>
                <Text style={style.value}>{charger.chargePointVendor ? charger.chargePointVendor : "-"}</Text>
              </View>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.model")}</Text>
                <Text style={style.value}>{charger.chargePointModel ? charger.chargePointModel : "-"}</Text>
              </View>
          </View>
          <View style={style.rowContainer}>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.ocppVersion")}</Text>
                <Text style={style.value}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
              </View>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.firmwareVersion")}</Text>
                <Text style={style.value}>{charger.firmwareVersion ? charger.firmwareVersion : "-"}</Text>
              </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default ChargerDetails;
