import React from "react";
import { ScrollView, TouchableOpacity, Image, Alert, RefreshControl } from "react-native";
import { Container, Icon, View, Thumbnail, Text } from "native-base";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import ConnectorStatusComponent from "../../../components/connector-status/ConnectorStatusComponent";
import I18n from "../../../I18n/I18n";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./ChargerConnectorDetailsStyles";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";
import PropTypes from "prop-types";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import ProviderFactory from "../../../provider/ProviderFactory";

const noPhoto = require("../../../../assets/no-photo.png");
const noPhotoActive = require("../../../../assets/no-photo-active.png");
const noSite = require("../../../../assets/no-site.png");

const START_TRANSACTION_NB_TRIAL = 4;

export default class ChargerConnectorDetails extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      userImageLoaded: false,
      userImage: null,
      elapsedTimeFormatted: "-",
      totalInactivitySecs: 0,
      inactivityFormatted: "-",
      startTransactionNbTrial: 0,
      isPricingActive: false,
      buttonDisabled: true,
      refreshing: false
    };
    // Set refresh period
    this.setRefreshPeriodMillis(Constants.AUTO_REFRESH_SHORT_PERIOD_MILLIS);
  }

  async componentWillMount() {
    // Call parent
    await super.componentWillMount();
    // Get the provider
    const centralServerProvider = await ProviderFactory.getProvider();
    const securityProvider = centralServerProvider.getSecurityProvider();
    this.setState({
      isPricingActive: securityProvider.isComponentPricingActive()
    });
  }

  async componentDidMount() {
    const { charger } = this.props;
    // Call parent
    await super.componentDidMount();
    // Get the Site Image (only first time)
    if (charger.siteArea && this.isMounted()) {
      await this._getSiteImage(charger.siteArea.siteID);
    }
    // Get Transaction
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  _getSiteImage = async (siteID) => {
    try {
      if (!this.state.siteImage) {
        // Get it
        const result = await this.centralServerProvider.getSiteImage(siteID);
        if (result) {
          this.setState({ siteImage: result.image });
        } else {
          this.setState({ siteImage: null });
        }
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  _getTransaction = async () => {
    const { connector } = this.props;
    try {
      // Is their a transaction?
      if (connector.activeTransactionID) {
        // Yes: Set data
        const transaction = await this.centralServerProvider.getTransaction({
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
          elapsedTimeFormatted: Constants.DEFAULT_DURATION_WITH_SECS,
          userImage: null,
          transaction: null
        });
      }
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== 560) {
        // Other common Error
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
      }
    }
  };

  _getUserImage = async (user) => {
    const { userImageLoaded } = this.state;
    try {
      // User provided?
      if (user) {
        // Not already loaded?
        if (!userImageLoaded) {
          // Get it
          userImageBackend = await this.centralServerProvider.getUserImage({ ID: user.id });
          this.setState({
            userImageLoaded: true,
            userImage: userImageBackend ? userImageBackend.image : null
          });
        }
      } else {
        // Set
        this.setState({
          userImageLoaded: false,
          userImage: null
        });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  refresh = async () => {
    // Get Current Transaction
    await this._getTransaction();
    // Check to enable the buttons after a certain period of time
    this._handleStartStopDisabledButton();
    // Refresh Duration
    this._refreshDurationInfos();
  };

  _manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  _startTransactionConfirm = () => {
    const { charger } = this.props;
    Alert.alert(I18n.t("details.startTransaction"), I18n.t("details.startTransactionMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this._startTransaction() },
      { text: I18n.t("general.no") }
    ]);
  };

  _startTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      // Check Tag ID
      const userInfo = this.centralServerProvider.getUserInfo();
      if (!userInfo.tagIDs || userInfo.tagIDs.length === 0) {
        Message.showError(I18n.t("details.noBadgeID"));
        return;
      }
      // Disable the button
      this.setState({ buttonDisabled: true });
      // Start the Transaction
      const status = await this.centralServerProvider.startTransaction(charger.id, connector.connectorId, userInfo.tagIDs[0]);
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
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  _stopTransactionConfirm = async () => {
    const { charger } = this.props;
    // Confirm
    Alert.alert(I18n.t("details.stopTransaction"), I18n.t("details.stopTransactionMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this._stopTransaction() },
      { text: I18n.t("general.no") }
    ]);
  };

  _stopTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      // Disable button
      this.setState({ buttonDisabled: true });
      // Stop the Transaction
      const status = await this.centralServerProvider.stopTransaction(charger.id, connector.activeTransactionID);
      // Check
      if (status.status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  _handleStartStopDisabledButton() {
    const { connector } = this.props;
    const { startTransactionNbTrial } = this.state;
    // Check if the Start/Stop Button should stay disabled
    if (
      (connector.status === Constants.CONN_STATUS_AVAILABLE && startTransactionNbTrial <= START_TRANSACTION_NB_TRIAL - 2) ||
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

  _refreshDurationInfos = () => {
    const { transaction } = this.state;
    const { connector } = this.props;
    // Component Mounted?
    if (this.isMounted()) {
      // Transaction loaded?
      if (transaction) {
        let elapsedTimeFormatted = Constants.DEFAULT_DURATION;
        let inactivityFormatted = Constants.DEFAULT_DURATION;
        // Elapsed Time?
        if (transaction.timestamp) {
          // Get duration
          const durationSecs = (Date.now() - transaction.timestamp.getTime()) / 1000;
          // Format
          elapsedTimeFormatted = Utils.formatDurationHHMMSS(durationSecs, false);
        }
        // Inactivity?
        if (transaction.currentTotalInactivitySecs) {
          // Format
          inactivityFormatted = Utils.formatDurationHHMMSS(transaction.currentTotalInactivitySecs, false);
        }
        // Set
        this.setState({
          totalInactivitySecs: transaction.currentTotalInactivitySecs,
          elapsedTimeFormatted,
          inactivityFormatted
        });
      // Basic User: Use the connector data
      } else if (connector.activeTransactionID) {
        let elapsedTimeFormatted = Constants.DEFAULT_DURATION;
        let inactivityFormatted = Constants.DEFAULT_DURATION;
        // Elapsed Time?
        if (connector.activeTransactionDate) {
          // Get duration
          const durationSecs = (Date.now() - new Date(connector.activeTransactionDate).getTime()) / 1000;
          // Format
          elapsedTimeFormatted = Utils.formatDurationHHMMSS(durationSecs, false);
        }
        // Inactivity?
        if (connector.totalInactivitySecs) {
          // Format
          inactivityFormatted = Utils.formatDurationHHMMSS(connector.totalInactivitySecs, false);
        }
        // Set
        this.setState({
          totalInactivitySecs: connector.totalInactivitySecs,
          elapsedTimeFormatted,
          inactivityFormatted
        });
      }
    }
  };

  _renderConnectorStatus = (style) => {
    const { connector, isAdmin } = this.props;
    return (
      <View style={style.columnContainer}>
        <ConnectorStatusComponent connector={connector} text={Utils.translateConnectorStatus(connector.status)} />
        {isAdmin && connector.status === Constants.CONN_STATUS_FAULTED ? (
          <Text style={[style.subLabel, style.subLabelStatusError]}>({connector.errorCode})</Text>
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
      transaction ? (
        <View style={style.columnContainer}>
          <Thumbnail style={[style.userImage]} source={userImage ? { uri: userImage } : noPhotoActive} />
          <Text style={[style.label, style.labelUser, style.info]}>{Utils.buildUserName(transaction.user)}</Text>
          {isAdmin ? <Text style={[style.subLabel, style.subLabelUser, style.info]}>({transaction.tagID})</Text> : undefined}
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Thumbnail style={[style.userImage]} source={userImage ? { uri: userImage } : noPhoto} />
          <Text style={[style.label, style.disabled]}>-</Text>
        </View>
      )
    );
  };

  _renderPrice = (style) => {
    const { transaction } = this.state;
    let price = 0;
    if (transaction) {
      price = Math.round(transaction.currentCumulatedPrice * 100) / 100;
    }
    return (
      transaction ? (
        <View style={style.columnContainer}>
          <Icon type="FontAwesome" name="money" style={[style.icon, style.info]} />
          <Text style={[style.label, style.labelValue, style.info]}>{price}</Text>
          <Text style={[style.subLabel, style.info]}>({transaction.priceUnit})</Text>
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Icon type="FontAwesome" name="money" style={[style.icon, style.disabled]} />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      )
    );
  };

  _renderInstantPower = (style) => {
    const { connector } = this.props;
    return (
      connector.activeTransactionID === 0 ? (
        <View style={style.columnContainer}>
          <Icon type="FontAwesome" name="bolt" style={[style.icon, style.disabled]} />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Icon type="FontAwesome" name="bolt" style={[style.icon, style.info]} />
          <Text style={[style.label, style.labelValue, style.info]}>
            {connector.currentConsumption / 1000 > 0 ? (connector.currentConsumption / 1000).toFixed(1) : 0}
          </Text>
          <Text style={[style.subLabel, style.info]}>{I18n.t("details.instant")} (kW)</Text>
        </View>
      )
    );
  };

  _renderElapsedTime = (style) => {
    const { elapsedTimeFormatted } = this.state;
    const { connector } = this.props;
    return (
      connector.activeTransactionID ? (
        <View style={style.columnContainer}>
          <Icon type="MaterialIcons" name="timer" style={[style.icon, style.info]} />
            <Text style={[style.label, style.labelValue, style.info]}>{elapsedTimeFormatted}</Text>
            <Text style={[style.subLabel, style.info]}>{I18n.t("details.duration")}</Text>
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Icon type="MaterialIcons" name="timer" style={[style.icon, style.disabled]} />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      )
    );
  };

  _renderInactivity = (style) => {
    const { inactivityFormatted, totalInactivitySecs } = this.state;
    const { connector } = this.props;
    const inactivityStyle = Utils.computeInactivityStyle(totalInactivitySecs);
    return (
      connector.activeTransactionID ? (
        <View style={style.columnContainer}>
          <Icon type="MaterialIcons" name="timer-off" style={[style.icon, inactivityStyle]} />
          <Text style={[style.label, style.labelValue, inactivityStyle]}>{inactivityFormatted}</Text>
          <Text style={[style.subLabel, inactivityStyle]}>{I18n.t("details.duration")}</Text>
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Icon type="MaterialIcons" name="timer-off" style={[style.icon, style.disabled]} />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      )
    );
  };

  _renderTotalConsumption = (style) => {
    const { connector } = this.props;
    return (
      (connector.totalConsumption / 1000).toFixed(1) === 0.0 || connector.totalConsumption === 0 ? (
        <View style={style.columnContainer}>
          <Icon style={[style.icon, style.disabled]} type="MaterialIcons" name="ev-station" />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Icon style={[style.icon, style.info]} type="MaterialIcons" name="ev-station" />
          <Text style={[style.label, style.labelValue, style.info]}>{(connector.totalConsumption / 1000).toFixed(1)}</Text>
          <Text style={[style.subLabel, style.info]}>{I18n.t("details.total")} (kW.h)</Text>
        </View>
      )
    );
  };

  _renderBatteryLevel = (style) => {
    const { connector } = this.props;
    return (
      connector.currentStateOfCharge ? (
        <View style={style.columnContainer}>
          <Icon type="MaterialIcons" name="battery-charging-full" style={[style.icon, style.info]} />
          <Text style={[style.label, style.labelValue, style.info]}>{connector.currentStateOfCharge}</Text>
          <Text style={[style.subLabel, style.info]}>(%)</Text>
        </View>
      ) : (
        <View style={style.columnContainer}>
          <Icon type="MaterialIcons" name="battery-charging-full" style={[style.icon, style.disabled]} />
          <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
        </View>
      )
    );
  };

  _renderStartTransactionButton = (style) => {
    const { buttonDisabled } = this.state;
    return (
      <TouchableOpacity disabled={buttonDisabled} onPress={() => this._startTransactionConfirm()}>
        <View
          style={
            buttonDisabled
              ? [style.buttonTransaction, style.startTransaction, style.buttonTransactionDisabled]
              : [style.buttonTransaction, style.startTransaction]
          }>
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
          }>
          <Icon
            style={
              buttonDisabled
                ? [style.transactionIcon, style.stopTransactionIcon, style.transactionDisabledIcon]
                : [style.transactionIcon, style.stopTransactionIcon]
            }
            type="MaterialIcons"
            name="stop"
          />
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const style = computeStyleSheet();
    const { connector, canStopTransaction, canStartTransaction } = this.props;
    const { siteImage, isPricingActive } = this.state;
    return (
      <Container style={style.container}>
        {/* Site Image */}
        <Image style={style.backgroundImage} source={siteImage ? { uri: siteImage } : noSite} />
        <BackgroundComponent active={false}>
          {/* Start/Stop Transaction */}
          <View style={style.transactionContainer}>
            {canStartTransaction && connector.activeTransactionID === 0 ?
              this._renderStartTransactionButton(style)
            :
              canStopTransaction && connector.activeTransactionID > 0 ?
                this._renderStopTransactionButton(style)
              :
                <View style={style.noButtonStopTransaction} />
            }
          </View>
          {/* Details */}
          <ScrollView style={style.scrollViewContainer}
              refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._manualRefresh} />}>
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
              <View style={style.rowContainer}>
                {this._renderBatteryLevel(style)}
                {isPricingActive ? this._renderPrice(style) : undefined}
              </View>
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
  isAdmin: PropTypes.bool.isRequired,
  canStopTransaction: PropTypes.bool.isRequired,
  canStartTransaction: PropTypes.bool.isRequired
};

ChargerConnectorDetails.defaultProps = {};
