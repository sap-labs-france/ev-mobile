import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Container, View, Text } from "native-base";

import { Header } from "../TabNavigator";
import I18n from "../../../I18n/I18n";

import styles from "./styles";

class ChargerDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha
    };
  }

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    return (
      <Container>
        <Header charger={charger} connector={connector} navigation={navigation} />
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.content}>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>{I18n.t("details.vendor")}</Text>
                  <Text style={styles.infoContent}>{charger.chargePointVendor ? charger.chargePointVendor : "-"}</Text>
                </View>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>{I18n.t("details.model")}</Text>
                  <Text style={styles.infoContent}>{charger.chargePointModel ? charger.chargePointModel : "-"}</Text>
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>{I18n.t("details.ocppVersion")}</Text>
                  <Text style={styles.infoContent}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
                </View>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>{I18n.t("details.firmwareVersion")}</Text>
                  <Text style={styles.infoContent}>{charger.firmwareVersion ? charger.firmwareVersion : "-"}</Text>
                </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

export default ChargerDetails;
