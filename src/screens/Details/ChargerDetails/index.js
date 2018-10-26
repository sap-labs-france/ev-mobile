import React, { Component } from "react";
import { ScrollView } from "react-native";
import { Container, View, Text } from "native-base";

import { Header } from "../TabNavigator";
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
        <Header charger={charger} connector={connector} alpha={alpha} navigation={navigation} />
        <ScrollView style={styles.scrollViewContainer}>
          <View style={styles.content}>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>Vendor</Text>
                  <Text style={styles.infoContent}>{charger.chargePointVendor ? charger.chargePointVendor : "-"}</Text>
                </View>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>Model</Text>
                  <Text style={styles.infoContent}>{charger.chargePointModel ? charger.chargePointModel : "-"}</Text>
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>OCPP Version</Text>
                  <Text style={styles.infoContent}>{charger.ocppVersion ? charger.ocppVersion : "-"}</Text>
                </View>
                <View style={styles.columnContainer}>
                  <Text style={styles.titleHeader}>Firmware Version</Text>
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
