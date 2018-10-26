import React, { Component } from "react";
import { TouchableOpacity, Text as RNText, ScrollView, RefreshControl } from "react-native";
import { Container, Icon, View, Badge, Thumbnail, Text } from "native-base";

import * as Animatable from "react-native-animatable";

import { Header } from "../TabNavigator";
import ProviderFactory from "../../../provider/ProviderFactory";
import Utils from "../../../utils/Utils";
import styles from "./styles";

const noPhoto = require("../../../../assets/no-photo.png");

class ConnectorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha,
      refreshing: false
    };
  }

  getCharger = async (chargerId) => {
    try {
      let result = await ProviderFactory.getProvider().getCharger(
        { ID: chargerId }
      );
      return (result);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true}, async () => {
      let result = await this.getCharger(this.state.charger.id);
      console.log("Stored: ", result);
      this.setState({
        refreshing: false,
        charger: result,
        connector: result.connectors[String.fromCharCode(this.state.alpha.charCodeAt() - 17)]
      });
    });
  }

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, alpha, refreshing } = this.state;
    return (
      <Container>
        <Header charger={charger} connector={connector} alpha={alpha} navigation={navigation} />
        <ScrollView style={styles.scrollViewContainer} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }>
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
      </Container>
    );
  }
}

export default ConnectorDetails;
