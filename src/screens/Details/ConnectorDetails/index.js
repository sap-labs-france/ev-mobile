import React, { Component } from "react";
import { TouchableOpacity, Text as RNText, ScrollView, RefreshControl } from "react-native";
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
      userID: undefined,
      tagID: undefined,
      timestamp: undefined,
      seconds: undefined,
      minutes: undefined,
      hours: undefined,
      userImage: undefined,
      refreshing: false
    };
  }

  async componentDidMount() {
    if (this.state.connector.activeTransactionID) {
      const result = await this._getTransaction();
      this.setState({
        user: result.user,
        tagID: result.tagID,
        timestamp: new Date(result.timestamp),
        userID: result.user.id
      }, async () => {
          await this._getUserImage();
      });
    }
    this.timer = setInterval(() => {
      this._timerRefresh();
    }, 30000);
    if (this.state.timestamp) {
      const timeNow = new Date();
      let hours = this.format(Math.abs(timeNow.getHours() - this.state.timestamp.getHours()));
      let minutes = this.format(Math.abs(timeNow.getMinutes() - this.state.timestamp.getMinutes()));
      let seconds = this.format(Math.abs(timeNow.getSeconds() - this.state.timestamp.getSeconds()));
      this.setState({
        hours,
        minutes,
        seconds
      }, () => {
        this.elapsedTime = setInterval(() => {
          this.setState({
            seconds: this.format(++this.state.seconds)
          });
          this._userChargingElapsedTime();
        }, 1000);
      });
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.elapsedTime) {
      clearInterval(this.elapsedTime);
    }
  }

  _getCharger = async (chargerId) => {
    try {
      let result = await _provider.getCharger(
        { ID: chargerId }
      );
      return (result);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getTransaction = async () => {
  const { connector } = this.state;
    try {
      let result = await _provider.getTransaction(
        { ID: connector.activeTransactionID }
      );
      console.log("Transaction :", result);
      return result;
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getUserImage = async () => {
    const { userID } = this.state;
    let userImage;
    try {
      userImage = await _provider.getUserImage(
        { ID: userID }
      );
      if (userImage.image) {
        this.setState({userImage: userImage.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  format = (val) => {
    let valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  };

  _userChargingElapsedTime = () => {
    this.setState({
      seconds: this.format(this.state.seconds % 60),
      minutes: this.state.seconds % 60 === 0 ? this.format(++this.state.minutes) : this.format(this.state.minutes),
      hours: this.state.minutes % 60 === 0 ? this.format(++this.state.hours) : this.format(this.state.hours)
    });
  }

  _timerRefresh = async () => {
    let result = await this._getCharger(this.state.charger.id);
    this.setState({
      charger: result,
      connector: result.connectors[String.fromCharCode(this.state.alpha.charCodeAt() - 17)]
    }, () => console.log("Refreshed: ", this.state.charger));
  }

  _onRefresh = () => {
    this.setState({refreshing: true}, async () => {
      let result = await this._getCharger(this.state.charger.id);
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
    const { charger, connector, alpha, refreshing, user, tagID, userImage, timestamp} = this.state;
    return (
      <Container>
        <Header charger={charger} connector={connector} alpha={alpha} navigation={navigation} />
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
                  <Text style={styles.faultedText}>{connector.info}</Text>
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
              <View style={styles.userInfoContainer}>
                {connector.status === "Available" ?
                  <View>
                    <Thumbnail style={styles.profilePic} source={noPhoto} />
                    <Text style={styles.undefinedStatusText}>-</Text>
                  </View>
                :
                  <View>
                    <Thumbnail style={styles.profilePic} source={userImage ? {uri: userImage} : noPhoto} />
                    <Text style={styles.statusText}>{`${user.name} ${user.firstName}`}</Text>
                    {_provider._isAdmin() && (
                      <Text style={styles.tagIdText}>({tagID})</Text>
                    )}
                  </View>
                }
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <Icon type="FontAwesome" name="bolt" style={styles.iconSize} />
                { (connector.currentConsumption / 1000).toFixed(1) === 0.0 || connector.currentConsumption === 0 ?
                  <Text style={styles.undefinedStatusText}>-</Text>
                :
                  <View style={styles.currentConsumptionContainer}>
                    <Text style={styles.currentConsumptionText}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                    <Text style={styles.kWText}>{I18n.t("details.instant")}</Text>
                  </View>
                }
              </View>
              <View style={styles.timerContainer}>
                <Icon type="Ionicons" name="time" style={styles.iconSize} />
                {timestamp ?
                  <Text style={styles.undefinedStatusText}>{`${this.state.hours}:${this.state.minutes}:${this.state.seconds}`}</Text>
                :
                  <Text style={styles.undefinedStatusText}>- : - : -</Text>
                }
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <Icon style={styles.iconSize} type="MaterialIcons" name="trending-up" />
                { (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                  <Text style={styles.undefinedStatusText}>-</Text>
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
      </Container>
    );
  }
}

export default ConnectorDetails;
