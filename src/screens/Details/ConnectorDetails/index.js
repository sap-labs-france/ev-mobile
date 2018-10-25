import React, { Component } from "react";
import { TouchableOpacity, Alert, Text as RNText, ScrollView, ImageBackground } from "react-native";
import { Container, Button, Icon, View, Badge, Thumbnail, Text } from "native-base";

import ProviderFactory from "../../../provider/ProviderFactory";
import Utils from "../../../utils/Utils";

import * as Animatable from "react-native-animatable";
import styles from "./styles";
import headerStyles from "../TabNavigator/styles";

const caen = require("../../../../assets/Sites/caen.jpeg");
const noPhoto = require("../../../../assets/no-photo.png");

class ConnectorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha
    };
  }

  onStartTransaction = () => {
    const { charger } = this.state;
    Alert.alert(
      "Start Transaction",
      `Do you really want to start a new session on the charging station ${charger.id} ?`,
      [
        {text: "Yes", onPress: () => this.startTransaction()},
        {text: "No"}
      ]
    );
  }

  onStopTransaction = () => {
    const { charger } = this.state;
    Alert.alert(
      "Stop Transaction",
      `Do you really want to stop the session of the charging station ${charger.id} ?`,
      [
        {text: "Yes", onPress: () => this.stopTransaction()},
        {text: "No"}
      ]
    );
  }

  startTransaction = async () => {
    const { charger, connector } = this.state;
    try {
      await ProviderFactory.getProvider().startTransaction(charger.id, connector.connectorId);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  stopTransaction = async () => {
    const { charger, connector } = this.state;
    try {
      await ProviderFactory.getProvider().stopTransaction(charger.id, connector.activeTransactionID);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    console.log(charger);
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
          <ScrollView style={headerStyles.scrollViewContainer}>
            <Animatable.View style={styles.content} animation="fadeIn" delay={100}>
              <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  {connector.status === "Available" && connector.currentConsumption === 0 ?
                    <Animatable.View>
                      <Badge style={styles.badgeContainer} success>
                        <RNText style={styles.badgeText}>{alpha}</RNText>
                      </Badge>
                    </Animatable.View>
                  : connector.status === "Occupied" && connector.currentConsumption === 0 ?
                  <Animatable.View>
                      <Badge style={styles.badgeContainer} danger>
                        <RNText style={styles.badgeText}>{alpha}</RNText>
                      </Badge>
                    </Animatable.View>
                  : connector.status === "Occupied" && connector.currentConsumption !== 0 ?
                  <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate">
                      <Badge style={styles.badgeContainer} danger>
                        <RNText style={styles.badgeText}>{alpha}</RNText>
                      </Badge>
                    </Animatable.View>
                  :
                  <Animatable.View>
                      <Badge style={styles.badgeContainer} danger>
                        <RNText style={styles.badgeText}>{alpha}</RNText>
                      </Badge>
                    </Animatable.View>
                  }
                  {connector.status === "Faulted" ?
                    <Text style={styles.faultedText}>{connector.info}</Text>
                  :
                    <Text style={styles.connectorStatus}>{connector.status}</Text>
                  }
                </View>
                <View style={styles.userInfoContainer}>
                  {connector.status === "Available" ?
                    <View>
                      <Thumbnail style={styles.profilePic} source={noPhoto} />
                      <Text style={styles.undefinedStatusText}>-</Text>
                    </View>
                  :
                  <TouchableOpacity>
                      <Thumbnail style={styles.profilePic} source={noPhoto} />
                      <Text style={styles.undefinedStatusText}>User</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Icon type="FontAwesome" name="bolt" style={styles.iconSize} />
                  {(connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ?
                    <Text style={styles.undefinedStatusText}>-</Text>
                    :
                    <View style={styles.currentConsumptionContainer}>
                      <Text style={styles.currentConsumptionText}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                      <Text style={styles.kWText}>kW Instant</Text>
                    </View>
                  }
                </View>
                <View style={styles.timerContainer}>
                  <Icon type="Ionicons" name="time" style={styles.iconSize} />
                  <Text style={styles.undefinedStatusText}>- : - : -</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Icon style={styles.iconSize} type="MaterialIcons" name="trending-up" />
                  {(connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                    <Text style={styles.undefinedStatusText}>-</Text>
                    :
                    <View style={styles.energyConsumedContainer}>
                      <Text style={styles.energyConsumedNumber}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                      <Text style={styles.energyConsumedText}>kW consumed</Text>
                    </View>
                  }
                </View>
              </View>
            </Animatable.View>
          </ScrollView>
        </View>
      </Container>
    );
  }
}

export default ConnectorDetails;
