import React, { Component } from "react";
import { Text as RNText, ScrollView, RefreshControl } from "react-native";
import { Container, Icon, View, Badge, Thumbnail, Text } from "native-base";

import * as Animatable from "react-native-animatable";

import { Header } from "../TabNavigator";
import ProviderFactory from "../../../provider/ProviderFactory";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import styles from "./styles";
import Constants from "../../../utils/Constants";

const noPhoto = require("../../../../assets/no-photo.png");
const _provider = ProviderFactory.getProvider();

class ConnectorDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      alpha: this.props.navigation.state.params.alpha,
      user: {},
      tagID: undefined,
      timestamp: undefined,
      seconds: "00",
      minutes: "00",
      hours: "00",
      price: 0.1243,
      userImage: "",
      refreshing: false,
      isAdmin: false
    };
  }

  async componentDidMount() {
    await this._isAdmin();
    await this._getTransaction();
    await this._getPrice();
    await this._getUserImage();
    await this._setElipsedTime();
    // Start timer
    this.elapsedTime = setInterval(() => {
      this._userChargingElapsedTime();
    }, 1000);
    // Refresh every minutes
    this.timer = setInterval(() => {
      this._timerRefresh();
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
  }

  async componentWillUnmount() {
    // Clear interval if it exists
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.elapsedTime) {
      clearInterval(this.elapsedTime);
    }
  }

  _isAdmin = async () => {
     let result = await _provider._isAdmin();
     this.setState({
      isAdmin: result
     });
  }

  _getCharger = async (chargerId) => {
    try {
      let result = await _provider.getCharger(
        { ID: chargerId }
      );
      this.setState({
        refreshing: false,
        charger: result,
        connector: result.connectors[String.fromCharCode(this.state.alpha.charCodeAt() - 17)]
      });
      console.log(this.state.connector);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getTransaction = async () => {
    const { connector } = this.state;
    try {
      // Is their a transaction and are you Admin ?
      if (this.state.connector.activeTransactionID && this.state.isAdmin) {
        // Yes: Set data
        let result = await _provider.getTransaction(
          { ID: connector.activeTransactionID }
        );
        this.setState({
          user: result.user,
          tagID: result.tagID,
          timestamp: new Date(result.timestamp)
        });
        console.log(result);
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getUserImage = async () => {
    try {
      if (this.state.user.id) {
        let userImage = await _provider.getUserImage(
          { ID: this.state.user.id }
        );
        if (userImage) {
          this.setState({userImage: userImage.image});
        }
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getPrice = async () => {
    try {
      if (this.state.isAdmin) {
        let price = await _provider.getPrice();
        if (price) {
          this.setState({
            price: price.priceKWH
          });
        }
        console.log(price);
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _setElipsedTime = () => {
    // Is their a timestamp ?
    if (this.state.timestamp && this.state.isAdmin) {
      // Yes: Get date
      const timeNow = new Date();
      // Set elapsed time
      this.setState({
        hours: this.formatTimer(Math.abs(timeNow.getHours() - this.state.timestamp.getHours())),
        minutes: this.formatTimer(Math.abs(timeNow.getMinutes() - this.state.timestamp.getMinutes())),
        seconds: this.formatTimer(Math.abs(timeNow.getSeconds() - this.state.timestamp.getSeconds()))
      });
    }
  }

  formatTimer = (val) => {
    // Put 0 next to the digit if lower than 10
    let valString = val + "";

    if (valString.length < 2) {
      return "0" + valString;
    }
    // Return new digit
    return valString;
  };

  _userChargingElapsedTime = () => {
    // Set new elapsed time
    this.setState({
      seconds: this.formatTimer(++this.state.seconds % 60),
      minutes: this.state.seconds % 60 === 0 ? this.formatTimer(++this.state.minutes % 60) : this.formatTimer(this.state.minutes),
      hours: this.state.minutes % 60 === 0 && this.state.seconds % 60 === 0 ? this.formatTimer(++this.state.hours % 60) : this.formatTimer(this.state.hours)
    });
  }

  _timerRefresh = async () => {
    await this._getTransaction();
    await this._getUserImage();
    await this._getCharger(this.state.charger.id);
  }

  _onRefresh = () => {
    this.setState({refreshing: true}, async () => {
      await this._getTransaction();
      await this._getUserImage();
      await this._getCharger(this.state.charger.id);
    });
  }

  renderAdmin = () => {
    const { connector, alpha, refreshing, user, tagID, userImage, timestamp, hours, minutes, seconds, price } = this.state;
    const userPicture = !userImage ? noPhoto : {uri: userImage};
    return (
      <ScrollView style={styles.scrollViewContainer} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
      }>
        <Animatable.View style={styles.content} animation="fadeIn" delay={100}>
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              { connector.status === "Available" && connector.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badgeContainer} success>
                    <RNText style={styles.badgeText}>{alpha}</RNText>
                  </Badge>
                </Animatable.View>
              : (connector.status === "Occupied" || connector.status === "SuspendedEV") && connector.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badgeContainer} danger>
                    <RNText style={styles.badgeText}>{alpha}</RNText>
                  </Badge>
                </Animatable.View>
              : connector.currentConsumption !== 0 ?
                <Animatable.View animation="fadeIn" iterationCount={"infinite"} direction="alternate-reverse">
                  <Badge style={styles.badgeContainer} danger>
                    <RNText style={styles.badgeText}>{alpha}</RNText>
                  </Badge>
                </Animatable.View>
              : connector.status === "Finishing" || connector.status === "Preparing" ?
                <Animatable.View>
                  <Badge style={styles.badgeContainer} warning>
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
                <Text style={styles.faultedText}>{connector.info ? connector.info : connector.status}</Text>
              :
                <Text style={styles.connectorStatus}>
                  { connector.status === "Available" ?
                    I18n.t("connector.available")
                  : connector.status === "Occupied" ?
                    I18n.t("connector.occupied")
                  : connector.status === "Charging" ?
                    I18n.t("connector.charging")
                  : connector.status === "SuspendedEV" ?
                    I18n.t("connector.suspendedEV")
                  : connector.status === "Finishing" ?
                    I18n.t("connector.finishing")
                  : connector.status === "Preparing" ?
                    I18n.t("connector.preparing")
                  :
                    connector.status
                  }
                </Text>
              }
            </View>
            <View style={styles.columnContainer}>
              <Thumbnail style={styles.profilePic} source={userPicture ? userPicture : noPhoto} />
              { (user.name && user.firstName) && (`${user.name} ${user.firstName}`).length < 19 ?
                <Text style={styles.statusText}>{`${(user.name).toUpperCase()} ${user.firstName}`}</Text>
              : user.name ?
                <Text style={styles.statusText}>{`${(user.name).toUpperCase()}`}</Text>
              :
                <Text style={styles.statusText}>-</Text>
              }
              { tagID && (
                <Text style={styles.tagIdText}>({tagID})</Text>
              )}
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <Icon type="FontAwesome" name="bolt" style={styles.iconSize} />
              { connector.currentConsumption === 0.0 ?
                <Text style={styles.data}>-</Text>
              :
                <View style={styles.currentConsumptionContainer}>
                  <Text style={styles.data}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                  <Text style={styles.kWText}>{I18n.t("details.instant")}</Text>
                </View>
              }
            </View>
            <View style={styles.columnContainer}>
              { connector.currentStateOfCharge ?
                <View>
                  <Icon type="Feather" name="battery-charging" style={styles.iconSize} />
                  { connector.currentConsumption ?
                    <Text style={styles.data}>{connector.currentStateOfCharge} %</Text>
                  :
                    <Text style={styles.data}>- %</Text>
                  }
                </View>
              :
                <View style={styles.columnContainer}>
                  <Icon type="Ionicons" name="time" style={styles.iconSize} />
                  {timestamp ?
                    <Text style={styles.data}>{`${hours}:${minutes}:${seconds}`}</Text>
                  :
                    <Text style={styles.data}>- : - : -</Text>
                  }
                </View>
              }
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <Icon style={styles.iconSize} type="MaterialIcons" name="trending-up" />
              { (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                <Text style={styles.data}>-</Text>
              :
                <View style={styles.energyConsumedContainer}>
                  <Text style={styles.energyConsumedNumber}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                  <Text style={styles.energyConsumedText}>{I18n.t("details.consumed")}</Text>
                </View>
              }
            </View>
            <View style={styles.columnContainer}>
              <Icon type="MaterialIcons" name="euro-symbol" style={styles.iconSize} />
              {connector.totalConsumption ?
                <Text style={styles.data}>{(price * (connector.totalConsumption / 1000)).toFixed(2)}</Text>
              :
                <Text style={styles.data}>-</Text>
              }
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }

  renderBasic = () => {
    const { connector, alpha, refreshing, timestamp, hours, minutes, seconds } = this.state;
    return (
      <ScrollView style={styles.scrollViewContainer} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
      }>
        <Animatable.View style={styles.content} animation="fadeIn" delay={100}>
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              { connector.status === "Available" && connector.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badgeContainer} success>
                    <RNText style={styles.badgeText}>{alpha}</RNText>
                  </Badge>
                </Animatable.View>
              : (connector.status === "Occupied" || connector.status === "SuspendedEV") && connector.currentConsumption === 0 ?
                <Animatable.View>
                  <Badge style={styles.badgeContainer} danger>
                    <RNText style={styles.badgeText}>{alpha}</RNText>
                  </Badge>
                </Animatable.View>
              : connector.currentConsumption !== 0 ?
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
              {connector.status === "Faulted" ?
                <Text style={styles.faultedText}>{connector.info ? connector.info : connector.status}</Text>
              :
                <Text style={styles.connectorStatus}>
                  { connector.status === "Available" ?
                    I18n.t("connector.available")
                  : connector.status === "Occupied" ?
                    I18n.t("connector.occupied")
                  : connector.status === "Charging" ?
                    I18n.t("connector.charging")
                  : connector.status === "SuspendedEV" ?
                    I18n.t("connector.suspendedEV")
                  :
                    connector.status
                  }
                </Text>
              }
            </View>
            <View style={styles.columnContainer}>
              <Icon type="FontAwesome" name="bolt" style={styles.iconSize} />
              { (connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ?
                <Text style={styles.data}>-</Text>
              :
                <View style={styles.currentConsumptionContainer}>
                  <Text style={styles.currentConsumptionText}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                  <Text style={styles.kWText}>{I18n.t("details.instant")}</Text>
                </View>
              }
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.columnContainer}>
              <Icon type="Ionicons" name="time" style={styles.iconSize} />
              {timestamp ?
                <Text style={styles.data}>{`${hours}:${minutes}:${seconds}`}</Text>
              :
                <Text style={styles.data}>- : - : -</Text>
              }
            </View>
            <View style={styles.columnContainer}>
              <Icon style={styles.iconSize} type="MaterialIcons" name="trending-up" />
              { (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                <Text style={styles.data}>-</Text>
                :
                <View style={styles.energyConsumedContainer}>
                  <Text style={styles.energyConsumedNumber}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                  <Text style={styles.energyConsumedText}>{I18n.t("details.consumed")}</Text>
                </View>
              }
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, alpha } = this.state;
    return (
      <Container>
        <Header charger={charger} connector={connector} alpha={alpha} navigation={navigation} />
        { this.state.isAdmin ?
          this.renderAdmin()
        :
          this.renderBasic()
        }
      </Container>
    );
  }
}

export default ConnectorDetails;
