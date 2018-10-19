import React, { Component } from "react";
import { TouchableOpacity, Alert, Dimensions, Text as RNText, ScrollView, RefreshControl, ImageBackground } from "react-native";
import { Container, Button, Icon, View, Badge, Thumbnail, Text, Footer, FooterTab } from "native-base";

import ProviderFactory from "../../provider/ProviderFactory";
import Utils from "../../utils/Utils";

import * as Animatable from "react-native-animatable";
import styles from "./styles";

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
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    // console.log(charger);
    return (
      <Container>
        <View style={styles.header}>
          <View style={styles.arrowIconColumn}>
            <Button transparent onPress={() => navigation.goBack()}>
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
          <ScrollView refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
          }
          style={styles.scrollViewContainer}
          >
            <View style={styles.content}>
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
                    <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
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
                <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1}}>
                  {connector.status === "Available" ?
                    <View>
                      <Thumbnail style={styles.profilePic} source={require("../../../assets/no-user.png")} />
                      <Text style={styles.undefinedStatusText}>-</Text>
                    </View>
                  :
                    <TouchableOpacity>
                      <Thumbnail style={styles.profilePic} source={require("../../../assets/no-photo.png")} />
                      <Text style={styles.undefinedStatusText}>User</Text>
                    </TouchableOpacity>
                  }
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Icon type="FontAwesome" name="bolt" style={{fontSize: 37}} />
                  {(connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ?
                    <Text style={styles.undefinedStatusText}>-</Text>
                  :
                    <View style={styles.currentConsumptionContainer}>
                      <Text style={{fontWeight: "bold", fontSize: 25, paddingTop: 10}}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                      <Text style={{fontSize: 12}}>kW Instant</Text>
                    </View>
                  }
                </View>
                <View style={styles.timerContainer}>
                  <Icon type="Ionicons" name="time" style={{fontSize: 37}} />
                  <Text style={styles.undefinedStatusText}>- : - : -</Text>
                </View>
              </View>
              <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                  <Icon style={{fontSize: 37}} type="MaterialIcons" name="trending-up" />
                  {(connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                    <Text style={styles.undefinedStatusText}>-</Text>
                  :
                    <View style={styles.energyConsumedContainer}>
                      <Text style={styles.energyConsumedNumber}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                      <Text style={styles.energyConsumedText}>Energy consumed</Text>
                    </View>
                  }
                </View>
              </View>
            </View>
          </ScrollView>
        <Footer style={styles.footerContainer}>
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
