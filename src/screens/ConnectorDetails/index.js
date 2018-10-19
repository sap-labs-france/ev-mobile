import React, { Component } from "react";
import { TouchableOpacity, Alert, Dimensions, Text as RNText } from "react-native";
import { Container, Header, Left, Right, Body, Button, Icon, View, Title, Badge, Thumbnail, Text, Footer, FooterTab } from "native-base";

import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
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
      alpha: this.props.navigation.state.params.alpha,
      index: 1
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

  _handleFooterTab = (index) => {
    this.setState({index});
  }

  render() {
    console.log(deviceWidth);
    console.log(deviceHeight);
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    console.log(charger);
    return (
      <Container>
        <View style={{flexDirection: "row"}}>
          <View style={{flexDirection: "column"}}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
          </View>
          <View style={{flexDirection: "column", alignItems: "center", justifyContent: "center", width: 265, paddingTop: 7}}>
            <Text style={{fontSize: 20, fontWeight: "bold"}}>{charger.id}</Text>
            <Text style={{fontWeight: "bold", fontSize: 13}}>Connector {alpha}</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity onPress={() => connector.activeTransactionID === 0 ? this.onStartTransaction() : this.onStopTransaction()}>
              {connector.activeTransactionID === 0 ?
                <View style={{borderRadius: 80, width: 120, height: 120, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginTop: 15}}>
                  <View style={{borderRadius: 75, width: 110, height: 110, backgroundColor: "#5cb85c", justifyContent: "center", alignItems: "center"}}>
                    <Icon style={{fontSize: 70}} type="MaterialIcons" name="play-arrow" />
                  </View>
                </View>
              :
                <View style={{borderRadius: 80, width: 130, height: 130, backgroundColor: "white", justifyContent: "center", alignItems: "center", marginTop: 15}}>
                  <View style={{borderRadius: 75, width: 120, height: 120, backgroundColor: "#d9534f", justifyContent: "center", alignItems: "center"}}>
                    <Icon style={{fontSize: 70}} type="MaterialIcons" name="stop" />
                  </View>
                </View>
              }
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: "column", paddingTop: 30}}>
            <View style={{flexDirection: "row"}}>
              <View style={{flexDirection: "column", height: deviceHeight / 12.1, width: deviceWidth / 6.8, justifyContent: "center", alignItems: "center"}}>
                {connector.status === "Available" && connector.currentConsumption === 0 ?
                  <Animatable.View>
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center", borderRadius: 30}} success>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                : connector.status === "Occupied" && connector.currentConsumption === 0 ?
                  <Animatable.View>
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center", borderRadius: 30}} danger>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                : connector.status === "Occupied" && connector.currentConsumption !== 0 ?
                  <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center", borderRadius: 30}} danger>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                :
                  <Animatable.View>
                    <Badge style={{justifyContent: "center", height: deviceHeight / 16.6, width: deviceWidth / 9.3, alignItems: "center", borderRadius: 30}} danger>
                      <RNText style={{fontSize: 30, color: "#FFFFFF"}}>{alpha}</RNText>
                    </Badge>
                  </Animatable.View>
                }
              </View>
              <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 1.41}}>
                <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>{connector.status}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <View style={{flexDirection: "row"}}>
                <View style={{flexDirection: "column", height: deviceHeight / 12.1, width: deviceWidth / 6.8, justifyContent: "center", alignItems: "center"}}>
                  {connector.status === "Available" ?
                    <Thumbnail style={styles.profilePic} source={require("../../../assets/no-user.png")} />
                  :
                    <Thumbnail style={styles.profilePic} source={require("../../../assets/no-photo.png")} />
                  }
                </View>
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 1.41}}>
                  <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>-</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={{flexDirection: "row"}}>
              <View style={{flexDirection: "column", height: deviceHeight / 12.1, width: deviceWidth / 6.8, justifyContent: "center", alignItems: "center"}}>
                <Icon type="MaterialIcons" name="trending-up" style={{fontSize: 37}} />
              </View>
              <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 1.41}}>
                <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>
                  {(connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ? "-" : (connector.currentConsumption / 1000).toFixed(1) + " kW Instant"}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: "row"}}>
              <View style={{flexDirection: "column", height: deviceHeight / 12.1, width: deviceWidth / 6.8, justifyContent: "center", alignItems: "center"}}>
                <Icon type="Ionicons" name="time" style={{fontSize: 37}} />
              </View>
              <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 1.41}}>
                <Text style={{fontSize: 18, fontWeight: "bold", color: "#FFFFFF"}}>- : - : -</Text>
              </View>
            </View>
          </View>
        </View>
        <Footer>
          <FooterTab>
            <Button vertical active={this.state.index === 1 ? true : false} onPress={()=>this._handleFooterTab(1)}>
              <Icon active={this.state.index === 1 ? true : false} type="Feather" name="zap"/>
              <Text>Connector</Text>
            </Button>
            <Button vertical active={this.state.index === 2 ? true : false} onPress={()=>this._handleFooterTab(2)}>
              <Icon active={this.state.index === 2 ? true : false} type="MaterialIcons" name="info" />
              <Text>Information</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default ConnectorDetails;
