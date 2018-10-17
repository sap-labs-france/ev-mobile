import React, { Component } from "react";
import { TouchableOpacity, Alert, Dimensions, Text as RNText } from "react-native";
import { Container, Header, Left, Right, Body, Button, Icon, View, Title, Badge, Thumbnail, Text } from "native-base";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

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
        {text: "Yes", onPress: () => console.log("Yes button clicked")},
        {text: "No", onPress: () => console.log("No button clicked")}
      ]
    );
  }

  onStopTransaction = () => {
    const { charger } = this.state;
    Alert.alert(
      "Stop Transaction",
      `Do you really want to stop the session of the charging station ${charger.id} ?`,
      [
        {text: "Yes", onPress: () => console.log("Yes button clicked")},
        {text: "No", onPress: () => console.log("No button clicked")}
      ]
    );
  }

  render() {
    console.log(deviceWidth);
    console.log(deviceHeight);
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    console.log(charger);
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
          </Left>
          <Body>
            <Title style={{fontSize: 13, fontWeight: "bold"}}>{charger.id}</Title>
          </Body>
          <Right />
        </Header>
        <View style={{flex: 1}}>
          <View style={{marginTop: 15}}>
            {connector.activeTransactionID === 0 ?
              <Button block success onPress={this.onStartTransaction}>
                <Text style={{fontWeight: "bold"}}>START TRANSACTION</Text>
              </Button>
            :
              <Button block danger onPress={this.onStopTransaction}>
                <Text style={{fontWeight: "bold"}}>STOP TRANSACTION</Text>
              </Button>
            }
          </View>
          <View style={{flexDirection: "column", marginTop: 50, backgroundColor: "#008B8B"}}>
            <View style={{flexDirection: "row", backgroundColor: "#9400D3"}}>
              <View style={{flexDirection: "column", backgroundColor: "#808080", height: deviceHeight / 12.1, width: deviceWidth / 6.2, justifyContent: "center", alignItems: "center"}}>
                {connector.status === "Available" && connector.currentConsumption === 0 ?
                  <Animatable.View>
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center"}} success>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                : connector.status === "Occupied" && connector.currentConsumption === 0 ?
                  <Animatable.View>
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center"}} danger>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                : connector.status === "Occupied" && connector.currentConsumption !== 0 ?
                  <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center"}} danger>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                :
                  <Animatable.View>
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center"}} danger>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                }
              </View>
              <View style={{flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DAA520"}}>
                <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>{connector.status}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <View style={{flexDirection: "row", backgroundColor: "#9400D3"}}>
                <View style={{flexDirection: "column", backgroundColor: "#808080", height: deviceHeight / 12.1, width: deviceWidth / 6.2, justifyContent: "center", alignItems: "center"}}>
                    <Thumbnail style={styles.profilePic} source={require("../../../assets/no-photo.png")} />
                </View>
                <View style={{flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DAA520"}}>
                  <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>-</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: "row", backgroundColor: "#9400D3"}}>
              <View style={{flexDirection: "column", backgroundColor: "#808080", height: deviceHeight / 12.1, width: deviceWidth / 6.2, justifyContent: "center", alignItems: "center"}}>
                <Icon type="MaterialIcons" name="trending-up" style={{fontSize: 37}} />
              </View>
              <View style={{flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DAA520"}}>
                <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>
                  {(connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ? "-" : (connector.currentConsumption / 1000).toFixed(1) + " kW Instant"}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: "row", backgroundColor: "#9400D3"}}>
              <View style={{flexDirection: "column", backgroundColor: "#808080", height: deviceHeight / 12.1, width: deviceWidth / 6.2, justifyContent: "center", alignItems: "center"}}>
                <Icon type="Ionicons" name="time" style={{fontSize: 37}} />
              </View>
              <View style={{flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#DAA520"}}>
                <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>- : - : -</Text>
              </View>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}

export default ConnectorDetails;
