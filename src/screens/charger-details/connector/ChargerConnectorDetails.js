import React from "react";
import { ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Container, Icon, View, Thumbnail, Text } from "native-base";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import ProviderFactory from "../../../provider/ProviderFactory";
import ConnectorStatusComponent from "../../../components/connector-status/ConnectorStatusComponent";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./ChargerConnectorDetailsStyles";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";
import PropTypes from "prop-types";
import BackgroundComponent from "../../../components/background/BackgroundComponent";

const noPhoto = require("../../../../assets/no-photo.png");
const noSite = require("../../../../assets/no-site.png");

const START_TRANSACTION_NB_TRIAL = 4;
const _provider = ProviderFactory.getProvider();

export default class ChargerConnectorDetails extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      userImage: null,
      elapsedTimeFormatted: "00:00:00",
      inactivityFormatted: "00:00:00",
      startTransactionNbTrial: 0,
      isAuthorizedToStopTransaction: false,
      buttonDisabled: true
    };
    // Set refresh period
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS);
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
    this._refreshTimeInfos();
    // Dedicated timer for refreshing time
    this.timerElapsedTime = setInterval(() => {
      // Refresh
      this._refreshTimeInfos();
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
        if (result) {
          this.setState({ siteImage: result.image });
        } else {
          this.setState({ siteImage: null });
        }
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
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
          elapsedTimeFormatted: "00:00:00",
          userImage: null,
          transaction: null
        });
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(error, this.props.navigation);
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
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
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
          this.setState({
            isAuthorizedToStopTransaction: result.IsAuthorized
          });
        }
      } else {
        // Not Authorized
        this.setState({
          isAuthorizedToStopTransaction: false
        });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
    }
  };

  refresh = async () => {
    // Get Current Transaction
    await this._getTransaction();
    // Check Authorization
    await this._isAuthorizedStopTransaction();
    // Check to enable the buttons after a certain period of time
    this._handleStartStopDisabledButton();
  };

  _startTransactionConfirm = () => {
    const { charger } = this.props;
    Alert.alert(
      I18n.t("details.startTransaction"),
      I18n.t("details.startTransactionMessage", { chargeBoxID: charger.id }),
      [
        { text: I18n.t("general.yes"), onPress: () => this._startTransaction() },
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
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
    }
  };

  _stopTransactionConfirm = async () => {
    const { charger } = this.props;
    // Confirm
    Alert.alert(
      I18n.t("details.stopTransaction"),
      I18n.t("details.stopTransactionMessage", { chargeBoxID: charger.id }),
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
      Utils.handleHttpUnexpectedError(error, this.props.navigation);
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
        buttonDisabled: false
      });
      // Transaction is stopped (activeTransactionID == 0)
    } else if (connector.status === Constants.CONN_STATUS_FINISHING) {
      // Disable the button until the user unplug the cable
      this.setState({
        buttonDisabled: true
      });
    }
  }

  _refreshTimeInfos = () => {
    const { transaction } = this.state;
    // Component Mounted?
    if (this.isMounted()) {
      // Transaction timestamp ?
      if (transaction) {
        let elapsedTimeFormatted = "00:00:00";
        let inactivityFormatted = "00:00:00";
        // Elapsed Time?
        if (transaction.timestamp) {
          // Get duration
          const durationSecs = (Date.now() - transaction.timestamp.getTime()) / 1000;
          // Format
          elapsedTimeFormatted = this._formatDurationHHMMSS(durationSecs);
        }
        // Inactivity?
        if (transaction.currentTotalInactivitySecs) {
          // Format
          inactivityFormatted = this._formatDurationHHMMSS(transaction.currentTotalInactivitySecs);
        }
        // Set
        this.setState({
          elapsedTimeFormatted,
          inactivityFormatted
        });
      }
    }
  };

  _formatDurationHHMMSS = (durationSecs) => {
    if (durationSecs <= 0) {
      return "00:00:00";
    }
    // Set Hours
    const hours = Math.trunc(durationSecs / 3600);
    durationSecs -= hours * 3600;
    // Set Mins
    let minutes = 0;
    if (durationSecs > 0) {
      minutes = Math.trunc(durationSecs / 60);
      durationSecs -= minutes * 60;
    }
    // Set Secs
    const seconds = Math.trunc(durationSecs);
    // Format
    return `${this._formatTimer(hours)}:${this._formatTimer(minutes)}:${this._formatTimer(seconds)}`;
  }

  _formatTimer = val => {
    // Put 0 next to the digit if lower than 10
    const valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    }
    // Return new digit
    return valString;
  };

  _renderConnectorStatus = (style) => {
    const { connector, isAdmin } = this.props;
    return (
      <View style={style.columnContainer}>
        <ConnectorStatusComponent
          connector={connector}
          text={Utils.translateConnectorStatus(connector.status)}
        />
        {isAdmin && connector.status === Constants.CONN_STATUS_FAULTED ? (
          <Text style={[style.subLabel, style.subLabelStatusError]}>
            ({connector.errorCode})
          </Text>
        ) : (
          undefined
        )}
      </View>
    );
  };

  _renderUserInfo = (style) => {
    const { isAdmin } = this.props;
    const { userImage, transaction } = this.state;
    return (
      <View style={style.columnContainer}>
        <Thumbnail
          style={style.userImage}
          source={userImage ? { uri: userImage } : noPhoto}
        />
        {transaction ?
          <View>
            <Text style={[style.label, style.labelUser]}>
              {Utils.buildUserName(transaction.user)}
            </Text>
            {isAdmin ?
              <Text style={[style.subLabel, style.subLabelUser]}>
                ({transaction.tagID})
              </Text>
            :
              undefined
            }
          </View>
        :
          <Text style={style.label}>-</Text>
        }
      </View>
    );
  };

  _renderInstantPower = (style) => {
    const { connector } = this.props;
    return (
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
    );
  };

  _renderElapsedTime = (style) => {
    const { transaction, elapsedTimeFormatted } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="timer" style={style.icon} />
        {transaction ? (
          <Text style={[style.label, style.labelTimeValue]}>
            {elapsedTimeFormatted}
          </Text>
        ) : (
          <Text style={[style.label, style.labelValue]}>
            - : - : -
          </Text>
        )}
      </View>
    );
  };

  _renderInactivity = (style) => {
    const { transaction, inactivityFormatted } = this.state;
    return (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="timer-off" style={style.icon} />
        {transaction ? (
          <Text style={[style.label, style.labelTimeValue]}>
            {inactivityFormatted}
          </Text>
        ) : (
          <Text style={[style.label, style.labelValue]}>
            - : - : -
          </Text>
        )}
      </View>
    );
  };

  _renderTotalConsumption = (style) => {
    const { connector } = this.props;
    return (
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
    );
  };

  _renderBatteryLevel = (style) => {
    const { connector } = this.props;
    return (
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
    );
  };

  _renderStartTransactionButton = (style) => {
    const { buttonDisabled } = this.state;
    return (
      <TouchableOpacity
        disabled={buttonDisabled}
        onPress={() => this._startTransactionConfirm()}
      >
        <View
          style={
            buttonDisabled
              ? [style.buttonTransaction, style.startTransaction, style.buttonTransactionDisabled]
              : [style.buttonTransaction, style.startTransaction]
          }
        >
          <Icon
            style={
              buttonDisabled
                ? [style.transactionIcon, style.startTransactionIcon, style.transactionDisabledIcon]
                : [style.transactionIcon, style.startTransactionIcon]
            }
            type="MaterialIcons"
            name="play-arrow"
          />
        </View>
      </TouchableOpacity>
    );
  };

  _renderStopTransactionButton = (style) => {
    const { buttonDisabled } = this.state;
    return (
      <TouchableOpacity onPress={() => this._stopTransactionConfirm()} disabled={buttonDisabled}>
        <View
          style={
            buttonDisabled
              ? [style.buttonTransaction, style.stopTransaction, style.buttonTransactionDisabled]
              : [style.buttonTransaction, style.stopTransaction]
          }
        >
          <Icon
            style={
              buttonDisabled
                ? [style.transactionIcon, style.stopTransactionIcon, style.transactionDisabledIcon]
                : [style.transactionIcon, style.stopTransactionIcon]
            }
            type="MaterialIcons" name="stop" />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const style = computeStyleSheet();
    const { connector } = this.props;
    const { siteImage, isAuthorizedToStopTransaction } = this.state;
    return (
      <Container style={style.container}>
          {/* Site Image */}
        <Image style={style.backgroundImage} source={siteImage ? { uri: siteImage } : noSite} />
        <BackgroundComponent active={false}>
          {/* Start/Stop Transaction */}
          <View style={style.transactionContainer}>
            {connector.activeTransactionID === 0
            ?
              this._renderStartTransactionButton(style)
            :
              isAuthorizedToStopTransaction
              ?
                this._renderStopTransactionButton(style)
              :
                <View style={style.noButtonStopTransaction} />
            }
          </View>
          {/* Details */}
          <ScrollView style={style.scrollViewContainer}>
            <View style={style.detailsContainer}>
              <View style={style.rowContainer}>
                {this._renderConnectorStatus(style)}
                {this._renderUserInfo(style)}
              </View>
              <View style={style.rowContainer}>
                {this._renderInstantPower(style)}
                {this._renderTotalConsumption(style)}
              </View>
              <View style={style.rowContainer}>
                {this._renderElapsedTime(style)}
                {this._renderInactivity(style)}
              </View>
              {connector.currentStateOfCharge ?
                <View style={style.rowContainer}>
                  {this._renderBatteryLevel(style)}
                </View>
              :
                undefined
              }
            </View>
          </ScrollView>
        </BackgroundComponent>
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
