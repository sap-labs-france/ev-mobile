import React from "react";
import { ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Container, Icon, View, Thumbnail, Text } from "native-base";
import BaseScreen from "../../base-screen/BaseScreen";
import ProviderFactory from "../../../provider/ProviderFactory";
import ConnectorStatusComponent from "../../../components/connector-status/ConnectorStatusComponent";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./ChargerConnectorDetailsStyles";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";
import PropTypes from "prop-types";

const noPhoto = require("../../../../assets/no-photo.png");
const noSite = require("../../../../assets/no-site.gif");
const START_TRANSACTION_NB_TRIAL = 4;
const _provider = ProviderFactory.getProvider();

export default class ChargerConnectorDetails extends BaseScreen {
  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      userImage: null,
      seconds: "00",
      minutes: "00",
      hours: "00",
      startTransactionNbTrial: 0,
      buttonDisabled: true
    };
    // Override
    this.refreshPeriodMillis = Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS;
    this.isAuthorizedToStopTransaction = false;
  }

  async componentDidMount() {
    const { charger } = this.props;
    // Call parent
    super.componentDidMount();
    // Get Current Transaction
    if (this.isMounted()) {
      await this._getTransaction();
    }
    // Get the Site Image (only first time)
    if (charger.siteArea && this.isMounted()) {
      await this._getSiteImage(charger.siteArea.siteID);
    }
    // Init
    this._refreshElapsedTime();
    // Start refresh of time
    this.timerElapsedTime = setInterval(() => {
      // Refresh
      this._refreshElapsedTime();
    }, 1000);
    // Check Authorization
    await this._isAuthorizedStopTransaction();
    // Check to enable the buttons after a certain period of time
    if (this.isMounted()) {
      this._handleStartStopDisabledButton();
    }
  }

  async componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
    // Clear
    if (this.timerElapsedTime) {
      clearInterval(this.timerElapsedTime);
    }
  }

  _getSiteImage = async siteID => {
    try {
      if (!this.state.siteImage) {
        // Get it
        const result = await _provider.getSiteImage(siteID);
        // Found
        if (result) {
          // Yes
          this.setState({ siteImage: result.image });
        } else {
          // Yes
          this.setState({ siteImage: null });
        }
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  };

  _getTransaction = async () => {
    const { connector } = this.props;
    try {
      // Is their a transaction?
      if (connector.activeTransactionID) {
        // Yes: Set data
        const transaction = await _provider.getTransaction({
          ID: connector.activeTransactionID
        });
        // Found?
        if (transaction) {
          // Convert
          transaction.timestamp = new Date(transaction.timestamp);
          // Get user image
          this._getUserImage(transaction.user);
        }
        this.setState({
          transaction
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
  };

  _getUserImage = async user => {
    const { userImage } = this.state;
    try {
      // Already loaded?
      if (userImage) {
        return;
      }
      // User provided?
      if (user) {
        const userImage = await _provider.getUserImage({ ID: user.id });
        // Set
        this.setState({ userImage: userImage ? userImage.image : null });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  };

  _isAuthorizedStopTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      // Transaction?
      if (connector.activeTransactionID !== 0) {
        // Call
        const result = await _provider.isAuthorizedStopTransaction({
          Action: "StopTransaction",
          Arg1: charger.id,
          Arg2: connector.activeTransactionID
        });
        if (result) {
          // Set
          this.isAuthorizedToStopTransaction = result.IsAuthorized;
        }
      } else {
        // Not Authorized
        this.isAuthorizedToStopTransaction = false;
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  };

  _refresh = async () => {
    // Get Current Transaction
    await this._getTransaction();
    // Check Authorization
    await this._isAuthorizedStopTransaction();
    // Check to enable the buttons after a certain period of time
    this._handleStartStopDisabledButton();
  };

  _onStartTransaction = () => {
    const { charger } = this.props;
    Alert.alert(
      `${I18n.t("details.startTransaction")}`,
      `${I18n.t("details.startTransactionMessage")} ${charger.id} ?`,
      [
        {
          text: I18n.t("general.yes"),
          onPress: () => this._startTransaction()
        },
        { text: I18n.t("general.no") }
      ]
    );
  };

  _startTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      // Check Tag ID
      const userInfo = await _provider.getUserInfo();
      if (!userInfo.tagIDs || userInfo.tagIDs.length === 0) {
        Message.showError(I18n.t("details.noBadgeID"));
        return;
      }
      // Disable the button
      this.setState({ buttonDisabled: true });
      // Start the Transaction
      const status = await _provider.startTransaction(
        charger.id,
        connector.connectorId,
        userInfo.tagIDs[0]
      );
      // Check
      if (status.status && status.status === "Accepted") {
        // Show message
        Message.showSuccess(I18n.t("details.accepted"));
        // Nb trials the button stays disabled
        this.setState({ startTransactionNbTrial: START_TRANSACTION_NB_TRIAL });
      } else {
        // Enable the button
        this.setState({ buttonDisabled: false });
        // Show message
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Enable the button
      this.setState({ buttonDisabled: false });
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  };

  _onStopTransaction = async () => {
    const { charger } = this.props;
    // Confirm
    Alert.alert(
      `${I18n.t("details.stopTransaction")}`,
      `${I18n.t("details.stopTransactionMessage")} ${charger.id} ?`,
      [
        { text: I18n.t("general.yes"), onPress: () => this._stopTransaction() },
        { text: I18n.t("general.no") }
      ]
    );
  };

  _stopTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      // Disable button
      this.setState({ buttonDisabled: true });
      // Stop the Transaction
      const status = await _provider.stopTransaction(charger.id, connector.activeTransactionID);
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
  };

  _handleStartStopDisabledButton() {
    const { connector } = this.props;
    const { startTransactionNbTrial } = this.state;
    // Check if the Start/Stop Button should stay disabled
    if (
      (connector.status === Constants.CONN_STATUS_AVAILABLE &&
        startTransactionNbTrial <= START_TRANSACTION_NB_TRIAL - 2) ||
      (connector.status === Constants.CONN_STATUS_PREPARING && startTransactionNbTrial === 0)
    ) {
      // Button are set to available after the nbr of trials
      this.setState({
        buttonDisabled: false
      });
      // Still trials? (only for Start Transaction)
    } else if (startTransactionNbTrial > 0) {
      // Trial - 1
      this.setState({
        startTransactionNbTrial: startTransactionNbTrial > 0 ? startTransactionNbTrial - 1 : 0
      });
      // Transaction ongoing
    } else if (connector.activeTransactionID !== 0) {
      // Transaction has started, enable the buttons again
      this.setState({
        startTransactionNbTrial: 0,
        buttonDisabled: !this.isAuthorizedToStopTransaction
      });
      // Transaction is stopped (activeTransactionID == 0)
    } else if (connector.status === Constants.CONN_STATUS_FINISHING) {
      // Disable the button until the user unplug the cable
      this.setState({
        buttonDisabled: true
      });
    }
  }

  _refreshElapsedTime = () => {
    const { transaction } = this.state;
    // Component Mounted?
    if (this.isMounted()) {
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
  };

  _formatTimer = val => {
    // Put 0 next to the digit if lower than 10
    const valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    }
    // Return new digit
    return valString;
  };

  render() {
    const style = computeStyleSheet();
    const { connector, isAdmin } = this.props;
    const {
      siteImage,
      transaction,
      userImage,
      buttonDisabled,
      hours,
      minutes,
      seconds
    } = this.state;
    return (
      <Container style={style.container}>
        <Image style={style.backgroundImage} source={siteImage ? { uri: siteImage } : noSite} />
        <View style={style.transactionContainer}>
          {connector.activeTransactionID === 0 ? (
            <TouchableOpacity onPress={() => this._onStartTransaction()} disabled={buttonDisabled}>
              <View
                style={
                  buttonDisabled
                    ? [
                        style.buttonTransaction,
                        style.startTransaction,
                        style.buttonTransactionDisabled
                      ]
                    : [style.buttonTransaction, style.startTransaction]
                }
              >
                <Icon
                  style={style.startStopTransactionIcon}
                  type="MaterialIcons"
                  name="play-arrow"
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this._onStopTransaction()} disabled={buttonDisabled}>
              <View
                style={
                  buttonDisabled
                    ? [
                        style.buttonTransaction,
                        style.stopTransaction,
                        style.buttonTransactionDisabled
                      ]
                    : [style.buttonTransaction, style.stopTransaction]
                }
              >
                <Icon style={style.startStopTransactionIcon} type="MaterialIcons" name="stop" />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView style={style.scrollViewContainer}>
          <View style={style.detailsContainer}>
            <View style={style.rowContainer}>
              <View style={style.columnContainer}>
                <ConnectorStatusComponent style={style.connectorLetter} connector={connector} />
                <Text style={[style.label, style.labelStatus]}>
                  {Utils.translateConnectorStatus(connector.status)}
                </Text>
                {connector.status === Constants.CONN_STATUS_FAULTED ? (
                  <Text style={[style.subLabel, style.subLabelStatus]}>
                    {connector.info ? connector.info : ""}
                  </Text>
                ) : (
                  undefined
                )}
              </View>
              <View style={style.columnContainer}>
                <Thumbnail
                  style={style.userPicture}
                  source={userImage ? { uri: userImage } : noPhoto}
                />
                {transaction ? (
                  <View>
                    <Text style={[style.label, style.labelUser]}>
                      {Utils.buildUserName(transaction.user)}
                    </Text>
                    {isAdmin ? (
                      <Text style={[style.subLabel, style.subLabelUser]}>
                        ({transaction.tagID})
                      </Text>
                    ) : (
                      undefined
                    )}
                  </View>
                ) : (
                  <Text style={style.label}>-</Text>
                )}
              </View>
            </View>
            <View style={style.rowContainer}>
              <View style={style.columnContainer}>
                <Icon type="FontAwesome" name="bolt" style={style.icon} />
                {connector.activeTransactionID === 0 ? (
                  <Text style={[style.label, style.labelValue]}>-</Text>
                ) : (
                  <View>
                    <Text style={[style.label, style.labelValue]}>
                      {connector.currentConsumption / 1000 > 0
                        ? (connector.currentConsumption / 1000).toFixed(1)
                        : 0}
                    </Text>
                    <Text style={style.subLabel}>{I18n.t("details.instant")} (kW)</Text>
                  </View>
                )}
              </View>
              <View style={style.columnContainer}>
                <Icon type="Ionicons" name="time" style={style.icon} />
                {transaction ? (
                  <Text
                    style={[style.label, style.labelTimeValue]}
                  >{`${hours}:${minutes}:${seconds}`}</Text>
                ) : (
                  <Text style={[style.label, style.labelValue]}>- : - : -</Text>
                )}
              </View>
            </View>
            <View style={style.rowContainer}>
              <View style={style.columnContainer}>
                <Icon style={style.icon} type="MaterialIcons" name="trending-up" />
                {(connector.totalConsumption / 1000).toFixed(1) === 0.0 ||
                connector.totalConsumption === 0 ? (
                  <Text style={[style.label, style.labelValue]}>-</Text>
                ) : (
                  <View>
                    <Text style={[style.label, style.labelValue]}>
                      {(connector.totalConsumption / 1000).toFixed(1)}
                    </Text>
                    <Text style={style.subLabel}>{I18n.t("details.total")} (kW.h)</Text>
                  </View>
                )}
              </View>
              <View style={style.columnContainer}>
                <Icon type="MaterialIcons" name="battery-charging-full" style={style.icon} />
                {connector.currentStateOfCharge ? (
                  <View>
                    <Text style={[style.label, style.labelValue]}>
                      {connector.currentStateOfCharge}
                    </Text>
                    <Text style={style.subLabel}>(%)</Text>
                  </View>
                ) : (
                  <View>
                    <Text style={[style.label, style.labelValue]}>-</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    );
  }
}

ChargerConnectorDetails.propTypes = {
  charger: PropTypes.object.isRequired,
  connector: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

ChargerConnectorDetails.defaultProps = {};
