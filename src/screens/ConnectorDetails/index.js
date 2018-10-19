import React, { Component } from "react";
import { TouchableOpacity, Alert, Dimensions, Text as RNText, ScrollView, RefreshControl, ImageBackground } from "react-native";
import { Container, Button, Icon, View, Badge, Thumbnail, Text, Footer, FooterTab } from "native-base";

import ProviderFactory from "../../provider/ProviderFactory";
import Utils from "../../utils/Utils";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;

const caen = require("../../../assets/Sites/caen.jpeg");

class ConnectorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha,
      index: 1,
      refreshing: false
    };
  }

  getCharger = async (chargerId) => {
    try {
      let charger = await ProviderFactory.getProvider().getCharger(
        {ID: chargerId});
      console.log(charger);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error);
    }
    this.setState({
      refreshing: false
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true}, async () => await this.getCharger(this.state.charger.id));
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
    // console.log(deviceWidth);
    // console.log(deviceHeight);
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    // console.log(charger);
    return (
      <Container>
        <View style={{borderColor: "#FFFFFF", borderBottomWidth: 5}}>
          <ImageBackground source={caen} style={{width: deviceWidth, height: deviceHeight / 5}}>
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
            <View style={{justifyContent: "center", alignItems: "center", marginTop: 10}}>
              <TouchableOpacity onPress={() => connector.activeTransactionID === 0 ? this.onStartTransaction() : this.onStopTransaction()}>
                {connector.activeTransactionID === 0 ?
                  <View style={{borderBottomEndRadius: 80, borderBottomStartRadius: 80, width: 120, height: 120, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginTop: 15}}>
                    <View style={{borderRadius: 75, width: 110, height: 110, backgroundColor: "#5cb85c", justifyContent: "center", alignItems: "center"}}>
                      <Icon style={{fontSize: 70}} type="MaterialIcons" name="play-arrow" />
                    </View>
                  </View>
                :
                  <View style={{borderBottomEndRadius: 80, borderBottomStartRadius: 80, width: 130, height: 130, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginTop: 15}}>
                    <View style={{borderRadius: 75, width: 120, height: 120, backgroundColor: "#d9534f", justifyContent: "center", alignItems: "center"}}>
                      <Icon style={{fontSize: 70}} type="MaterialIcons" name="stop" />
                    </View>
                  </View>
                }
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
          <ScrollView refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }>
            <View style={{flexDirection: "column", flex: 1, alignItems: "center", marginTop: 80}}>
              <View style={{flexDirection: "row", justifyContent: "space-between", height: 120}}>
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 2}}>
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
                  <Text style={{fontSize: 20, fontWeight: "bold", paddingTop: 10}}>{connector.status}</Text>
                </View>
                <TouchableOpacity style={{flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1}}>
                  {connector.status === "Available" ?
                    <Thumbnail style={styles.profilePic} source={require("../../../assets/no-user.png")} />
                  :
                    <Thumbnail style={styles.profilePic} source={require("../../../assets/no-photo.png")} />
                  }
                  <Text style={{fontSize: 25, fontWeight: "bold", paddingTop: 10}}>-</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", height: 120}}>
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 2}}>
                  <Icon type="FontAwesome" name="bolt" style={{fontSize: 37}} />
                  {(connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ?
                    <Text style={{fontSize: 25, fontWeight: "bold", paddingTop: 10}}>-</Text>
                  :
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                      <Text style={{fontWeight: "bold", fontSize: 25, paddingTop: 10}}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                      <Text style={{fontSize: 12}}>kW Instant</Text>
                    </View>
                  }
                </View>
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1}}>
                  <Icon type="Ionicons" name="time" style={{fontSize: 37}} />
                  <Text style={{fontSize: 25, fontWeight: "bold", paddingTop: 10}}>- : - : -</Text>
                </View>
              </View>
              <View style={{flexDirection: "row", justifyContent: "space-between", height: 120}}>
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", width: deviceWidth / 2}}>
                  <Icon style={{fontSize: 37}} type="MaterialIcons" name="trending-up" />
                  {(connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                    <Text style={{fontSize: 25, fontWeight: "bold", paddingTop: 10}}>-</Text>
                  :
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                      <Text style={{fontWeight: "bold", fontSize: 25, paddingTop: 10}}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                      <Text style={{fontSize: 12}}>Energy consumed</Text>
                    </View>
                  }
                </View>
              </View>
            </View>
          </ScrollView>
        <Footer style={{paddingTop: 5}}>
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
