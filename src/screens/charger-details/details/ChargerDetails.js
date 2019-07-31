import React from "react";
import { ScrollView } from "react-native";
import { Container, View, Text } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import I18n from "../../../I18n/I18n";
import computeStyleSheet from "./ChargerDetailsStyles";
import PropTypes from "prop-types";
import BackgroundComponent from "../../../components/background/BackgroundComponent";


export default class ChargerDetails extends ResponsiveComponent {
  render() {
    const style = computeStyleSheet();
    const { charger } = this.props;
    return (
      <Container style={style.container}>
        <BackgroundComponent>
          <ScrollView style={style.scrollViewContainer}>
            <View style={style.viewContainer}>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.vendor")}</Text>
                <Text style={style.value}>
                  {charger.chargePointVendor ? charger.chargePointVendor : "-"}
                </Text>
              </View>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.model")}</Text>
                <Text style={style.value}>
                  {charger.chargePointModel ? charger.chargePointModel : "-"}
                </Text>
              </View>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.ocppVersion")}</Text>
                <Text style={style.value}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
              </View>
              <View style={style.columnContainer}>
                <Text style={style.label}>{I18n.t("details.firmwareVersion")}</Text>
                <Text style={style.value}>
                  {charger.firmwareVersion ? charger.firmwareVersion : "-"}
                </Text>
              </View>
            </View>
          </ScrollView>
        </BackgroundComponent>
      </Container>
    );
  }
}

ChargerDetails.propTypes = {
  charger: PropTypes.object.isRequired,
  connector: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

ChargerDetails.defaultProps = {};
