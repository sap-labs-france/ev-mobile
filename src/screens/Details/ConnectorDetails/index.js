import React from "react";
import { ScrollView, RefreshControl, TouchableOpacity, Image, Alert } from "react-native";
import { Container, Spinner, Icon, View, Thumbnail, Text } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
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
      siteImage: this.props.navigation.state.params.siteImage,
      transaction: null,
      seconds: "00",
      minutes: "00",
      hours: "00",
      userImage: null,
      refreshing: false,
      firstLoad: true,
      loadingTransaction: false,
      startButtonDisabledNbTrial: 0,
      startButtonDisabled: true,
      stopButtonDisabled: true,
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Set if Admin
    const isAdmin = (await _provider.getSecurityProvider()).isAdmin();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({isAdmin});
    // Read the charger
    await this._getCharger();
    // Get Current Transaction
    await this._getTransaction();
    // Init
    this._refreshElapsedTime();
    // Refresh Charger Data
    this.timerChargerData = setInterval(() => {
      // Refresh
      this._refreshTransaction();
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
    // Start refresh of time
    this.timerElapsedTime = setInterval(() => {
      // Refresh
      this._refreshElapsedTime();
    }, 1000);
    // eslint-disable-next-line react/no-did-mount-set-state
    // Ok
    this.setState({
      firstLoad: false
    });
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
  }

  componentDidFocus = () => {
    // Start the timer
    if (!this.timerChargerData) {
      // Force Refresh
      this._refreshTransaction();
      // Refresh Charger Data
      this.timerChargerData = setInterval(() => {
        // Refresh
        this._refreshTransaction();
      }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
    }
    // Start the timer
    if (!this.timerElapsedTime) {
      // Force Refresh
      this._refreshElapsedTime();
      // Start refresh of time
      this.timerElapsedTime = setInterval(() => {
        // Refresh
        this._refreshElapsedTime();
      }, 1000);
    }
  }

  componentDidBlur = () => {
    // Clear interval if it exists
    if (this.timerChargerData) {
      clearInterval(this.timerChargerData);
      this.timerChargerData = null;
    }
    if (this.timerElapsedTime) {
      clearInterval(this.timerElapsedTime);
      this.timerElapsedTime = null;
    }
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
    this.setState({
      loadingTransaction: true,
      startButtonDisabled: true
    });
    try {
      // Start the Transaction
      let status = await _provider.startTransaction(charger.id, connector.connectorId);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
        this.setState({
          startButtonDisabledNbTrial: 4,
          loadingTransaction: false
        });
      } else {
        Message.showError(I18n.t("details.denied"));
        this.setState({loadingTransaction: false});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
      this.setState({loadingTransaction: false});
    }
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
    this.setState({
      loadingTransaction: true,
      stopButtonDisabled: true
    });
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
    const { charger, connector } = this.state;
    try {
      let result = await _provider.isAuthorizedStopTransaction(
        { Action: "StopTransaction", Arg1: charger.id, Arg2: connector.activeTransactionID }
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
      }, () => {
        // Connector Available?
        if (this.state.connector.status === Constants.CONN_STATUS_AVAILABLE &&
            this.state.startButtonDisabledNbTrial === 0) {
          // Set
          this.setState({
            startButtonDisabled: false,
            stopButtonDisabled: true
          });
        } else {
          let startButtonDisabledNbTrial = (this.state.startButtonDisabledNbTrial > 0 ? (this.state.startButtonDisabledNbTrial - 1) : 0 );
          // Check if status has changed
          if (this.state.connector.status !== Constants.CONN_STATUS_AVAILABLE && 
              startButtonDisabledNbTrial !== 0) {
            // Init
            startButtonDisabledNbTrial = 0;
          }
          // Set
          this.setState({
            startButtonDisabled: true,
            stopButtonDisabled: false,
            startButtonDisabledNbTrial
          });
        }
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
          // Already loaded?
          if (!this.state.userImage) {
            // Get user image
            this._getUserImage(transaction.user);
          }
        }
        this.setState({
          transaction: transaction
        });
      } else {
        this.setState({
          seconds: "00",
          minutes: "00",
          hours: "00",
          userImage: null,
          transaction: null
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
      // User provided?
      if (user) {
        const userImage = await _provider.getUserImage(
          { ID: user.id }
        );
        // Set
        this.setState({userImage: (userImage ? userImage.image : null)});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _refreshElapsedTime = () => {
    // Component Mounted?
    if (this.mounted) {
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

  _refreshTransaction = async () => {
    // Component Mounted?
    if (this.mounted) {
      // Read the charger
      await this._getCharger();
      // Read the transaction
      await this._getTransaction();
    }
  }

  _refresh = () => {
    // Show spinner
    this.setState({refreshing: true}, async () => {
      // Refresh
      await this._refreshTransaction();
      // Hide spinner
      this.setState({refreshing: false});
    });
  }

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
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
              <Spinner style={style.spinner} />
            :
              <View style={style.transactionContainer}>
                {connector.activeTransactionID === 0 ?
                  <TouchableOpacity onPress={() => this.onStartTransaction()} disabled={this.state.startButtonDisabled}>
                    <View style={(!this.state.startButtonDisabled ? style.startTransaction : [style.startTransaction, style.startStopTransactionDisabled])}>
                      <Icon style={style.startStopTransactionIcon} type="MaterialIcons" name="play-arrow" />
                    </View>
                  </TouchableOpacity>
                :
                  <TouchableOpacity onPress={() => this.onStopTransaction()} disabled={this.state.stopButtonDisabled}>
                    <View style={(!this.state.stopButtonDisabled ? style.stopTransaction : [style.stopTransaction, style.startStopTransactionDisabled])}>
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
                  <ConnectorStatusComponent style={style.connectorLetter} connector={connector}/>
                  <Text style={[style.label, style.labelStatus]}>{Utils.translateConnectorStatus(connector.status)}</Text>
                </View>
                <View style={style.columnContainer}>
                  <Thumbnail style={style.userPicture} source={userImage ? {uri: userImage} : noPhoto} />
                  {transaction ?
                    <Text style={[style.label, style.labelUser]}>{Utils.buildUserName(transaction.user)}</Text>
                  :
                    <Text style={style.label}>-</Text>
                  }
                </View>
              </View>
              <View style={style.rowContainer}>
                <View style={style.columnContainer}>
                  <Icon type="FontAwesome" name="bolt" style={style.icon} />
                  { connector.activeTransactionID === 0 ?
                    <Text style={[style.label, style.labelValue]}>-</Text>
                  :
                    <View>
                      <Text style={[style.label, style.labelValue]}>{(connector.currentConsumption / 1000) > 0 ? (connector.currentConsumption / 1000).toFixed(1) : 0}</Text>
                      <Text style={style.subLabel}>{I18n.t("details.instant")} (kW)</Text>
                    </View>
                  }
                </View>
                <View style={style.columnContainer}>
                  <Icon type="Ionicons" name="time" style={style.icon} />
                  {transaction ?
                    <Text style={[style.label, style.labelTimeValue]}>{`${hours}:${minutes}:${seconds}`}</Text>
                  :
                    <Text style={[style.label, style.labelValue]}>- : - : -</Text>
                  }
                </View>
              </View>
              <View style={style.rowContainer}>
                <View style={style.columnContainer}>
                  <Icon style={style.icon} type="MaterialIcons" name="trending-up" />
                  { (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ?
                    <Text style={[style.label, style.labelValue]}>-</Text>
                  :
                    <View>
                      <Text style={[style.label, style.labelValue]}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
                      <Text style={style.subLabel}>{I18n.t("details.total")} (kW.h)</Text>
                    </View>
                  }
                </View>
                <View style={style.columnContainer}>
                  <Icon type="MaterialIcons" name="battery-charging-full" style={style.icon} />
                  { connector.currentStateOfCharge ?
                    <View>
                      <Text style={[style.label, style.labelValue]}>{connector.currentStateOfCharge}</Text>
                      <Text style={style.subLabel}>(%)</Text>
                    </View>
                  :
                    <View>
                      <Text style={[style.label, style.labelValue]}>-</Text>
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
