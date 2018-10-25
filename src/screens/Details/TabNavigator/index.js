import React, { Component } from "react";
import { TouchableOpacity, ImageBackground, Alert } from "react-native";
import { Button, Icon, Text, Footer, FooterTab, View } from "native-base";
import { TabNavigator } from "react-navigation";
import Orientation from "react-native-orientation";

import ProviderFactory from "../../../provider/ProviderFactory";
import Utils from "../../../utils/Utils";

import ConnectorDetails from "../ConnectorDetails";
import ChargerDetails from "../ChargerDetails";
import GraphDetails from "../GraphDetails";
import styles from "./styles";

const caen = require("../../../../assets/Sites/caen.jpeg");

export class Header extends Component {

  constructor(props) {
    super(props);
  }

  onStartTransaction = () => {
    const { charger } = this.props;
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
    const { charger } = this.props;
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
    const { charger, connector } = this.props;
    try {
      await ProviderFactory.getProvider().startTransaction(charger.id, connector.connectorId);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  stopTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      await ProviderFactory.getProvider().stopTransaction(charger.id, connector.activeTransactionID);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const { charger, connector, alpha, navigation } = this.props;
    return (
      <View>
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
        <View style={styles.detailsContainer}>
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
      </View>
    );
  }
}

class TabDetails extends Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    this.isGraphTabActive();
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations();
  }

  isGraphTabActive = () => {
    if (this.props.navigationState.index === 1) {
      Orientation.unlockAllOrientations();
      Orientation.lockToLandscape();
    } else {
      Orientation.unlockAllOrientations();
      Orientation.lockToPortrait();
    }
  }

  render() {
    return (
      <Footer style={styles.footerContainer}>
        <FooterTab>
          <Button vertical active={this.props.navigationState.index === 0} onPress={()=>this.props.navigation.navigate("ConnectorDetails")}>
            <Icon type="Feather" name="zap"/>
            <Text>Connector</Text>
          </Button>
          <Button vertical active={this.props.navigationState.index === 1} onPress={()=>this.props.navigation.navigate("GraphDetails")}>
            <Icon type="MaterialIcons" name="timeline" />
            <Text>Graph</Text>
          </Button>
          <Button vertical active={this.props.navigationState.index === 2} onPress={()=>this.props.navigation.navigate("ChargerDetails")}>
            <Icon type="MaterialIcons" name="info" />
            <Text>Informations</Text>
          </Button>
        </FooterTab>
      </Footer>
    );
  }
}

const Details = TabNavigator(
  {
    ConnectorDetails: { screen: ConnectorDetails },
    GraphDetails: { screen: GraphDetails },
    ChargerDetails: { screen: ChargerDetails }
  },
  {
    tabBarPosition: "bottom",
    swipeEnabled: false,
    initialRouteName: "ConnectorDetails",
    animationEnabled: false,
    tabBarComponent: props => {
      return (
        <TabDetails {...props} />
      );
    }
  }
);

export default Details;
