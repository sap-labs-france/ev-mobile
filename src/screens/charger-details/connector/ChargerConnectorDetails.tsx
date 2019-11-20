import I18n from "i18n-js";
import { Container, Icon, Text, Thumbnail, View, Spinner } from "native-base";
import React from "react";
import { Alert, Image, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import noPhotoActive from "../../../../assets/no-photo-active.png";
import noPhoto from "../../../../assets/no-photo.png";
import noSite from "../../../../assets/no-site.png";
import BackgroundComponent from "../../../components/background/BackgroundComponent";
import ConnectorStatusComponent from "../../../components/connector-status/ConnectorStatusComponent";
import I18nManager from "../../../I18n/I18nManager";
import ProviderFactory from "../../../provider/ProviderFactory";
import BaseProps from "../../../types/BaseProps";
import ChargingStation from "../../../types/ChargingStation";
import Connector from "../../../types/Connector";
import Transaction from "../../../types/Transaction";
import User from "../../../types/User";
import Constants from "../../../utils/Constants";
import Message from "../../../utils/Message";
import Utils from "../../../utils/Utils";
import BaseAutoRefreshScreen from "../../base-screen/BaseAutoRefreshScreen";
import computeStyleSheet from "./ChargerConnectorDetailsStyles";

const START_TRANSACTION_NB_TRIAL = 4;

export interface Props extends BaseProps {
  charger: ChargingStation;
  connector: Connector;
  isAdmin: boolean;
  canStopTransaction: boolean;
  canStartTransaction: boolean;
}

interface State {
  loading?: boolean;
  transaction?: Transaction;
  userImageLoaded?: boolean;
  userImage?: string;
  siteImage?: string;
  elapsedTimeFormatted?: string;
  totalInactivitySecs?: number;
  inactivityFormatted?: string;
  startTransactionNbTrial?: number;
  isPricingActive?: boolean;
  buttonDisabled?: boolean;
  refreshing?: boolean;
}

export default class ChargerConnectorDetails extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      transaction: null,
      userImageLoaded: false,
      userImage: null,
      siteImage: null,
      elapsedTimeFormatted: "-",
      totalInactivitySecs: 0,
      inactivityFormatted: "-",
      startTransactionNbTrial: 0,
      isPricingActive: false,
      buttonDisabled: true,
      refreshing: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    const { charger } = this.props;
    await super.componentDidMount();
    // Get the Site Image (only first time)
    if (charger && charger.siteArea && this.isMounted()) {
      await this.getSiteImage(charger.siteArea.siteID);
    }
  }

  public async componentWillUnmount() {
    await super.componentWillUnmount();
  }

  public getSiteImage = async (siteID: string) => {
    try {
      if (!this.state.siteImage) {
        // Get it
        const image = await this.centralServerProvider.getSiteImage(siteID);
        if (image) {
          this.setState({ siteImage: image });
        } else {
          this.setState({ siteImage: null });
        }
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  public getTransaction = async () => {
    const { connector } = this.props;
    try {
      // Is their a transaction?
      if (connector && connector.activeTransactionID) {
        // Yes: Set data
        const transaction = await this.centralServerProvider.getTransaction({
          ID: connector.activeTransactionID
        });
        // Found?
        if (transaction) {
          // Get user image
          this.getUserImage(transaction.user);
        }
        this.setState({
          transaction
        });
      } else {
        this.setState({
          elapsedTimeFormatted: Constants.DEFAULT_DURATION,
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

  public getUserImage = async (user: User) => {
    const { userImageLoaded } = this.state;
    try {
      // User provided?
      if (user) {
        // Not already loaded?
        if (!userImageLoaded) {
          // Get it
          const image = await this.centralServerProvider.getUserImage({ ID: user.id });
          this.setState({
            userImageLoaded: true,
            userImage: image ? image : null
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

  public refresh = async () => {
    // Get Current Transaction
    await this.getTransaction();
    // Check to enable the buttons after a certain period of time
    this.handleStartStopDisabledButton();
    // Compute Duration
    this.computeDurationInfos();
    // Get the provider
    const centralServerProvider = await ProviderFactory.getProvider();
    const securityProvider = centralServerProvider.getSecurityProvider();
    this.setState({
      isPricingActive: securityProvider.isComponentPricingActive(),
      loading: false
    });
  };

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public startTransactionConfirm = () => {
    const { charger } = this.props;
    Alert.alert(I18n.t("details.startTransaction"), I18n.t("details.startTransactionMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this.startTransaction() },
      { text: I18n.t("general.no") }
    ]);
  };

  public startTransaction = async () => {
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
      if (status && status.status === "Accepted") {
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

  public stopTransactionConfirm = async () => {
    const { charger } = this.props;
    // Confirm
    Alert.alert(I18n.t("details.stopTransaction"), I18n.t("details.stopTransactionMessage", { chargeBoxID: charger.id }), [
      { text: I18n.t("general.yes"), onPress: () => this.stopTransaction() },
      { text: I18n.t("general.no") }
    ]);
  };

  public stopTransaction = async () => {
    const { charger, connector } = this.props;
    try {
      // Disable button
      this.setState({ buttonDisabled: true });
      // Stop the Transaction
      const status = await this.centralServerProvider.stopTransaction(charger.id, connector.activeTransactionID);
      // Check
      if (status && status.status === "Accepted") {
        Message.showSuccess(I18n.t("details.accepted"));
      } else {
        Message.showError(I18n.t("details.denied"));
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
  };

  public handleStartStopDisabledButton() {
    const { connector } = this.props;
    const { startTransactionNbTrial } = this.state;
    // Check if the Start/Stop Button should stay disabled
    if (connector &&
      ((connector.status === Constants.CONN_STATUS_AVAILABLE && startTransactionNbTrial <= START_TRANSACTION_NB_TRIAL - 2) ||
      (connector.status === Constants.CONN_STATUS_PREPARING && startTransactionNbTrial === 0))
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
    } else if (connector && connector.activeTransactionID !== 0) {
      // Transaction has started, enable the buttons again
      this.setState({
        startTransactionNbTrial: 0,
        buttonDisabled: false
      });
      // Transaction is stopped (activeTransactionID == 0)
    } else if (connector && connector.status === Constants.CONN_STATUS_FINISHING) {
      // Disable the button until the user unplug the cable
      this.setState({
        buttonDisabled: true
      });
    }
  }

  public computeDurationInfos = () => {
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
          // Format
          const durationSecs = (Date.now() - new Date(transaction.timestamp).getTime()) / 1000;
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
      } else if (connector && connector.activeTransactionID) {
        let elapsedTimeFormatted = Constants.DEFAULT_DURATION;
        let inactivityFormatted = Constants.DEFAULT_DURATION;
        // Elapsed Time?
        if (connector.activeTransactionDate) {
          // Format
          const durationSecs = (Date.now() - new Date(connector.activeTransactionDate).getTime()) / 1000;
          elapsedTimeFormatted = Utils.formatDurationHHMMSS(durationSecs, false);
        }
        // Inactivity?
        if (connector && connector.totalInactivitySecs) {
          // Format
          inactivityFormatted = Utils.formatDurationHHMMSS(connector.totalInactivitySecs, false);
        }
        // Set
        this.setState({
          totalInactivitySecs: connector ? connector.totalInactivitySecs : 0,
          elapsedTimeFormatted,
          inactivityFormatted
        });
      }
    }
  };

  public renderConnectorStatus = (style: any) => {
    const { connector, isAdmin } = this.props;
    return (
      <View style={style.columnContainer}>
        <ConnectorStatusComponent navigation={this.props.navigation} connector={connector}
          text={connector ? Utils.translateConnectorStatus(connector.status) : Constants.CONN_STATUS_UNAVAILABLE} />
        {isAdmin && connector && connector.status === Constants.CONN_STATUS_FAULTED && (
          <Text style={[style.subLabel, style.subLabelStatusError]}>({connector.errorCode})</Text>
        )}
      </View>
    );
  };

  public renderUserInfo = (style: any) => {
    const { isAdmin } = this.props;
    const { userImage, transaction } = this.state;
    return transaction ? (
      <View style={style.columnContainer}>
        <Thumbnail style={[style.userImage]} source={userImage ? { uri: userImage } : noPhotoActive} />
        <Text numberOfLines={1} style={[style.label, style.labelUser, style.info]}>
          {Utils.buildUserName(transaction.user)}
        </Text>
        {isAdmin ? <Text style={[style.subLabel, style.subLabelUser, style.info]}>({transaction.tagID})</Text> : undefined}
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Thumbnail style={[style.userImage]} source={userImage ? { uri: userImage } : noPhoto} />
        <Text style={[style.label, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderPrice = (style: any) => {
    const { connector } = this.props;
    const { transaction } = this.state;
    let price = 0;
    if (transaction) {
      price = Math.round(transaction.currentCumulatedPrice * 100) / 100;
    }
    return connector && connector.activeTransactionID && transaction && !isNaN(price) ? (
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
    );
  };

  public renderInstantPower = (style: any) => {
    const { connector } = this.props;
    return connector && connector.activeTransactionID && !isNaN(connector.currentConsumption) ? (
      <View style={style.columnContainer}>
        <Icon type="FontAwesome" name="bolt" style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>
          {connector.currentConsumption / 1000 > 0 ? I18nManager.formatNumber(Math.round(connector.currentConsumption / 10) / 100) : 0}
        </Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t("details.instant")} (kW)</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon type="FontAwesome" name="bolt" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderElapsedTime = (style: any) => {
    const { elapsedTimeFormatted } = this.state;
    const { connector } = this.props;
    return connector && connector.activeTransactionID ? (
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
    );
  };

  public renderInactivity = (style: any) => {
    const { inactivityFormatted } = this.state;
    const { connector } = this.props;
    const inactivityStyle = connector ? Utils.computeInactivityStyle(connector.inactivityStatusLevel) : '';
    return connector && connector.activeTransactionID ? (
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
    );
  };

  public renderTotalConsumption = (style: any) => {
    const { connector } = this.props;
    return connector && connector.activeTransactionID && !isNaN(connector.totalConsumption) ? (
      <View style={style.columnContainer}>
        <Icon style={[style.icon, style.info]} type="MaterialIcons" name="ev-station" />
        <Text style={[style.label, style.labelValue, style.info]}>
          {connector ? I18nManager.formatNumber(Math.round(connector.totalConsumption / 10) / 100) : ''}
        </Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t("details.total")} (kW.h)</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon style={[style.icon, style.disabled]} type="MaterialIcons" name="ev-station" />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderBatteryLevel = (style: any) => {
    const { transaction } = this.state;
    const { connector } = this.props;
    return connector && connector.currentStateOfCharge && !isNaN(connector.currentStateOfCharge) ? (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="battery-charging-full" style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>
          {transaction ? `${transaction.stateOfCharge} > ${transaction.currentStateOfCharge}` : connector.currentStateOfCharge}
        </Text>
        <Text style={[style.subLabel, style.info]}>(%)</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="battery-charging-full" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderStartTransactionButton = (style: any) => {
    const { buttonDisabled } = this.state;
    return (
      <TouchableOpacity disabled={buttonDisabled} onPress={() => this.startTransactionConfirm()}>
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

  public renderStopTransactionButton = (style: any) => {
    const { buttonDisabled } = this.state;
    return (
      <TouchableOpacity onPress={() => this.stopTransactionConfirm()} disabled={buttonDisabled}>
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

  public render() {
    const style = computeStyleSheet();
    const { connector, canStopTransaction, canStartTransaction } = this.props;
    const { loading, siteImage, isPricingActive } = this.state;
    return (
      loading ? (
        <Spinner style={style.spinner} />
      ) : (
        <Container style={style.container}>
          {/* Site Image */}
          <Image style={style.backgroundImage} source={siteImage ? { uri: siteImage } : noSite} />
          <BackgroundComponent navigation={this.props.navigation} active={false}>
            {/* Start/Stop Transaction */}
            <View style={style.transactionContainer}>
              {canStartTransaction && connector && connector.activeTransactionID === 0 ? (
                this.renderStartTransactionButton(style)
              ) : canStopTransaction && connector && connector.activeTransactionID > 0 ? (
                this.renderStopTransactionButton(style)
              ) : (
                <View style={style.noButtonStopTransaction} />
              )}
            </View>
            {/* Details */}
            <ScrollView
              style={style.scrollViewContainer}
              refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.manualRefresh} />}>
              <View style={style.detailsContainer}>
                <View style={style.rowContainer}>
                  {this.renderConnectorStatus(style)}
                  {this.renderUserInfo(style)}
                </View>
                <View style={style.rowContainer}>
                  {this.renderInstantPower(style)}
                  {this.renderTotalConsumption(style)}
                </View>
                <View style={style.rowContainer}>
                  {this.renderElapsedTime(style)}
                  {this.renderInactivity(style)}
                </View>
                <View style={style.rowContainer}>
                  {this.renderBatteryLevel(style)}
                  {isPricingActive ? this.renderPrice(style) : <View style={style.columnContainer} />}
                </View>
              </View>
            </ScrollView>
          </BackgroundComponent>
        </Container>
      )
    );
  }
}
