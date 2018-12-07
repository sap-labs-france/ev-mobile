import React, { Component } from "react";
import { Text as RNText, ScrollView, RefreshControl } from "react-native";
import { Container, Icon, View, Badge, Thumbnail, Text } from "native-base";

import * as Animatable from "react-native-animatable";

import { Header } from "../TabNavigator";
import ProviderFactory from "../../../provider/ProviderFactory";
import ConnectorStatusComponent from "../../../components/ConnectorStatus";
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
      transaction: null,
      seconds: "00",
      minutes: "00",
      hours: "00",
      price: 0,
      userImage: null,
      refreshing: false,
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Get Current Transaction
    await this._getTransaction();
    // Get the Price
    await this._getPrice();
    // Set Admin
    await this._setIsAdmin()
    // Init
    this._refreshElapsedTime();
    // Refresh Charger Data
    this.timerChargerData = setInterval(() => {
      this._refreshChargerData();
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
  }

  async componentWillUnmount() {
    // Clear interval if it exists
    if (this.timerChargerData) {
      clearInterval(this.timerChargerData);
    }
    if (this.timerElapsedTime) {
      clearInterval(this.timerElapsedTime);
    }
  }

  _setIsAdmin = async () => {
    // Set Admin
    const isAdmin = await _provider._isAdmin();
    this.setState({
      isAdmin
    });
  }

  _getCharger = async () => {
    try {
      let charger = await _provider.getCharger(
        { ID: this.state.charger.id }
      );
      this.setState({
        refreshing: false,
        charger: charger,
        connector: charger.connectors[this.state.connector.connectorId - 1]
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getTransaction = async () => {
    const { connector } = this.state;
    try {
      // Is their a transaction?
      if (this.state.connector.activeTransactionID) {
        // Yes: Set data
        let transaction = await _provider.getTransaction(
          { ID: connector.activeTransactionID }
        );
        // Found?
        if (transaction) {
          // Convert
          transaction.timestamp = new Date(transaction.timestamp);
          // Start timer?
          if (!this.timerElapsedTime) {
            // Get user image
            this._getUserImage(transaction.user);
            // Start
            this.timerElapsedTime = setInterval(() => {
              this._refreshElapsedTime();
            }, 1000);
          }
        } else {
          // Check Timer
          if (this.timerElapsedTime) {
            // Clear it
            clearInterval(this.timerElapsedTime);
            this.timerElapsedTime = null;
          }
        }
        this.setState({
          transaction: transaction
        });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getUserImage = async (user) => {
    try {
      if (user) {
        let userImage = await _provider.getUserImage(
          { ID: user.id }
        );
        // Set
        this.setState({userImage: userImage.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getPrice = async () => {
    try {
      let price = await _provider.getPrice();
      this.setState({
        price: price
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _refreshElapsedTime = () => {
    const { transaction } = this.state;
    // Is their a timestamp ?
    if (transaction && transaction.timestamp) {
      // Diff
      let diffSecs = (Date.now() - transaction.timestamp.getTime()) / 1000;
      // Set Hours
      const hours = Math.trunc(diffSecs / 3600);
      diffSecs -= hours * 3600;
      // Set Mins
      let minutes = 0;
      if (diffSecs > 0) {
        minutes = Math.trunc(diffSecs / 60);
        diffSecs -= minutes * 60;
      }
      // Set Secs
      const seconds = Math.trunc(diffSecs);
      // Set elapsed time
      this.setState({
        hours: this._formatTimer(hours),
        minutes: this._formatTimer(minutes),
        seconds: this._formatTimer(seconds)
      });
    }
  }

  _formatTimer = (val) => {
    // Put 0 next to the digit if lower than 10
    let valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    }
    // Return new digit
    return valString;
  };

  _refreshChargerData = async () => {
    // Read the charger
    await this._getCharger();
    // Read the transaction
    await this._getTransaction();
  }

  _onRefresh = () => {
    this.setState({refreshing: true}, async () => {
      // Refresh
      await this._refreshChargerData();
    });
  }

  render() {
    const navigation = this.props.navigation;
    const { charger, connector, refreshing, userImage, transaction, hours, minutes, seconds, price } = this.state;
    const userPicture = !userImage ? noPhoto : {uri: userImage};
    return (
      <Container>
        <Header charger={charger} connector={connector} navigation={navigation} />
        <ScrollView style={styles.scrollViewContainer} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._onRefresh} />
        }>
          <Animatable.View style={styles.content} animation="fadeIn" delay={100}>
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <ConnectorStatusComponent connector={connector}/>
                <Text style={styles.label}>{Utils.translateConnectorStatus(connector.status)}</Text>
              </View>
              <View style={styles.columnContainer}>
                <Thumbnail style={styles.profilePicture} source={userPicture ? userPicture : noPhoto} />
                {transaction ?
                  <View>
                    <Text style={styles.labelUser}>{Utils.buildUserName(transaction.user)}</Text>
                    <Text style={styles.subLabel}>({transaction.tagID})</Text>
                  </View>
                :
                  <Text style={styles.label}>-</Text>
                }
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <Icon type="FontAwesome" name="bolt" style={styles.iconSize} />
                { connector.currentConsumption === 0.0 ?
                  <Text style={styles.label}>-</Text>
                :
                  <View style={styles.currentConsumptionContainer}>
                    <Text style={styles.labelValue}>{(connector.currentConsumption / 1000).toFixed(1)}</Text>
                    <Text style={styles.subLabel}>{I18n.t("details.instant")} (kW)</Text>
                  </View>
                }
              </View>
              <View style={styles.columnContainer}>
                { connector.currentStateOfCharge ?
                  <View>
                    <Icon type="Feather" name="battery-charging" style={styles.iconSize} />
                    { connector.currentConsumption ?
                      <Text style={styles.label}>{connector.currentStateOfCharge} %</Text>
                    :
                      <Text style={styles.label}>- %</Text>
                    }
                  </View>
                :
                  <View style={styles.columnContainer}>
                    <Icon type="Ionicons" name="time" style={styles.iconSize} />
                    {transaction && transaction.timestamp ?
                      <Text style={styles.labelValue}>{`${hours}:${minutes}:${seconds}`}</Text>
                    :
                      <Text style={styles.labelValue}>- : - : -</Text>
                    }
                  </View>
                }
              </View>
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.columnContainer}>
                <Icon style={styles.iconSize} type="MaterialIcons" name="trending-up" />
                { (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                  <Text style={styles.labelValue}>-</Text>
                :
                  <View style={styles.energyConsumedContainer}>
                    <Text style={styles.labelValue}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                    <Text style={styles.subLabel}>{I18n.t("details.total")} (kW.h)</Text>
                  </View>
                }
              </View>
              <View style={styles.columnContainer}>
                <Icon type="MaterialIcons" name="euro-symbol" style={styles.iconSize} />
                {connector.totalConsumption && price ?
                  <View>
                    <Text style={styles.labelValue}>{(price.priceKWH * (connector.totalConsumption / 1000)).toFixed(2)}</Text>
                    <Text style={styles.subLabel}>({price.priceUnit})</Text>
                  </View>
                :
                  <Text style={styles.labelValue}>-</Text>
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
