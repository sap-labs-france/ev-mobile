import React, { Component } from "react";
import { TouchableOpacity, Alert, Text as RNText, ScrollView, ImageBackground } from "react-native";
import { Container, Button, Icon, View, Badge, Thumbnail, Text, Footer, FooterTab } from "native-base";
import { TabNavigator } from "react-navigation";

import ProviderFactory from "../../provider/ProviderFactory";
import Utils from "../../utils/Utils";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

const caen = require("../../../assets/Sites/caen.jpeg");
const noUser = require("../../../assets/no-user.png");
const noPhoto = require("../../../assets/no-photo.png");

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
      let result = await ProviderFactory.getProvider().startTransaction(charger.id, "9C709F16", connector.connectorId);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error);
    }
  }

  stopTransaction = async () => {
    const { charger, connector } = this.state;
    try {
      let result = await ProviderFactory.getProvider().stopTransaction(charger.id, connector.activeTransactionID);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error);
    }
  }

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    return (
      <Container>
        <View style={styles.header}>
          <View style={styles.arrowIconColumn}>
            <Button transparent onPress={() => navigation.navigate("Chargers")}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
          </View>
          <View style={styles.chargerNameColumn}>
            <Text style={styles.chargerName}>{charger.id}</Text>
            <Text style={styles.connectorName}>Connector {alpha}</Text>
          </View>
        </View>
        <View style={styles.backgroundContainer}>
          <ImageBackground style={styles.backgroundImage} source={caen}>
            <View style={styles.transactionContainer}>
              <TouchableOpacity onPress={() => connector.activeTransactionID === 0 ? this.onStartTransaction() : this.onStopTransaction()}>
                {connector.activeTransactionID === 0 ?
                  <View style={styles.outerCircle}>
                    <View style={styles.innerCircleStartTransaction}>
                      <Icon style={styles.startStopTransactionIcon} type="MaterialIcons" name="play-arrow" />
                    </View>
                  </View>
                :
                  <View style={styles.outerCircle}>
                    <View style={styles.innerCircleStopTransaction}>
                      <Icon style={styles.startStopTransactionIcon} type="MaterialIcons" name="stop" />
                    </View>
                  </View>
                }
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        <ScrollView style={styles.scrollViewContainer}>
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
                <Text style={styles.undefinedStatusText}>{connector.status}</Text>
              </View>
              <View style={styles.userInfoContainer}>
                {connector.status === "Available" ?
                  <View>
                    <Thumbnail style={styles.profilePic} source={noUser} />
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
      </Container>
    );
  }
}

class ChargerDetails extends Component {

  render() {
    return (
      <Container>
        <View style={{justifyContent: "center", alignItems: "center", flex: 1}}>
          <Text>Not implemented yet</Text>
        </View>
      </Container>
    );
  }
}

const Details = TabNavigator({
  ConnectorDetails: { screen: ConnectorDetails },
  ChargerDetails: { screen: ChargerDetails }
},
{
  tabBarPosition: "bottom",
  swipeEnabled: false,
  tabBarComponent: props => {
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab>
          <Button vertical active={props.navigationState.index === 0} onPress={()=>props.navigation.navigate("ConnectorDetails")}>
            <Icon type="Feather" name="zap"/>
            <Text>Connector</Text>
          </Button>
          <Button vertical active={props.navigationState.index === 1} onPress={()=>props.navigation.navigate("ChargerDetails")}>
            <Icon type="MaterialIcons" name="info" />
            <Text>Information</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
});

export default Details;
