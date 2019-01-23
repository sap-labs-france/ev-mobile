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
      chargerID: Utils.getParamFromNavigation(this.props.navigation.dangerouslyGetParent(), "chargerID", null),
      connectorID: Utils.getParamFromNavigation(this.props.navigation.dangerouslyGetParent(), "connectorID", null),
      charger: null,
      connector: null,
      firstLoad: true,
      siteImage: null,
      transaction: null,
      seconds: "00",
      minutes: "00",
      hours: "00",
      userImage: null,
      refreshing: false,
      loadingTransaction: false,
      startTransactionNbTrial: 0,
      buttonDisabled: true,
      isAdmin: false
    };
  }

  async componentDidMount() {
    // Set
    this.mounted = true;
    // Set if Admin
    const isAdmin = (await _provider.getSecurityProvider()).isAdmin();
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
    }, Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS);
    // Start refresh of time
    this.timerElapsedTime = setInterval(() => {
      // Refresh
      this._refreshElapsedTime();
    }, 1000);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      firstLoad: false,
      isAdmin
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
      }, Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS);
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

  _getSiteImage = async (siteID) => {
    try {
      if (!this.state.siteImage) {
        // Get it
        let result = await _provider.getSiteImage(siteID);
        // Found 
        if (result) {
          // Yes
          this.setState({siteImage: result.image});
        } else {
          // Yes
          this.setState({siteImage: null});
        }
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
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
      buttonDisabled: true
    });
    try {
      // Start the Transaction
      let status = await _provider.startTransaction(charger.id, connector.connectorId);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
        this.setState({
          startTransactionNbTrial: 4,
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
    Alert.alert(
      `${I18n.t("details.notAuthorisedTitle")}`,
      `${I18n.t("details.notAuthorised")}`,
      [
        {text: I18n.t("general.ok")},
      ]
    );
  }

  _stopTransaction = async () => {
    const { charger, connector } = this.state;
    this.setState({
      loadingTransaction: true,
      buttonDisabled: true
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
        { ID: this.state.chargerID }
      );
      this.setState({
        charger: charger,
        connector: charger.connectors[this.state.connectorID - 1]
      }, () => {
        // Get the Site Image (only first time)
        if (charger.siteArea) {
          this._getSiteImage(charger.siteArea.siteID);
        }
        // Check to enable the buttons after a certain period of time
        this._handleStartStopDisabledButton();
      });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  async _handleStartStopDisabledButton() {
    // Check if disabled
    if (this.state.buttonDisabled) {
      // Check if the Start/Stop Button should stay disabled
      if (this.state.connector.status === Constants.CONN_STATUS_AVAILABLE &&
          this.state.startTransactionNbTrial === 0) {
        // Button are set to available after the nbr of trials
        this.setState({
          buttonDisabled: false
        });
      // Still trials? (only for Start Transaction)
      } else if (this.state.startTransactionNbTrial > 0) {
        // Trial - 1
        let startTransactionNbTrial = (this.state.startTransactionNbTrial > 0 ? (this.state.startTransactionNbTrial - 1) : 0 );
        // Check if charger's status has changed
        if (this.state.connector.status !== Constants.CONN_STATUS_AVAILABLE) {
          // Yes: Init nbr of trial
          startTransactionNbTrial = 0;
        }
        // Set
        this.setState({
          startTransactionNbTrial
        });
      } else if (this.state.connector.activeTransactionID !== 0) {
        // Check
        const isAuthorisedToStopTransaction = await this._isAuthorizedStopTransaction();
        // Transaction has started, enable the buttons again
        this.setState({
          startTransactionNbTrial: 0,
          buttonDisabled: !isAuthorisedToStopTransaction
        });
      }
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
    const { firstLoad, charger, connector, siteImage, refreshing, userImage, transaction, hours, minutes, seconds } = this.state;
    return (
      firstLoad ?
        <Container style={style.container}>
          <Spinner color="white" style={style.spinner} />
        </Container>
      :
        <Container style={style.container}>
          <ChargerHeader charger={charger} connector={connector} navigation={navigation} />
            <ScrollView style={style.scrollViewContainer} refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={this._refresh} />
            }>
            <View style={style.detailsContainer}>
              <Image style={style.backgroundImage} source={siteImage ? {uri: siteImage} : noSite}/>
              <View style={style.transactionContainer}>
                {connector.activeTransactionID === 0 ?
                  <TouchableOpacity onPress={() => this.onStartTransaction()} disabled={this.state.buttonDisabled}>
                    <View style={(this.state.buttonDisabled ? [style.startTransaction, style.startStopTransactionDisabled] : style.startTransaction)}>
                      <Icon style={style.startStopTransactionIcon} type="MaterialIcons" name="play-arrow" />
                    </View>
                  </TouchableOpacity>
                :
                  <TouchableOpacity onPress={() => this.onStopTransaction()} disabled={this.state.buttonDisabled}>
                    <View style={(this.state.buttonDisabled ? [style.stopTransaction, style.startStopTransactionDisabled] : style.stopTransaction)}>
                      <Icon style={style.startStopTransactionIcon} type="MaterialIcons" name="stop" />
                    </View>
                  </TouchableOpacity>
                }
              </View>
            </View>
            {firstLoad ?
              <Spinner color="white" style={style.spinner} />
            :
              <View style={style.detailsContainer}>
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
