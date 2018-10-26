import React, { Component } from "react";
import { TouchableOpacity, Text as RNText, ScrollView } from "react-native";
import { Container, Icon, View, Badge, Thumbnail, Text } from "native-base";

import { Header } from "../TabNavigator";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

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

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    console.log(charger);
    return (
      <Container>
        <Header charger={charger} connector={connector} alpha={alpha} navigation={navigation} />
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
