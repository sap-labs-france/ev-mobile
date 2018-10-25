import React, { Component } from "react";
import { ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { Container, View, Text, Button, Icon } from "native-base";

import styles from "./styles";
import headerStyles from "../TabNavigator/styles";

const caen = require("../../../../assets/Sites/caen.jpeg");

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
        <View style={headerStyles.header}>
          <View style={headerStyles.arrowIconColumn}>
            <Button transparent onPress={() => navigation.navigate("Chargers")}>
              <Icon active name="arrow-back" style={headerStyles.headerIcons} />
            </Button>
          </View>
          <View style={headerStyles.chargerNameColumn}>
            <Text style={headerStyles.chargerName}>{charger.id}</Text>
            <Text style={headerStyles.connectorName}>Connector {alpha}</Text>
          </View>
        </View>
        <View style={headerStyles.detailsContainer}>
          <ImageBackground style={headerStyles.backgroundImage} source={caen}>
            <View style={headerStyles.transactionContainer}>
              <TouchableOpacity onPress={() => connector.activeTransactionID === 0 ? this.onStartTransaction() : this.onStopTransaction()}>
                {connector.activeTransactionID === 0 ?
                  <View style={headerStyles.outerCircle}>
                    <View style={headerStyles.innerCircleStartTransaction}>
                      <Icon style={headerStyles.startStopTransactionIcon} type="MaterialIcons" name="play-arrow" />
                    </View>
                  </View>
                :
                  <View style={headerStyles.outerCircle}>
                    <View style={headerStyles.innerCircleStopTransaction}>
                      <Icon style={headerStyles.startStopTransactionIcon} type="MaterialIcons" name="stop" />
                    </View>
                  </View>
                }
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <ScrollView style={headerStyles.scrollViewContainer} />
          {/* </ScrollView> */}
        </View>
      </Container>
    );
  }
}

export default ChargerDetails;
