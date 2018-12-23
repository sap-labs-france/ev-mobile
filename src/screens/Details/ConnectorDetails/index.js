import React from "react";
import { ScrollView, RefreshControl, TouchableOpacity, Image, Alert } from "react-native";
import { Container, Spinner, Icon, View, Thumbnail, Text } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import * as Animatable from "react-native-animatable";
import ChargerHeader from "../ChargerHeader";
import ProviderFactory from "../../../provider/ProviderFactory";
import ConnectorStatusComponent from "../../../components/ConnectorStatus";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./styles";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";

const noPhoto = require("../../../../assets/no-photo.png");
const noSite = require("../../../../assets/no-site.gif");

const _provider = ProviderFactory.getProvider();

class ConnectorDetails extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.navigation.state.params.charger,
      connector: this.props.navigation.state.params.connector,
      siteID: this.props.navigation.state.params.siteID,
      siteImage: null,
      transaction: null,
      seconds: "00",
      minutes: "00",
      hours: "00",
      userImage: null,
      refreshing: false,
      firstLoad: true,
      loadingTransaction: false,
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Set if Admin
    const isAdmin = (await _provider.getSecurityProvider()).isAdmin();
    this.setState({isAdmin});
    // Get the Site Image
    this._getSiteImage();    
    // Get Current Transaction
    await this._getTransaction();
    // Init
    this._refreshElapsedTime();
    // Refresh Charger Data
    this.timerChargerData = setInterval(() => {
      // Component Mounted?
      if (this.mounted) {
        // Refresh
        this._refreshChargerData();
      }
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
    // Ok
    this.setState({
      firstLoad: false
    })
  }

  async componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Clear interval if it exists
    if (this.timerChargerData) {
      clearInterval(this.timerChargerData);
    }
    if (this.timerElapsedTime) {
      clearInterval(this.timerElapsedTime);
    }
  }

  onStartTransaction = () => {
    const { charger } = this.state;
    Alert.alert(
      `${I18n.t("details.startTransaction")}`,
      `${I18n.t("details.startTransactionMessage")} ${charger.id} ?`,
      [
        {text: I18n.t("general.yes"), onPress: () => this._startTransaction()},
        {text: I18n.t("general.no")}
      ]
    );
  }

  _startTransaction = async () => {
    const { charger, connector } = this.state;
    this.setState({loadingTransaction: true});
    try {
      // Start the Transaction
      let status = await _provider.startTransaction(charger.id, connector.connectorId);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    this.setState({loadingTransaction: false});
  }

  onStopTransaction = async () => {
    const { charger } = this.state;
    // Check
    const isAuthorised = await this._isAuthorizedStopTransaction();
    if (!isAuthorised) {
      Alert.alert(
        `${I18n.t("details.notAuthorisedTitle")}`,
        `${I18n.t("details.notAuthorised")}`,
        [
          {text: I18n.t("general.ok")},
        ]
      );
    } else {
      Alert.alert(
        `${I18n.t("details.stopTransaction")}`,
        `${I18n.t("details.stopTransactionMessage")} ${charger.id} ?`,
        [
          {text: I18n.t("general.yes"), onPress: () => this._stopTransaction()},
          {text: I18n.t("general.no")}
        ]
      );
    }
  }

  _stopTransaction = async () => {
    const { charger, connector } = this.state;
    this.setState({loadingTransaction: true});
    try {
      // Stop the Transaction
      let status = await _provider.stopTransaction(charger.id, connector.activeTransactionID);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    this.setState({loadingTransaction: false});
  }

  _isAuthorizedStopTransaction = async () => {
    try {
      let result = await _provider.isAuthorizedStopTransaction(
        { Action: "StopTransaction", Arg1: this.props.charger.id, Arg2: this.props.connector.activeTransactionID }
      );
      if (result) {
        return result.IsAuthorized;
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getCharger = async () => {
    try {
      let charger = await _provider.getCharger(
        { ID: this.state.charger.id }
      );
      this.setState({
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
              // Component Mounted?
              if (this.mounted) {
                // Refresh
                this._refreshElapsedTime();
              }
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
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error, this.props);
      }
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

  _refresh = () => {
    // Show spinner
    this.setState({refreshing: true}, async () => {
      // Refresh
      await this._refreshChargerData();
      // Hide spinner
      this.setState({refreshing: false});
    });
  }

  _getSiteImage = async () => {
    try {
      let result = await _provider.getSiteImage(
        { ID: this.state.siteID }
      );
      if (result) {
        this.setState({siteImage: result.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { firstLoad, siteImage, loadingTransaction, charger, connector, refreshing, userImage, transaction, hours, minutes, seconds } = this.state;
    return (
      <Container>
        <ChargerHeader charger={charger} connector={connector} navigation={navigation} />
        <ScrollView style={style.scrollViewContainer} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this._refresh} />
        }>
          <View style={style.detailsContainer}>
            <Image style={style.backgroundImage} source={siteImage ? {uri: siteImage} : noSite}/>
            { loadingTransaction ?
              <Spinner color="white" style={style.spinner} />
            :
              <View style={style.transactionContainer}>
                {connector.activeTransactionID === 0 ?
                  <TouchableOpacity onPress={() => this.onStartTransaction()}>
                    <View style={style.startTransaction}>
                      <Icon style={style.startStopTransactionIcon} type="MaterialIcons" name="play-arrow" />
                    </View>
                  </TouchableOpacity>
                :
                  <TouchableOpacity onPress={() => this.onStopTransaction()}>
                    <View style={style.stopTransaction}>
                      <Icon style={style.startStopTransactionIcon} type="MaterialIcons" name="stop" />
                    </View>
                  </TouchableOpacity>
                }
              </View>
            }
          </View>
          {firstLoad ?
            <Spinner color="white" style={style.spinner} />
          :
            <View style={style.content}>
              <View style={style.rowContainer}>
                <View style={style.columnContainer}>
                  <ConnectorStatusComponent connector={connector}/>
                  <Text style={style.label}>{Utils.translateConnectorStatus(connector.status)}</Text>
                </View>
                <View style={style.columnContainer}>
                  <Thumbnail style={style.userPicture} source={userImage ? {uri: userImage} : noPhoto} />
                  {transaction ?
                    <View>
                      <Text style={style.labelUser}>{Utils.buildUserName(transaction.user)}</Text>
                      <Text style={style.subLabelUser}>({transaction.tagID})</Text>
                    </View>
                  :
                    <Text style={style.label}>-</Text>
                  }
                </View>
              </View>
              <View style={style.rowContainer}>
                <View style={style.columnContainer}>
                  <Icon type="FontAwesome" name="bolt" style={style.icon} />
                  { connector.activeTransactionID === 0 ?
                    <Text style={style.labelValue}>-</Text>
                  :
                    <View>
                      <Text style={style.labelValue}>{(connector.currentConsumption / 1000) > 0 ? (connector.currentConsumption / 1000).toFixed(1) : 0}</Text>
                      <Text style={style.subLabel}>{I18n.t("details.instant")} (kW)</Text>
                    </View>
                  }
                </View>
                <View style={style.columnContainer}>
                  <Icon type="Ionicons" name="time" style={style.icon} />
                  {transaction && transaction.timestamp ?
                    <Text style={style.labelTimeValue}>{`${hours}:${minutes}:${seconds}`}</Text>
                  :
                    <Text style={style.labelValue}>- : - : -</Text>
                  }
                </View>
              </View>
              <View style={style.rowContainer}>
                <View style={style.columnContainer}>
                  <Icon style={style.icon} type="MaterialIcons" name="trending-up" />
                  { (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                    <Text style={style.labelValue}>-</Text>
                  :
                    <View>
                      <Text style={style.labelValue}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                      <Text style={style.subLabel}>{I18n.t("details.total")} (kW.h)</Text>
                    </View>
                  }
                </View>
                <View style={style.columnContainer}>
                  <Icon type="Feather" name="battery-charging" style={style.icon} />
                  { connector.currentStateOfCharge ?
                    <View>
                      <Text style={style.labelValue}>{connector.currentStateOfCharge}</Text>
                      <Text style={style.subLabel}>(%)</Text>
                    </View>
                  :
                    <View>
                      <Text style={style.labelValue}>-</Text>
                    </View>
                  }
                </View>
              </View>
            </View>
          }
        </ScrollView>
      </Container>
    );
  }
}

export default ConnectorDetails;
