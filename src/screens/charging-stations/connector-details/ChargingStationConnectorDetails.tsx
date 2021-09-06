import { DrawerActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container, Icon, Spinner, Switch, Text, View } from 'native-base';
import React from 'react';
import { Alert, Image, ImageStyle, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';

import noSite from '../../../../assets/no-site.png';
import ConnectorStatusComponent from '../../../components/connector-status/ConnectorStatusComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import { ItemSelectionMode } from '../../../components/list/ItemsList';
import ModalSelect from '../../../components/modal/ModalSelect';
import UserAvatar from '../../../components/user/avatar/UserAvatar';
import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Car from '../../../types/Car';
import ChargingStation, { ChargePointStatus, Connector } from '../../../types/ChargingStation';
import { HTTPAuthError } from '../../../types/HTTPError';
import Transaction, { StartTransactionErrorCode } from '../../../types/Transaction';
import User, { UserDefaultTagCar } from '../../../types/User';
import UserToken from '../../../types/UserToken';
import Constants from '../../../utils/Constants';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import Cars from '../../cars/Cars';
import Users from '../../users/list/Users';
import computeStyleSheet from './ChargingStationConnectorDetailsStyles';
import DialogModal from '../../../components/modal/DialogModal';
import computeModalCommonStyle from '../../../components/modal/ModalCommonStyle';
import Tags from '../../tags/Tags';
import Tag from '../../../types/Tag';
import Orientation from 'react-native-orientation-locker';
import TagComponent from '../../../components/tag/TagComponent';
import CarComponent from '../../../components/car/CarComponent';
import UserComponent from '../../../components/user/UserComponent';
import computeListItemCommonStyle from '../../../components/list/ListItemCommonStyle';
import ChargingStationConnectorComponent from '../../../components/charging-station/connector/ChargingStationConnectorComponent';

const START_TRANSACTION_NB_TRIAL = 4;

export interface Props extends BaseProps {}

interface State {
  loading?: boolean;
  chargingStation?: ChargingStation;
  connector?: Connector;
  transaction?: Transaction;
  isAdmin?: boolean;
  isSiteAdmin?: boolean;
  canStartTransaction?: boolean;
  canStopTransaction?: boolean;
  canDisplayTransaction?: boolean;
  siteImage?: string;
  elapsedTimeFormatted?: string;
  totalInactivitySecs?: number;
  inactivityFormatted?: string;
  startTransactionNbTrial?: number;
  isPricingActive?: boolean;
  buttonDisabled?: boolean;
  refreshing?: boolean;
  userDefaultTagCar?: UserDefaultTagCar;
  showStartTransactionDialog: boolean;
  selectedUser?: User;
  selectedCar?: Car;
  selectedTag?: Tag;
  tagCarLoading?: boolean;
  showBadgeErrorMessage?: boolean;
  showBillingErrorMessage?: boolean;
  transactionPending?: boolean;
  didPreparing?: boolean;
  startTransactionDialogWasClosed?: boolean;
  showAdviceMessage?: boolean;
  transactionPendingTimesUp?: boolean;
  showChargingSettings?: boolean;
  selectedUserTagsCount?: number;
  selectedUserCarsCount?: number;
  defaultSettings?: boolean;
}

export default class ChargingStationConnectorDetails extends BaseAutoRefreshScreen<Props, State> {
  public state: State;
  public props: Props;
  private currentUser: UserToken;
  private carModalRef = React.createRef<ModalSelect<Car>>();
  private tagModalRef = React.createRef<ModalSelect<Tag>>();

  public constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      chargingStation: null,
      userDefaultTagCar: null,
      connector: null,
      transaction: null,
      isAdmin: false,
      buttonDisabled: true,
      isSiteAdmin: false,
      canStartTransaction: false,
      canStopTransaction: false,
      canDisplayTransaction: false,
      siteImage: null,
      elapsedTimeFormatted: '-',
      totalInactivitySecs: 0,
      inactivityFormatted: '-',
      startTransactionNbTrial: 0,
      isPricingActive: false,
      refreshing: false,
      showStartTransactionDialog: false,
      selectedUser: null,
      selectedCar: null,
      selectedTag: null,
      tagCarLoading: false,
      showBadgeErrorMessage: false,
      showBillingErrorMessage: false,
      transactionPending: false,
      showAdviceMessage: false,
      didPreparing: false,
      startTransactionDialogWasClosed: false,
      transactionPendingTimesUp: false,
      showChargingSettings: false,
      selectedUserTagsCount: 0,
      selectedUserCarsCount: 0,
      defaultSettings: true
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount(false);
    this.currentUser = this.centralServerProvider.getUserInfo();
    const selectedUser = {
      id: this.currentUser?.id,
      firstName: this.currentUser?.firstName,
      name: this.currentUser?.name
    };
    await this.loadSelectedUserDefaultTagAndCar(selectedUser as User);
    // Init the selected user to the currently logged in user
    this.setState({ selectedUser }, this.refresh.bind(this));
  }

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    Orientation.lockToPortrait();
  }

  public async componentDidBlur(): Promise<void> {
    super.componentDidBlur();
    Orientation.unlockAllOrientations();
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public getSiteImage = async (siteID: string): Promise<string> => {
    try {
      // Get Site
      const siteImage = await this.centralServerProvider.getSiteImage(siteID);
      return siteImage;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'sites.siteUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
    return null;
  };

  public getChargingStation = async (chargingStationID: string): Promise<ChargingStation> => {
    try {
      // Get Charger
      const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationID);
      return chargingStation;
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'chargers.chargerUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
    return null;
  };

  public getTransaction = async (transactionID: number): Promise<Transaction> => {
    try {
      // Get Transaction
      const transaction = await this.centralServerProvider.getTransaction(transactionID);
      return transaction;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  };

  public getLastTransaction = async (chargeBoxID: string, connectorId: number): Promise<Transaction> => {
    try {
      // Get Transaction
      const transaction = await this.centralServerProvider.getLastTransaction(chargeBoxID, connectorId);
      return transaction;
    } catch (error) {
      // Check if HTTP?
      if (!error.request || error.request.status !== HTTPAuthError.FORBIDDEN) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'transactions.transactionUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  };

  public showLastTransaction = async () => {
    const { navigation } = this.props;
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
    const connectorID: number = Utils.convertToInt(Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as string);
    // Get the last session
    const transaction = await this.getLastTransaction(chargingStationID, connectorID);
    if (transaction) {
      // Navigate
      navigation.navigate('TransactionDetailsTabs', {
        params: { transactionID: transaction.id },
        key: `${Utils.randomNumber()}`
      });
    } else {
      Alert.alert(I18n.t('chargers.noSession'), I18n.t('chargers.noSessionMessage'));
    }
  };

  public showReportError = async () => {
    const { navigation } = this.props;
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
    const connectorID: number = Utils.convertToInt(Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as string);
    // Get the last session
    // Navigate
    navigation.navigate('ReportError', {
      params: {
        chargingStationID,
        connectorID
      },
      key: `${Utils.randomNumber()}`
    });
  };

  public isTransactionStillPending(connector: Connector): boolean {
    const { transactionPending, transactionPendingTimesUp, didPreparing } = this.state;
    if (transactionPending) {
      if (connector.status === ChargePointStatus.PREPARING) {
        this.setState({ didPreparing: true });
        return true;
      } else if (connector.status === ChargePointStatus.AVAILABLE && !didPreparing && !transactionPendingTimesUp) {
        return true;
      }
    }
    return false;
  }

  // eslint-disable-next-line complexity
  public refresh = async () => {
    let siteImage = null;
    let transaction = null;
    let showBadgeErrorMessage: boolean;
    let showBillingErrorMessage: boolean;
    let showStartTransactionDialog: boolean;
    let showAdviceMessage = false;
    let buttonDisabled = false;
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
    const connectorID = Utils.convertToInt(Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as string);
    const startTransactionFromQRCode = Utils.getParamFromNavigation(this.props.route, 'startTransaction', null) as boolean;
    // Get Charging Station
    const chargingStation = await this.getChargingStation(chargingStationID);
    // Get Connector from Charging Station
    const connector = chargingStation ? Utils.getConnectorFromID(chargingStation, connectorID) : null;

    const transactionStillPending = this.isTransactionStillPending(connector);
    if (transactionStillPending) {
      buttonDisabled = true;
    } else {
      // if the transaction is no longer pending, reset the flags
      this.setState({ transactionPending: false, didPreparing: false });
    }

    // When Scanning a QR-Code, redirect if a session is already in progress. (if the connector has a non null userID)
    if (startTransactionFromQRCode && connector.currentUserID) {
      Message.showWarning('A session is already in progress on this connector');
      this.onBack();
      return;
    }
    // Get the site image if not already fetched
    if (!this.state.siteImage && chargingStation?.siteArea) {
      siteImage = await this.getSiteImage(chargingStation.siteArea?.siteID);
    }
    // Get Current Transaction
    if (connector?.currentTransactionID) {
      transaction = await this.getTransaction(connector.currentTransactionID);
    }
    const { selectedUser } = this.state;
    // Get the default tag and car of the selected user (only to get errors codes)
    const userDefaultTagCar = await this.getUserDefaultTagAndCar(selectedUser);
    // If error codes, disabled the button
    if (!Utils.isEmptyArray(userDefaultTagCar?.errorCodes)) {
      buttonDisabled = true;
      showBillingErrorMessage = true;
    }
    // Manually add the default property to the badge (not sent from the server)

    // Get selected user cars and tags count to disable the selection if count is < 2
    const selectedUserTagsCount = await this.countSelectedUserTags(selectedUser);
    const selectedUserCarsCount = await this.countSelectedUserCars(selectedUser);

    // If the selected user has no badge, disable the button
    if (!selectedUserTagsCount) {
      buttonDisabled = true;
      showBadgeErrorMessage = true;
    }
    if (
      connector.status === ChargePointStatus.FINISHING ||
      connector.status === ChargePointStatus.FAULTED ||
      connector.status === ChargePointStatus.UNAVAILABLE ||
      chargingStation.inactive
    ) {
      buttonDisabled = true;
    }
    // // Compute Duration
    const durationInfos = this.getDurationInfos(transaction, connector);
    // Set
    if (
      startTransactionFromQRCode &&
      (connector?.status === ChargePointStatus.AVAILABLE || connector?.status === ChargePointStatus.PREPARING) &&
      !buttonDisabled &&
      !this.state.startTransactionDialogWasClosed
    ) {
      showStartTransactionDialog = true;
    }

    // Show a message to advice to check that the cable is connected to both car and CS
    if (!buttonDisabled && (connector.status === ChargePointStatus.AVAILABLE || connector.status === ChargePointStatus.PREPARING)) {
      showAdviceMessage = true;
    }

    this.setState({
      showStartTransactionDialog,
      showBillingErrorMessage,
      showBadgeErrorMessage,
      showAdviceMessage,
      buttonDisabled,
      chargingStation,
      connector,
      transaction,
      userDefaultTagCar,
      siteImage,
      selectedUserCarsCount,
      selectedUserTagsCount,
      isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
      isSiteAdmin: this.securityProvider?.isSiteAdmin(chargingStation.siteArea?.siteID) ?? false,
      canDisplayTransaction: chargingStation ? this.securityProvider?.canReadTransaction() : false,
      canStartTransaction: chargingStation ? this.canStartTransaction(chargingStation, connector) : false,
      canStopTransaction: chargingStation ? this.canStopTransaction(chargingStation, connector) : false,
      isPricingActive: this.securityProvider?.isComponentPricingActive(),
      ...durationInfos,
      loading: false
    });
  };

  public getStartStopTransactionButtonStatus(
    connector: Connector,
    userDefaultTagCar: UserDefaultTagCar
  ): { buttonDisabled?: boolean; startTransactionNbTrial?: number } {
    const { startTransactionNbTrial } = this.state;
    // Check if error codes
    if (userDefaultTagCar && !Utils.isEmptyArray(userDefaultTagCar?.errorCodes)) {
      return {
        buttonDisabled: true
      };
    }
    if (!userDefaultTagCar?.tag) {
      return {
        buttonDisabled: true
      };
    }
    // Check if the Start/Stop Button should stay disabled
    if (
      (connector?.status === ChargePointStatus.AVAILABLE && startTransactionNbTrial <= START_TRANSACTION_NB_TRIAL - 2) ||
      (connector?.status === ChargePointStatus.PREPARING && startTransactionNbTrial === 0)
    ) {
      // Button are set to available after the nbr of trials
      return {
        buttonDisabled: false
      };
      // Still trials? (only for Start Transaction)
    } else if (startTransactionNbTrial > 0) {
      // Trial - 1
      return {
        startTransactionNbTrial: startTransactionNbTrial > 0 ? startTransactionNbTrial - 1 : 0
      };
      // Transaction ongoing
    } else if (connector && connector.currentTransactionID !== 0) {
      // Transaction has started, enable the buttons again
      return {
        startTransactionNbTrial: 0,
        buttonDisabled: false
      };
      // Transaction is stopped (currentTransactionID == 0)
    } else if (connector && connector.status === ChargePointStatus.FINISHING) {
      // Disable the button until the user unplug the cable
      return {
        buttonDisabled: true
      };
    }
    return {};
  }

  public canStopTransaction = (chargingStation: ChargingStation, connector: Connector): boolean => {
    // Transaction?
    if (connector && connector.currentTransactionID !== 0) {
      // Check Auth
      return this.securityProvider?.canStopTransaction(chargingStation.siteArea, connector.currentTagID);
    }
    return false;
  };

  public canStartTransaction(chargingStation: ChargingStation, connector: Connector): boolean {
    // Transaction?
    if (connector && connector.currentTransactionID === 0) {
      // Check Auth
      return this.securityProvider?.canStartTransaction(chargingStation.siteArea);
    }
    return false;
  }

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    await this.loadSelectedUserDefaultTagAndCar(this.state.selectedUser);
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public startTransactionConfirm = () => {
    this.setState({ showStartTransactionDialog: true });
  };

  public async startTransaction(): Promise<void> {
    await this.refresh();
    const { chargingStation, connector, selectedTag, selectedCar, selectedUser, buttonDisabled, canStartTransaction } = this.state;
    try {
      if (buttonDisabled || !canStartTransaction) {
        Message.showError(I18n.t('Not authorized'));
        return;
      }
      // Check already in use
      if (connector.status !== ChargePointStatus.AVAILABLE && connector.status !== ChargePointStatus.PREPARING) {
        Message.showError(I18n.t('transactions.connectorNotAvailable'));
        return;
      }
      // Disable the button
      this.setState({ buttonDisabled: true });
      // Start the Transaction
      const response = await this.centralServerProvider.startTransaction(
        chargingStation.id,
        connector.connectorId,
        selectedTag?.visualID,
        selectedCar?.id as string,
        selectedUser?.id as string
      );
      if (response?.status === 'Accepted') {
        // Show success message
        Message.showSuccess(I18n.t('details.accepted'));
        // Nb trials the button stays disabled
        this.setState({ transactionPending: true, buttonDisabled: true, transactionPendingTimesUp: false });
        setTimeout(() => this.setState({ transactionPendingTimesUp: true }), 40000);
        await this.refresh();
      } else {
        // Re-enable the button
        this.setState({ buttonDisabled: false });
        // Show message
        if (this.state.connector.status === ChargePointStatus.AVAILABLE) {
          Message.showError(I18n.t('transactions.carNotConnectedError'));
        } else {
          Message.showError(I18n.t('details.denied'));
        }
      }
    } catch (error) {
      // Enable the button
      this.setState({ buttonDisabled: false });
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'transactions.transactionStartUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
  }

  public stopTransactionConfirm = async () => {
    const { chargingStation } = this.state;
    // Confirm
    Alert.alert(I18n.t('details.stopTransaction'), I18n.t('details.stopTransactionMessage', { chargeBoxID: chargingStation.id }), [
      { text: I18n.t('general.yes'), onPress: async () => this.stopTransaction() },
      { text: I18n.t('general.no') }
    ]);
  };

  public stopTransaction = async () => {
    const { chargingStation, connector } = this.state;
    try {
      // Disable button
      this.setState({ buttonDisabled: true });
      // Remote Stop the Transaction
      if (connector.status !== ChargePointStatus.AVAILABLE) {
        const response = await this.centralServerProvider.stopTransaction(chargingStation.id, connector.currentTransactionID);
        if (response?.status === 'Accepted') {
          Message.showSuccess(I18n.t('details.accepted'));
          await this.refresh();
        } else {
          Message.showError(I18n.t('details.denied'));
        }
        // Soft Stop Transaction
      } else {
        const response = await this.centralServerProvider.softStopstopTransaction(connector.currentTransactionID);
        if (response?.status === 'Invalid') {
          Message.showError(I18n.t('details.denied'));
        } else {
          Message.showSuccess(I18n.t('details.accepted'));
          await this.refresh();
        }
      }
    } catch (error) {
      // Other common Error
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'transactions.transactionStopUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
  };

  public getDurationInfos = (
    transaction: Transaction,
    connector: Connector
  ): { totalInactivitySecs?: number; elapsedTimeFormatted?: string; inactivityFormatted?: string } => {
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
      return {
        totalInactivitySecs: transaction.currentTotalInactivitySecs,
        elapsedTimeFormatted,
        inactivityFormatted
      };
      // Basic User: Use the connector data
    } else if (connector && connector.currentTransactionID) {
      let elapsedTimeFormatted = Constants.DEFAULT_DURATION;
      let inactivityFormatted = Constants.DEFAULT_DURATION;
      // Elapsed Time?
      if (connector.currentTransactionDate) {
        // Format
        const durationSecs = (Date.now() - new Date(connector.currentTransactionDate).getTime()) / 1000;
        elapsedTimeFormatted = Utils.formatDurationHHMMSS(durationSecs, false);
      }
      // Inactivity?
      if (connector && connector.currentTotalInactivitySecs) {
        // Format
        inactivityFormatted = Utils.formatDurationHHMMSS(connector.currentTotalInactivitySecs, false);
      }
      // Set
      return {
        totalInactivitySecs: connector ? connector.currentTotalInactivitySecs : 0,
        elapsedTimeFormatted,
        inactivityFormatted
      };
    }
    return {
      elapsedTimeFormatted: Constants.DEFAULT_DURATION
    };
  };

  public renderConnectorStatus = (style: any) => {
    const { chargingStation, connector, isAdmin, isSiteAdmin } = this.state;
    return (
      <View style={style.columnContainer}>
        <ConnectorStatusComponent navigation={this.props.navigation} connector={connector} inactive={chargingStation?.inactive} />
        {(isAdmin || isSiteAdmin) && connector?.status === ChargePointStatus.FAULTED && (
          <Text style={[style.subLabel, style.subLabelStatusError]}>({connector.errorCode})</Text>
        )}
      </View>
    );
  };

  public renderUserInfo = (style: any) => {
    const { transaction } = this.state;
    return transaction ? (
      <View style={style.columnContainer}>
        <UserAvatar size={45} user={transaction.user} navigation={this.props.navigation} />
        <Text numberOfLines={1} style={[style.label, style.labelUser, style.info]}>
          {Utils.buildUserName(transaction.user)}
        </Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <UserAvatar size={44} navigation={this.props.navigation} />
        <Text style={[style.label, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderPrice = (style: any) => {
    const { transaction, connector } = this.state;
    let price = 0;
    if (transaction) {
      price = Utils.roundTo(transaction.currentCumulatedPrice, 2);
    }
    return connector && connector.currentTransactionID && transaction && !isNaN(price) ? (
      <View style={style.columnContainer}>
        <Icon type="FontAwesome" name="money" style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>{price}</Text>
        <Text style={[style.subLabel, style.info]}>({transaction.stop ? transaction.stop.priceUnit : transaction.priceUnit})</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon type="FontAwesome" name="money" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderInstantPower = (style: any) => {
    const { connector } = this.state;
    return connector && connector.currentTransactionID && !isNaN(connector.currentInstantWatts) ? (
      <View style={style.columnContainer}>
        <Icon type="FontAwesome" name="bolt" style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>
          {connector.currentInstantWatts / 1000 > 0 ? I18nManager.formatNumber(Math.round(connector.currentInstantWatts / 10) / 100) : 0}
        </Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t('details.instant')} (kW)</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon type="FontAwesome" name="bolt" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderElapsedTime = (style: any) => {
    const { elapsedTimeFormatted, connector } = this.state;
    return connector && connector.currentTransactionID ? (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="timer" style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>{elapsedTimeFormatted}</Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t('details.duration')}</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="timer" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderInactivity = (style: any) => {
    const { connector, inactivityFormatted } = this.state;
    const inactivityStyle = connector ? Utils.computeInactivityStyle(connector.currentInactivityStatus) : '';
    return connector && connector.currentTransactionID ? (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="timer-off" style={[style.icon, inactivityStyle]} />
        <Text style={[style.label, style.labelValue, inactivityStyle]}>{inactivityFormatted}</Text>
        <Text style={[style.subLabel, inactivityStyle]}>{I18n.t('details.duration')}</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon type="MaterialIcons" name="timer-off" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderTotalConsumption = (style: any) => {
    const { connector } = this.state;
    return connector && connector.currentTransactionID && !isNaN(connector.currentTotalConsumptionWh) ? (
      <View style={style.columnContainer}>
        <Icon style={[style.icon, style.info]} type="MaterialIcons" name="ev-station" />
        <Text style={[style.label, style.labelValue, style.info]}>
          {connector ? I18nManager.formatNumber(Math.round(connector.currentTotalConsumptionWh / 10) / 100) : ''}
        </Text>
        <Text style={[style.subLabel, style.info]}>{I18n.t('details.total')} (kW.h)</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon style={[style.icon, style.disabled]} type="MaterialIcons" name="ev-station" />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderBatteryLevel = (style: any) => {
    const { transaction, connector } = this.state;
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

  public renderShowLastTransactionButton = (style: any) => {
    const { isAdmin, isSiteAdmin, connector } = this.state;
    if ((isAdmin || isSiteAdmin) && connector) {
      return (
        <TouchableOpacity style={style.lastTransactionContainer} onPress={async () => this.showLastTransaction()}>
          <View style={style.buttonLastTransaction}>
            <Icon style={style.lastTransactionIcon} type="MaterialCommunityIcons" name="history" />
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={[style.lastTransactionContainer]} />;
  };

  public renderReportErrorButton = (style: any) => {
    const { connector } = this.state;
    if (connector) {
      return (
        <TouchableOpacity style={[style.reportErrorContainer]} onPress={async () => this.showReportError()}>
          <View style={style.reportErrorButton}>
            <Icon style={style.reportErrorIcon} type="MaterialIcons" name="error-outline" />
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={[style.lastTransactionContainer]} />;
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
    const { canStopTransaction } = this.state;
    return (
      <TouchableOpacity onPress={async () => this.stopTransactionConfirm()} disabled={!canStopTransaction}>
        <View
          style={
            !canStopTransaction
              ? [style.buttonTransaction, style.stopTransaction, style.buttonTransactionDisabled]
              : [style.buttonTransaction, style.stopTransaction]
          }>
          <Icon
            style={
              !canStopTransaction
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

  public onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  public render() {
    const { navigation } = this.props;
    const { showChargingSettings } = this.state;
    const style = computeStyleSheet();
    const {
      connector,
      canStopTransaction,
      canStartTransaction,
      chargingStation,
      loading,
      siteImage,
      isPricingActive,
      showStartTransactionDialog
    } = this.state;
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector ? connector.connectorId : null);
    return loading ? (
      <Spinner style={style.spinner} color="grey" />
    ) : (
      <Container style={style.container}>
        {showStartTransactionDialog && this.renderStartTransactionDialog()}
        <HeaderComponent
          navigation={this.props.navigation}
          title={chargingStation ? chargingStation.id : '-'}
          subTitle={connectorLetter ? `(${I18n.t('details.connector')} ${connectorLetter})` : ''}
          leftAction={() => this.onBack()}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
        />
        {/* Site Image */}
        <Image style={style.backgroundImage as ImageStyle} source={siteImage ? { uri: siteImage } : noSite} />
        {/* Show Last Transaction */}
        {this.renderShowLastTransactionButton(style)}
        {/* Report Error */}
        {this.renderReportErrorButton(style)}
        {/* Start/Stop Transaction */}
        {canStartTransaction && connector?.currentTransactionID === 0 ? (
          <View style={style.transactionContainer}>{this.renderStartTransactionButton(style)}</View>
        ) : canStopTransaction && connector?.currentTransactionID > 0 ? (
          <View style={style.transactionContainer}>{this.renderStopTransactionButton(style)}</View>
        ) : (
          <View style={style.noButtonStopTransaction} />
        )}
        {/* Details */}
        {connector?.status === ChargePointStatus.AVAILABLE || connector?.status === ChargePointStatus.PREPARING ? (
          <View style={style.selectUserCarBadgeContainer}>
            {/* Error messages */}
            {this.renderSplitterButton(style)}
            {showChargingSettings ? (
              <ScrollView style={style.scrollviewContainer} contentContainerStyle={style.chargingSettingsContainer}>
                {this.renderDefaultSwitch(style)}
                {/* User */}
                {this.renderUserSelection(style)}
                {/* Badge */}
                {this.renderTagSelection(style)}
                {/* Car */}
                {this.renderCarSelection(style)}
              </ScrollView>
            ) : (
              <View>{this.renderConnectorInfo()}</View>
            )}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={style.scrollViewContainer}
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.manualRefresh} />}>
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
          </ScrollView>
        )}
      </Container>
    );
  }

  private renderConnectorInfo() {
    return (
      <View>
        <ChargingStationConnectorComponent
          listed={false}
          chargingStation={this.state.chargingStation}
          connector={this.state.connector}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  private renderDefaultSwitch(style: any) {
    const { defaultSettings, connector } = this.state;
    const disabled = connector.status !== ChargePointStatus.AVAILABLE && connector.status !== ChargePointStatus.PREPARING;
    return (
      <View style={style.switchContainer}>
        <Text style={style.switchLabel}>{I18n.t('general.defaultSettings')}</Text>
        <Switch disabled={disabled} value={defaultSettings} onValueChange={this.onSwitchValueChanged.bind(this)} />
      </View>
    );
  }

  private onSwitchValueChanged() {
    const { defaultSettings } = this.state;
    if (!defaultSettings) {
      this.onUserSelected([this.currentUser as unknown as User]);
    }
    this.setState({ defaultSettings: !defaultSettings });
  }

  private async getUserDefaultTagAndCar(user: User): Promise<UserDefaultTagCar> {
    try {
      return this.centralServerProvider?.getUserDefaultTagCar(user?.id as string);
    } catch (error) {
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        'invoices.chargerUnexpectedError',
        this.props.navigation,
        this.refresh.bind(this)
      );
    }
    return null;
  }

  private renderAdviceMessage(style: any) {
    return (
      <View style={style.messageContainer}>
        <Icon type={'MaterialCommunityIcons'} name={'power-plug'} />
        <Text style={style.adviceText}>Be sure that the cable is connected to both the car and the charging station</Text>
      </View>
    );
  }

  private renderBillingErrorMessages(style: any) {
    const { userDefaultTagCar, selectedUser } = this.state;
    const { navigation } = this.props;
    const listItemCommonStyle = computeListItemCommonStyle();
    // Check the error code
    const errorCode = userDefaultTagCar.errorCodes[0];
    switch (errorCode) {
      case StartTransactionErrorCode.BILLING_NO_PAYMENT_METHOD:
        return (
          <View style={[listItemCommonStyle.noShadowContainer, style.noItemContainer, style.noTagContainer]}>
            <Icon style={style.noPaymentMethodIcon} type={'MaterialCommunityIcons'} name={'credit-card-off'} />
            <View style={style.column}>
              <Text ellipsizeMode={'tail'} numberOfLines={2} style={style.errorMessage}>
                {I18n.t('transactions.noPaymentMethodError')}
              </Text>
              {selectedUser?.id === this.currentUser.id && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('PaymentMethodsNavigator', { screen: 'StripePaymentMethodCreationForm' })}>
                  <View style={style.addItemContainer}>
                    <Text style={[style.linkText, style.plusSign]}>+</Text>
                    <Text ellipsizeMode={'tail'} style={[style.messageText, style.linkText, style.linkLabel]}>
                      {I18n.t('paymentMethods.addPaymentMethod')}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      default:
        return null;
    }
  }

  private renderSplitterButton(style: any) {
    const { showChargingSettings, showBillingErrorMessage, showBadgeErrorMessage } = this.state;
    return (
      <View style={style.splitter}>
        <TouchableOpacity
          onPress={() => this.setState({ showChargingSettings: false })}
          style={[style.splitterButton, !showChargingSettings && style.splitterButtonFocused]}>
          <Text style={style.splitterButtonText}>{I18n.t('details.connector')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setState({ showChargingSettings: true })}
          style={[style.splitterButton, showChargingSettings && style.splitterButtonFocused]}>
          <Text adjustsFontSizeToFit={true} style={style.splitterButtonText}>
            {I18n.t('transactions.chargingSettings')}
            {(showBillingErrorMessage || showBadgeErrorMessage) && <Text style={style.errorAsterisque}>*</Text>}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  private renderUserSelection(style: any) {
    const { navigation } = this.props;
    const { selectedUser, defaultSettings, isAdmin, showBillingErrorMessage } = this.state;
    return (
      <View style={style.rowUserCarBadgeContainer}>
        <ModalSelect<User>
          openable={isAdmin}
          disabled={defaultSettings}
          label={I18n.t('users.user')}
          renderItem={() => <UserComponent shadowed={!defaultSettings} user={selectedUser} navigation={navigation} />}
          defaultItem={selectedUser}
          onItemsSelected={this.onUserSelected.bind(this)}
          buildItemName={Utils.buildUserName.bind(this)}
          navigation={navigation}
          selectionMode={ItemSelectionMode.SINGLE}>
          <Users navigation={navigation} />
        </ModalSelect>
        {showBillingErrorMessage && this.renderBillingErrorMessages(style)}
      </View>
    );
  }

  private renderCarSelection(style: any) {
    const { navigation } = this.props;
    const { tagCarLoading, selectedUser, selectedCar, selectedUserCarsCount, defaultSettings } = this.state;
    const shadowedInput = selectedUserCarsCount > 1 && !defaultSettings;
    return (
      <View style={style.rowUserCarBadgeContainer}>
        <ModalSelect<Car>
          label={I18n.t('cars.car')}
          disabled={defaultSettings}
          openable={selectedUserCarsCount >= 2}
          renderNoItem={this.renderNoCar.bind(this)}
          renderItem={() => <CarComponent shadowed={shadowedInput} car={selectedCar} navigation={navigation} />}
          ref={this.carModalRef}
          defaultItem={selectedCar}
          defaultItemLoading={tagCarLoading}
          onItemsSelected={(selectedCars: Car[]) => this.setState({ selectedCar: selectedCars?.[0] })}
          buildItemName={(car: Car) => Utils.buildCarCatalogName(car?.carCatalog)}
          navigation={navigation}
          selectionMode={ItemSelectionMode.SINGLE}>
          <Cars userIDs={[selectedUser?.id as string]} navigation={navigation} />
        </ModalSelect>
      </View>
    );
  }

  private renderNoCar() {
    const listItemCommonStyle = computeListItemCommonStyle();
    const style = computeStyleSheet();
    const { selectedUser } = this.state;
    return (
      <View style={[listItemCommonStyle.noShadowContainer, style.noItemContainer, style.noCarContainer]}>
        <Icon style={style.noCarIcon} type={'MaterialCommunityIcons'} name={'car'} />
        <View style={style.column}>
          <Text style={style.messageText}>{I18n.t('cars.noCarMessageTitle')}</Text>
          {this.currentUser?.id === selectedUser?.id && false && (
            <View style={style.addItemContainer}>
              <Text style={[style.linkText, style.plusSign]}>+</Text>
              <Text style={[style.messageText, style.linkText, style.linkLabel]}>{I18n.t('cars.addCar')}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  private renderTagSelection(style: any) {
    const { navigation } = this.props;
    const { tagCarLoading, selectedUser, selectedTag, selectedUserTagsCount, defaultSettings } = this.state;
    const shadowedInput = !defaultSettings && selectedUserTagsCount > 1;
    return (
      <View style={style.rowUserCarBadgeContainer}>
        <ModalSelect<Tag>
          renderItem={() => <TagComponent shadowed={shadowedInput} tag={selectedTag} navigation={navigation} />}
          label={I18n.t('tags.tag')}
          disabled={defaultSettings}
          openable={selectedUserTagsCount >= 2}
          renderNoItem={this.renderNoTag.bind(this)}
          ref={this.tagModalRef}
          defaultItem={selectedTag}
          defaultItemLoading={tagCarLoading}
          onItemsSelected={(selectedTags: Tag[]) => this.setState({ selectedTag: selectedTags?.[0] })}
          buildItemName={(tag: Tag) => tag?.description ?? '-'}
          navigation={navigation}
          selectionMode={ItemSelectionMode.SINGLE}>
          <Tags userIDs={[selectedUser?.id as string]} navigation={navigation} />
        </ModalSelect>
      </View>
    );
  }

  private renderNoTag() {
    const listItemCommonStyle = computeListItemCommonStyle();
    const style = computeStyleSheet();
    return (
      <View style={[listItemCommonStyle.noShadowContainer, style.noItemContainer, style.noTagContainer]}>
        <Icon type={'MaterialCommunityIcons'} name={'credit-card-off'} style={style.noTagIcon} />
        <View style={style.column}>
          <Text style={style.errorMessage}>{I18n.t('tags.noTagMessageTitle')}</Text>
          <Text style={style.errorMessage}>{I18n.t('tags.noTagMessageSubtitle')}</Text>
        </View>
      </View>
    );
  }

  private onUserSelected(selectedUsers: User[]): void {
    const selectedUser = selectedUsers?.[0];
    this.setState({ selectedUser }, this.refresh.bind(this));
    this.loadSelectedUserDefaultTagAndCar(selectedUser);
  }

  private async loadSelectedUserDefaultTagAndCar(selectedUser: User): Promise<void> {
    this.setState({ tagCarLoading: true });
    const userDefaultTagCar = await this.getUserDefaultTagAndCar(selectedUser);
    this.carModalRef.current?.clearInput();
    this.tagModalRef.current?.clearInput();
    // Temporary workaround to ensure that the default property is set (server-side changes are to be done)
    if (userDefaultTagCar.tag) {
      userDefaultTagCar.tag.default = true;
    }
    // Temporary workaround to ensure that the default car has all the needed properties (server-side changes are to be done)
    if (userDefaultTagCar.car) {
      const car = await this.getSelectedUserDefaultCar(userDefaultTagCar.car.id);
      userDefaultTagCar.car = car ?? userDefaultTagCar.car;
    }
    this.setState({ selectedCar: userDefaultTagCar?.car, selectedTag: userDefaultTagCar?.tag, tagCarLoading: false });
  }

  private async getSelectedUserDefaultCar(carID: string | number): Promise<Car> {
    if (carID) {
      const params = {
        ID: carID
      };
      try {
        return await this.centralServerProvider.getCar(params);
      } catch (error) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'tags.siteUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  }

  private async countSelectedUserCars(selectedUser: User): Promise<number> {
    const userID = selectedUser?.id;
    if (userID) {
      const params = {
        UserID: userID
      };
      try {
        const userCars = await this.centralServerProvider.getCars(params, Constants.ONLY_RECORD_COUNT);
        return userCars?.count;
      } catch (error) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'tags.siteUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  }

  private async countSelectedUserTags(selectedUser: User): Promise<number> {
    const userID = selectedUser?.id;
    if (userID) {
      const params = {
        UserID: userID
      };
      try {
        const userTags = await this.centralServerProvider.getTags(params, Constants.ONLY_RECORD_COUNT);
        return userTags?.count;
      } catch (error) {
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'tags.siteUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
    }
    return null;
  }

  private renderStartTransactionDialog() {
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
    const modalCommonStyle = computeModalCommonStyle();
    return (
      <DialogModal
        title={I18n.t('details.startTransaction')}
        withCloseButton={true}
        close={() => this.setState({ showStartTransactionDialog: false, startTransactionDialogWasClosed: true })}
        renderIcon={(style) => <Icon style={style} type={'MaterialIcons'} name={'play-circle-outline'} />}
        description={I18n.t('details.startTransactionMessage', { chargeBoxID: chargingStationID })}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () =>
              this.setState({ showStartTransactionDialog: false, startTransactionDialogWasClosed: true }, async () =>
                this.startTransaction()
              ),
            buttonTextStyle: modalCommonStyle.primaryButton,
            buttonStyle: modalCommonStyle.primaryButton
          },
          {
            text: I18n.t('general.no'),
            action: () => this.setState({ showStartTransactionDialog: false, startTransactionDialogWasClosed: true }),
            buttonTextStyle: modalCommonStyle.primaryButton,
            buttonStyle: modalCommonStyle.primaryButton
          }
        ]}
      />
    );
  }
}
