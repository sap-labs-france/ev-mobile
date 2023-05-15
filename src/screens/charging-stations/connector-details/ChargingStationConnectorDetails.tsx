import {StatusCodes} from 'http-status-codes';
import I18n from 'i18n-js';
import {HStack, Icon, Spinner} from 'native-base';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  ImageStyle,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native';
import Orientation from 'react-native-orientation-locker';

import noSite from '../../../../assets/no-site.png';
import CarComponent from '../../../components/car/CarComponent';
import ChargingStationConnectorComponent
  from '../../../components/charging-station/connector/ChargingStationConnectorComponent';
import ConnectorStatusComponent from '../../../components/connector-status/ConnectorStatusComponent';
import HeaderComponent from '../../../components/header/HeaderComponent';
import {ItemSelectionMode} from '../../../components/list/ItemsList';
import computeListItemCommonStyle from '../../../components/list/ListItemCommonStyle';
import DialogModal from '../../../components/modal/DialogModal';
import computeModalCommonStyle from '../../../components/modal/ModalCommonStyle';
import ModalSelect from '../../../components/modal/ModalSelect';
import TagComponent from '../../../components/tag/TagComponent';
import UserAvatar from '../../../components/user/avatar/UserAvatar';
import UserComponent from '../../../components/user/UserComponent';
import I18nManager from '../../../I18n/I18nManager';
import BaseProps from '../../../types/BaseProps';
import Car from '../../../types/Car';
import ChargingStation, {ChargePointStatus, Connector, OCPPGeneralResponse} from '../../../types/ChargingStation';
import {HTTPAuthError} from '../../../types/HTTPError';
import Tag from '../../../types/Tag';
import Transaction, {StartTransactionErrorCode, UserSessionContext} from '../../../types/Transaction';
import User, {UserStatus} from '../../../types/User';
import UserToken from '../../../types/UserToken';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseAutoRefreshScreen from '../../base-screen/BaseAutoRefreshScreen';
import Cars from '../../cars/Cars';
import Tags from '../../tags/Tags';
import Users from '../../users/list/Users';
import computeStyleSheet from './ChargingStationConnectorDetailsStyles';
import {scale} from 'react-native-size-matters';
import computeActivityIndicatorCommonStyles from '../../../components/activity-indicator/ActivityIndicatorCommonStyle';
import DurationUnitFormat from 'intl-unofficial-duration-unit-format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

function SocInput(props: { inputProps: TextInputProps; leftText: string; containerStyle?: ViewStyle }) {
  const style = computeStyleSheet();
  return (
    <HStack style={[style.socInputContainer, props?.containerStyle]}>
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.socInputText, style.socInputLabelText]}>{props?.leftText}</Text>
      <TextInput
        style={style.socInput}
        keyboardType={'number-pad'}
        placeholder={'0'}
        maxLength={3}
        returnKeyType={'done'}
        {...props?.inputProps}
      />
      <Text style={style.socInputText}>%</Text>
    </HStack>
  );
}

// Max session duration is 20 hours
const MAX_SESSION_DURATION_MILLISECS = 20 * 60 * 60 * 1000;
// Min session
const MIN_SESSION_DURATION_MILLISECS = 60000;

export interface Props extends BaseProps {}

export interface SettingsErrors {
  noBadgeError?: boolean;
  inactiveBadgeError?: boolean;
  billingError?: boolean;
  inactiveUserError?: boolean;
  departureSoCError?: boolean;
}

export interface State {
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
  showStartTransactionDialog: boolean;
  showStopTransactionDialog: boolean;
  selectedUser?: User;
  selectedCar?: Car;
  selectedTag?: Tag;
  tagCarLoading?: boolean;
  sessionContextLoading?: boolean;
  settingsErrors?: SettingsErrors;
  transactionPending?: boolean;
  didPreparing?: boolean;
  transactionPendingTimesUp?: boolean;
  showChargingSettings?: boolean;
  showTimePicker?: boolean;
  departureTime?: Date;
  departureSoC?: number;
  currentSoC?: number;
  sessionContext: UserSessionContext;
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
      showStartTransactionDialog: undefined,
      showStopTransactionDialog: false,
      selectedUser: null,
      selectedCar: null,
      selectedTag: null,
      tagCarLoading: false,
      sessionContextLoading: true,
      settingsErrors: {},
      transactionPending: false,
      didPreparing: false,
      transactionPendingTimesUp: false,
      showChargingSettings: undefined,
      showTimePicker: false,
      departureTime: null,
      departureSoC: null,
      currentSoC: null,
      sessionContext: null
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
    const userFromNavigation = Utils.getParamFromNavigation(this.props.route, 'user', null) as unknown as User;
    const tagFromNavigation = Utils.getParamFromNavigation(this.props.route, 'tag', null) as unknown as Tag;
    const currentUser = {
      id: this.currentUser?.id,
      firstName: this.currentUser?.firstName,
      name: this.currentUser?.name,
      status: UserStatus.ACTIVE,
      role: this.currentUser.role,
      email: this.currentUser.email
    } as User;
   // await this.loadSelectedUserDefaultTagAndCar(selectedUser);
    const selectedUser = userFromNavigation ?? currentUser;
    const selectedTag = tagFromNavigation ?? this.state.selectedTag;
    this.setState({ selectedUser, selectedTag },async () => this.refresh(false, () => void this.loadUserSessionContext()));
  }

  public componentDidFocus(): void {
    super.componentDidFocus();
    void this.loadUserSessionContext();
    Orientation.lockToPortrait();
  }

  public componentDidBlur(): void {
    super.componentDidBlur();
    Orientation.unlockAllOrientations();
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public getSiteImage = async (siteID: string): Promise<string> => {
    try {
      // Get Site
      return await this.centralServerProvider.getSiteImage(siteID);
    } catch (error) {
      if (error.request.status !== StatusCodes.NOT_FOUND) {
        // Other common Error
        await Utils.handleHttpUnexpectedError(
          this.centralServerProvider,
          error,
          'sites.siteUnexpectedError',
          this.props.navigation,
          this.refresh.bind(this)
        );
      }
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
      if (!error.request || error.request.status !== StatusCodes.FORBIDDEN) {
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
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', '') as string;
    const connectorID: number = Utils.convertToInt(Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as number);
    // Get the last session
    // Navigate
    navigation.navigate('ReportError', {
      params: {
        title: chargingStationID + '-' + Utils.getConnectorLetterFromConnectorID(connectorID)
      },
      key: `${Utils.randomNumber()}`
    });
  };

  public isTransactionStillPending(connector: Connector): boolean {
    const { transactionPending, transactionPendingTimesUp, didPreparing } = this.state;
    if (transactionPending) {
      if (connector?.status === ChargePointStatus.PREPARING) {
        this.setState({ didPreparing: true });
        return true;
      } else if (connector?.status === ChargePointStatus.AVAILABLE && !didPreparing && !transactionPendingTimesUp) {
        return true;
      }
    }
    return false;
  }

  // eslint-disable-next-line complexity
  public async refresh(showSpinner = false, callback: () => void = () => {}): Promise<void> {
    const newState = showSpinner ? {refreshing: true} : this.state;
    this.setState(newState, async () => {
      let siteImage = this.state.siteImage;
      let transaction = null;
      let showStartTransactionDialog: boolean;
      const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
      const connectorID = Utils.convertToInt(Utils.getParamFromNavigation(this.props.route, 'connectorID', null) as string);
      const startTransactionFromQRCode = Utils.getParamFromNavigation(this.props.route, 'startTransaction', null, true) as boolean;

      // Get Charging Station
      const chargingStation = await this.getChargingStation(chargingStationID);
      // Get Connector from Charging Station
      const connector = chargingStation ? Utils.getConnectorFromID(chargingStation, connectorID) : null;
      const transactionStillPending = this.isTransactionStillPending(connector);

      // When Scanning a QR-Code, redirect if a session is already in progress. (if the connector has a non null userID)
      if (startTransactionFromQRCode && connector?.currentUserID) {
        Message.showWarning(I18n.t('transactions.sessionAlreadyInProgressError'));
        this.props.navigation.goBack();
        return;
      }
      // Get the site image if not already fetched
      if (!siteImage && chargingStation?.siteArea) {
        siteImage = await this.getSiteImage(chargingStation?.siteArea?.siteID);
      }
      // Get Current Transaction
      if (connector?.currentTransactionID && connector?.canReadTransaction) {
        transaction = await this.getTransaction(connector.currentTransactionID);
      }
      // // Compute Duration
      const durationInfos = this.getDurationInfos(transaction, connector);
      if (
        startTransactionFromQRCode &&
        (connector?.status === ChargePointStatus.AVAILABLE || connector?.status === ChargePointStatus.PREPARING) &&
        !this.isButtonDisabled()
      ) {
        showStartTransactionDialog = true;
      }
      this.setState({
        showStartTransactionDialog: this.state.showStartTransactionDialog ?? showStartTransactionDialog,
        chargingStation,
        connector,
        transaction,
        siteImage,
        ...(!transactionStillPending && {transactionPending: false, didPreparing: false}),
        ...(!!this.state.departureTime && {departureTime: new Date(Math.max(this.getMinimumDateMillisecs(), this.state.departureTime?.getTime()))}),
        refreshing: false,
        isAdmin: this.securityProvider ? this.securityProvider.isAdmin() : false,
        isSiteAdmin: this.securityProvider?.isSiteAdmin(chargingStation?.siteArea?.siteID) ?? false,
        canStartTransaction: chargingStation ? this.canStartTransaction(chargingStation, connector) : false,
        canStopTransaction: chargingStation ? this.canStopTransaction(chargingStation, connector) : false,
        ...durationInfos,
        isPricingActive: this.securityProvider?.isComponentPricingActive(),
        loading: false
      },() => callback?.()) ;
    });
  };

  public canStopTransaction = (chargingStation: ChargingStation, connector: Connector): boolean => {
    // Transaction?
    if (connector && connector.currentTransactionID !== 0) {
      // Check Auth
      return this.securityProvider?.canStopTransaction(chargingStation?.siteArea, connector.currentTagID);
    }
    return false;
  };

  public canStartTransaction(chargingStation: ChargingStation, connector: Connector): boolean {
    // Transaction?
    if (connector && connector.currentTransactionID === 0) {
      // Check Auth
      return this.securityProvider?.canStartTransaction(chargingStation?.siteArea);
    }
    return false;
  }

  public manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  public startTransactionConfirm = () => {
    this.setState({ showStartTransactionDialog: true });
  };

  public async startTransaction(): Promise<void> {
    await this.refresh();
    const { chargingStation, connector, selectedTag, selectedCar, selectedUser, canStartTransaction, currentSoC, departureSoC, departureTime } = this.state;
    try {
      if (this.isButtonDisabled() || !canStartTransaction) {
        Message.showError(I18n.t('general.notAuthorized'));
        return;
      }
      this.setState({ buttonDisabled: true });
      const departureTimeAsString = !departureTime ? departureTime : new Date(Math.max(this.getMinimumDateMillisecs(), departureTime.getTime())).toISOString();
      // Start the Transaction
      const response = await this.centralServerProvider.startTransaction(
        chargingStation.id,
        connector.connectorId,
        selectedTag?.visualID,
        selectedCar?.id as string,
        selectedUser?.id as string,
        currentSoC,
        departureSoC,
        departureTimeAsString as string
      );
      if (response?.status === OCPPGeneralResponse.ACCEPTED) {
        // Show success message
        Message.showSuccess(I18n.t('details.accepted'));
        // Nb trials the button stays disabled
        this.setState({ transactionPending: true, transactionPendingTimesUp: false });
        setTimeout(() => this.setState({ transactionPendingTimesUp: true }), 40000);
        await this.refresh();
      } else {
        // Re-enable the button
        this.setState({ buttonDisabled: false });
        // Show message
        if (this.state.connector?.status === ChargePointStatus.AVAILABLE) {
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

  public renderStopTransactionDialog() {
    const { chargingStation } = this.state;
    const modalCommonStyle = computeModalCommonStyle();
    return (
      <DialogModal
        withCloseButton={true}
        close={() => this.setState({ showStopTransactionDialog: false })}
        title={I18n.t('details.stopTransaction')}
        description={I18n.t('details.stopTransactionMessage', { chargeBoxID: chargingStation.id })}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () => {
              this.stopTransaction();
              this.setState({ showStopTransactionDialog: false });
            },
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          },
          {
            text: I18n.t('general.no'),
            action: () => this.setState({ showStopTransactionDialog: false }),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          }
        ]}
      />
    );
  }

  public stopTransaction = async () => {
    const { connector } = this.state;
    try {
      // Disable button
      this.setState({ buttonDisabled: true });
      // Remote Stop the Transaction
      const response = await this.centralServerProvider.stopTransaction(connector.currentTransactionID);
      if (response?.status === 'Accepted') {
        Message.showSuccess(I18n.t('details.accepted'));
        await this.refresh();
      } else {
        Message.showError(I18n.t('details.denied'));
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
    const durationFormatOptions = {style: DurationUnitFormat.styles.NARROW, format: '{hour} {minutes}'};
    const defaultDuration = I18nManager.formatDuration(0, durationFormatOptions);
    if (transaction) {
      let elapsedTimeFormatted = defaultDuration;
      let inactivityFormatted = defaultDuration;
      // Elapsed Time?
      if (transaction.currentTotalDurationSecs) {
        // Format
        elapsedTimeFormatted = I18nManager.formatDuration(transaction.currentTotalDurationSecs, durationFormatOptions);
      }
      // Inactivity?
      if (transaction.currentTotalInactivitySecs) {
        // Format
        inactivityFormatted = I18nManager.formatDuration(transaction.currentTotalInactivitySecs, durationFormatOptions);
      }
      // Set
      return {
        totalInactivitySecs: transaction.currentTotalInactivitySecs,
        elapsedTimeFormatted,
        inactivityFormatted
      };
      // Basic User: Use the connector data
    } else if (connector && connector.currentTransactionID) {
      let elapsedTimeFormatted = defaultDuration;
      let inactivityFormatted = defaultDuration;
      // Elapsed Time?
      if (connector.currentTransactionDate) {
        // Format
        const durationSecs = (Date.now() - new Date(connector.currentTransactionDate).getTime()) / 1000;
        elapsedTimeFormatted = I18nManager.formatDuration(durationSecs, durationFormatOptions);
      }
      // Inactivity?
      if (connector?.currentTotalInactivitySecs) {
        // Format
        inactivityFormatted = I18nManager.formatDuration(connector.currentTotalInactivitySecs, durationFormatOptions);
      }
      // Set
      return {
        totalInactivitySecs: connector ? connector.currentTotalInactivitySecs : 0,
        elapsedTimeFormatted,
        inactivityFormatted
      };
    }
    return {
      elapsedTimeFormatted: defaultDuration
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
    let price;
    if (transaction) {
      price = I18nManager.formatCurrency(transaction.currentCumulatedPrice, transaction.priceUnit);
    }
    return connector && connector.currentTransactionID && transaction ? (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="money" style={[style.icon, style.info]} />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>{price}</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="money" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderInstantPower = (style: any) => {
    const { connector } = this.state;
    return connector && connector.currentTransactionID && !isNaN(connector.currentInstantWatts) ? (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={FontAwesome} name="bolt" style={[style.icon, style.info]} />
        <Text style={[style.label, style.labelValue, style.info]}>
          {connector.currentInstantWatts > 0 ? I18nManager.formatNumber(connector.currentInstantWatts / 1000, {maximumFractionDigits: 2} ) : 0} kW
        </Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={FontAwesome} name="bolt" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderElapsedTime = (style: any) => {
    const { elapsedTimeFormatted, connector } = this.state;
    return connector && connector.currentTransactionID ? (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="timer" style={[style.icon, style.info]} />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>{elapsedTimeFormatted}</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="timer" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderInactivity = (style: any) => {
    const { connector, inactivityFormatted } = this.state;
    const inactivityStyle = connector ? Utils.computeInactivityStyle(connector.currentInactivityStatus) : '';
    return connector && connector.currentTransactionID ? (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="timer-off" style={[style.icon, inactivityStyle]} />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, inactivityStyle]}>{inactivityFormatted}</Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="timer-off" style={[style.icon, style.disabled]} />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderTotalConsumption = (style: any) => {
    const { connector } = this.state;
    return connector && connector.currentTransactionID && !isNaN(connector.currentTotalConsumptionWh) ? (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} style={[style.icon, style.info]} as={MaterialIcons} name="ev-station" />
        <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue, style.info]}>
          {connector ? I18nManager.formatNumber(connector.currentTotalConsumptionWh/ 1000, {maximumFractionDigits: 2}) : ''} kW.h
        </Text>
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} style={[style.icon, style.disabled]} as={MaterialIcons} name="ev-station" />
        <Text style={[style.label, style.labelValue, style.disabled]}>-</Text>
      </View>
    );
  };

  public renderBatteryLevel = (style: any) => {
    const { transaction, connector } = this.state;
    return connector && connector.currentStateOfCharge && !isNaN(connector.currentStateOfCharge) ? (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="battery-charging-full" style={[style.icon, style.info]} />
        {transaction ?
          (
            <Text style={[style.label, style.labelValue, style.info]}><Text style={[style.label, style.batteryStartValue, style.info]}>{`${transaction.stateOfCharge}%`}</Text>
              <Text style={[style.label, style.upToSymbol, style.info]}> {'>'} </Text>{`${transaction.currentStateOfCharge}%`} </Text>
          ) :
          <Text
            style={[style.label, style.labelValue, style.info]}>{connector.currentStateOfCharge}</Text>
        }
      </View>
    ) : (
      <View style={style.columnContainer}>
        <Icon size={scale(25)} as={MaterialIcons} name="battery-charging-full" style={[style.icon, style.disabled]} />
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
            <Icon size={scale(25)} style={style.lastTransactionIcon} as={MaterialCommunityIcons} name="history" />
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
            <Icon size={scale(25)} style={style.reportErrorIcon} as={MaterialIcons} name="error-outline" />
          </View>
        </TouchableOpacity>
      );
    }
    return <View style={[style.lastTransactionContainer]} />;
  };

  public renderStartTransactionButton = (style: any) => {
    const isDisabled = this.isButtonDisabled();
    return (
      <TouchableOpacity disabled={isDisabled} onPress={() => this.startTransactionConfirm()}>
        <View
          style={
            isDisabled
              ? [style.buttonTransaction, style.startTransaction, style.buttonTransactionDisabled]
              : [style.buttonTransaction, style.startTransaction]
          }>
          <Icon
            style={
              isDisabled
                ? [style.transactionIcon, style.startTransactionIcon, style.transactionDisabledIcon]
                : [style.transactionIcon, style.startTransactionIcon]
            }
            as={MaterialIcons}
            size={scale(75)}
            name="play-arrow"
          />
        </View>
      </TouchableOpacity>
    );
  };

  public renderStopTransactionButton = (style: any) => {
    const { canStopTransaction } = this.state;
    return (
      <TouchableOpacity onPress={() => this.setState({ showStopTransactionDialog: true })} disabled={!canStopTransaction}>
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
            as={MaterialIcons}
            size={scale(75)}
            name="stop"
          />
        </View>
      </TouchableOpacity>
    );
  };

  public render() {
    const style = computeStyleSheet();
    const {
      connector,
      chargingStation,
      loading,
      isPricingActive,
      showStartTransactionDialog,
      showStopTransactionDialog
    } = this.state;
    const commonColors = Utils.getCurrentCommonColor();
    const connectorLetter = Utils.getConnectorLetterFromConnectorID(connector?.connectorId);
    return (
      <View style={style.container}>
        {showStartTransactionDialog && this.renderStartTransactionDialog()}
        {showStopTransactionDialog && this.renderStopTransactionDialog()}
        <HeaderComponent
          navigation={this.props.navigation}
          title={chargingStation ? chargingStation.id : ''}
          subTitle={connector && connectorLetter ? `(${I18n.t('details.connector')} ${connectorLetter})` : ''}
        />
        {loading ? (
          <Spinner size={scale(30)} style={style.spinner} color="grey" />
        ) :
          <View style={style.container}>
            {/* Site Image */}
            {this.renderBackGroundImage(style)}
            {/* Details */}
            {connector?.status === ChargePointStatus.AVAILABLE || connector?.status === ChargePointStatus.PREPARING || connector?.status === ChargePointStatus.FINISHING ? (
              this.renderChargingStationParameters(style)
            ) : (
              <ScrollView
                style={style.scrollViewContainer}
                contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
                refreshControl={<RefreshControl  progressBackgroundColor={commonColors.containerBgColor} colors={[commonColors.textColor, commonColors.textColor]}  refreshing={this.state.refreshing} onRefresh={this.manualRefresh} />}
              >
                {this.renderConnectorStatus(style)}
                {this.renderUserInfo(style)}
                {this.renderInstantPower(style)}
                {this.renderTotalConsumption(style)}
                {this.renderElapsedTime(style)}
                {this.renderInactivity(style)}
                {this.renderBatteryLevel(style)}
                {isPricingActive ? this.renderPrice(style) : <View style={style.columnContainer} />}
                {this.renderSmartChargingParameters(style)}
              </ScrollView>
            )}
          </View>
        }
      </View>
    );
  }

  private renderBackGroundImage(style: any) {
    const { canStopTransaction, canStartTransaction, siteImage, connector} = this.state;
    return (
      <ImageBackground source={siteImage ? { uri: siteImage } : noSite} imageStyle={style.backgroundImage} style={style.backgroundImageContainer as ImageStyle}>
        <View style={style.imageInnerContainer}>
          {/* Show Last Transaction */}
          {this.renderShowLastTransactionButton(style)}
          {/* Start/Stop Transaction */}
          {canStartTransaction && connector?.currentTransactionID === 0 ? (
            <View style={style.transactionContainer}>{this.renderStartTransactionButton(style)}</View>
          ) : canStopTransaction && connector?.currentTransactionID > 0 ? (
            <View style={style.transactionContainer}>{this.renderStopTransactionButton(style)}</View>
          ) : (
            <View style={style.noButtonStopTransaction} />
          )}
          {/* Report Error */}
          {this.renderReportErrorButton(style)}
        </View>
      </ImageBackground>
    );
  }

  private renderChargingStationParameters(style: any) {
    const activityIndicatorCommonStyles = computeActivityIndicatorCommonStyles();
    const commonColors = Utils.getCurrentCommonColor();
    const {refreshing, sessionContext, sessionContextLoading} = this.state;
    return (
      <View  style={style.connectorInfoSettingsContainer}>
        {refreshing && <ActivityIndicator
          size={scale(18)}
          color={commonColors.textColor}
          style={[activityIndicatorCommonStyles.activityIndicator, style.activityIndicator]}
          animating={true}
        /> }
        <KeyboardAwareScrollView
          persistentScrollbar={true}
          style={style.scrollviewContainer}
          contentContainerStyle={style.chargingSettingsContainer}
          keyboardShouldPersistTaps={'always'}
        >
          {this.renderConnectorInfo(style)}
          {this.renderUserSelection(style)}
          {this.renderTagSelection(style)}
          {this.securityProvider?.isComponentCarActive() && this.renderCarSelection(style)}
          {this.state.selectedCar && (
            <>
              {!sessionContextLoading && sessionContext?.smartChargingSessionParameters?.departureTime && this.renderDepartureTime()}
              {!sessionContextLoading && sessionContext?.smartChargingSessionParameters?.targetStateOfCharge && this.renderSoCInputs()}
            </>
          )}

        </KeyboardAwareScrollView>
      </View>
    );
  }

  private renderSmartChargingParameters(style: any) {
    const { transaction } = this.state;
    const departureTimeFormatted = I18nManager.formatDateTime(transaction?.departureTime, {dateStyle: 'short', timeStyle: 'short'});
    return (
      <>
        {!Utils.isNullOrUndefined(transaction?.carStateOfCharge) && (
          <View style={style.columnContainer}>
            <Icon size={scale(25)} as={MaterialIcons} name="battery-charging-full" style={style.icon} />
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label]}>{I18n.t('transactions.initialStateOfCharge')}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue]}>{transaction.carStateOfCharge}%</Text>
          </View>
        )}
        {!!transaction?.targetStateOfCharge && (
          <View style={style.columnContainer}>
            <Icon size={scale(25)} as={MaterialIcons} name="battery-charging-full" style={style.icon} />
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label]}>{I18n.t('transactions.targetStateOfCharge')}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue]}>{transaction.targetStateOfCharge}%</Text>
          </View>
        )}
        {!!transaction?.departureTime && (
          <View style={style.columnContainer}>
            <Icon size={scale(25)} as={MaterialCommunityIcons} name="clock-end" style={style.icon} />
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label]}>{I18n.t('transactions.departureTime')}</Text>
            <Text numberOfLines={1} adjustsFontSizeToFit={true} style={[style.label, style.labelValue]}>{departureTimeFormatted}</Text>
          </View>
        )}
      </>
    );
  }

  private renderDepartureTime() {
    const commonColors = Utils.getCurrentCommonColor();
    const style = computeStyleSheet();
    const { departureTime, showTimePicker } = this.state;
    const minimumDate = new Date();
    const maximumDate = new Date(new Date().getTime() + MAX_SESSION_DURATION_MILLISECS);
    const departureTimeFormatted = I18nManager.formatDateTime(departureTime, {dateStyle: 'short', timeStyle: 'short'});
    const durationSeconds = Math.abs((departureTime.getTime() - new Date().getTime())/1000);
    const durationFormatOptions = {style: DurationUnitFormat.styles.NARROW, format: `{hour} {minutes} ${durationSeconds < 60 ? '{seconds}': ''}`};
    const durationFormatted = I18nManager.formatDuration(durationSeconds, durationFormatOptions);
    const locale = this.centralServerProvider.getUserInfo()?.locale;
    const is24Hour = I18nManager?.isLocale24Hour(locale);
    return (
      <View style={style.departureTimeContainer}>
        <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.settingLabel}>{I18n.t('transactions.departureTime')}</Text>
        <TouchableOpacity style={style.departureTimeInput} onPress={() => this.setState({showTimePicker: true})}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.departureTimeText}>{departureTimeFormatted}  ({durationFormatted})</Text>
          <Icon color={commonColors.textColor} size={scale(18)} as={MaterialIcons} name={'arrow-drop-down'} />
        </TouchableOpacity>
        <DateTimePicker
          isVisible={showTimePicker}
          mode={'datetime'}
          locale={I18n.locale}
          is24Hour={is24Hour}
          cancelTextIOS={I18n.t('general.cancel')}
          confirmTextIOS={I18n.t('general.confirm')}
          buttonTextColorIOS={commonColors.textColor}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          date={departureTime}
          onConfirm={(newDepartureTime) => this.setState({showTimePicker: false, departureTime: newDepartureTime})}
          onCancel={() => this.setState({showTimePicker: false})}
        />
      </View>
    );
  }

  private renderSoCInputs() {
    const { departureSoC, currentSoC, tagCarLoading } = this.state;
    const style = computeStyleSheet();
    const currentSoCText = (currentSoC ?? '').toString(10);
    const departureSoCText = (departureSoC ?? '').toString(10);
    const settingsErrors = this.computeSettingsErrors();
    const showCurrentSoCInput = this.showCurrentSoCInput();
    return (
      <View style={style.socContainer}>
        <View style={style.socInputsContainer}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.settingLabel}>{I18n.t('transactions.stateOfCharge')}</Text>
          <HStack alignItems={'center'} flex={1} justifyContent={'space-between'}>
            {showCurrentSoCInput ? (
              <SocInput
                inputProps={{
                  onChangeText: (newCurrentSoC: string) => this.onSoCChanged(this.computeNumericSoC(newCurrentSoC), departureSoC),
                  value: currentSoCText
                }}
                leftText={I18n.t('general.from')}
                containerStyle={style.currentSocInputContainer}
              />
            ) : (
              <View style={{ flex: 1 }}/>
            )}
            <SocInput
              inputProps={{
                onChangeText: (newDepartureSoC: string) => this.onSoCChanged(this.state.currentSoC, this.computeNumericSoC(newDepartureSoC)),
                value: departureSoCText,
                editable: !tagCarLoading
              }}
              leftText={I18n.t('general.to')}
              containerStyle={{...(settingsErrors?.departureSoCError && style.socInputContainerError)}}
            />
          </HStack>
        </View>
        <MultiSlider
          customMarker={() => <View style={style.sliderMarker}/>}
          minMarkerOverlapStepDistance={1}
          isMarkersSeparated={!showCurrentSoCInput}
          customMarkerLeft={() => <></>}
          customMarkerRight={() => <View style={style.sliderMarker}/>}
          enabledOne={showCurrentSoCInput}
          enabledTwo={true}
          onValuesChange={([newCurrentSoC, newDepartureSoC]) => this.onSoCChanged(newCurrentSoC, newDepartureSoC)}
          markerOffsetY={scale(2)}
          sliderLength={Dimensions.get('window').width - scale(30)}
          trackStyle={style.sliderTrack}
          unselectedStyle={style.sliderLeftTrack}
          selectedStyle={style.sliderMiddleTrack}
          thirdStyle={style.sliderRightTrack}
          min={0}
          max={100}
          step={1}
          values={[!showCurrentSoCInput ? 0 : currentSoC, departureSoC]}
        />
      </View>
    );
  }

  private onSoCChanged(newCurrentSoC: number, newDepartureSoC: number): void {
    const { currentSoC } = this.state;
    // if currentSoC has changed for a non-null value
    if (newCurrentSoC !== currentSoC && newCurrentSoC) {
      newCurrentSoC = Math.min(newCurrentSoC, Math.max((newDepartureSoC ?? 0) - 1, 0));
    }
    this.setState({
      departureSoC: newDepartureSoC,
      currentSoC: newCurrentSoC,
    });
  }

  private computeNumericSoC(SoC: string): number {
    let SoCNumeric = parseInt(SoC, 10);
    // Avoid SoC > 100
    if (SoCNumeric > 100) {
      SoCNumeric = 100;
    }
    return SoCNumeric >= 0 ? SoCNumeric : null;
  }

  private renderAccordion(style: any) {
    const { showChargingSettings, settingsErrors } = this.state;
    return (
      <TouchableOpacity onPress={() => this.setState({ showChargingSettings: !showChargingSettings })} style={style.accordion}>
        <Text style={style.accordionText}>
          {I18n.t('transactions.chargingSettings')}
          {Object.values(settingsErrors ?? {}).some(error => error) && (
            <Text style={style.errorAsterisk}>*</Text>
          )}
        </Text>
        {showChargingSettings ? (
          <Icon size={scale(25)} margin={scale(5)} style={style.accordionIcon} as={MaterialIcons} name={'arrow-drop-up'} />
        ) : (
          <Icon size={scale(25)} margin={scale(5)} style={style.accordionIcon} as={MaterialIcons} name={'arrow-drop-down'} />
        )}
      </TouchableOpacity>
    );
  }

  private renderConnectorInfo(style: any) {
    return (
      <View style={style.connectorInfoContainer}>
        <ChargingStationConnectorComponent
          listed={false}
          chargingStation={this.state.chargingStation}
          connector={this.state.connector}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  private renderBillingErrorMessages(style: any) {
    const { selectedUser, sessionContext } = this.state;
    const { navigation } = this.props;
    const listItemCommonStyle = computeListItemCommonStyle();
    // Check the error code
    const errorCode = sessionContext?.errorCodes?.[0];
    switch (errorCode) {
      case StartTransactionErrorCode.BILLING_NO_PAYMENT_METHOD:
        return (
          <View style={[listItemCommonStyle.container, style.noItemContainer, style.noTagContainer]}>
            <Icon size={scale(50)} style={style.noPaymentMethodIcon} as={MaterialCommunityIcons} name={'credit-card-off'} />
            <View style={style.column}>
              <Text ellipsizeMode={'tail'} numberOfLines={2} style={style.errorMessage}>
                {I18n.t('transactions.noPaymentMethodError')}
              </Text>
              {selectedUser?.id === this.currentUser.id && (
                <TouchableOpacity onPress={() => navigation.navigate('AddPaymentMethod')}>
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

  private renderUserSelection(style: any) {
    const { navigation } = this.props;
    const { selectedUser, isAdmin, connector } = this.state;
    const settingsErrors = this.computeSettingsErrors();
    const disabled = connector?.status !== ChargePointStatus.PREPARING && connector?.status !== ChargePointStatus.AVAILABLE;
    const listItemCommonStyles = computeListItemCommonStyle();
    return (
      <View style={style.rowUserCarBadgeContainer}>
        {this.securityProvider?.canListUsers() && (
          <ModalSelect<User>
            disabled={disabled}
            openable={isAdmin}
            renderItem={(user) =>
              <UserComponent containerStyle={[user.status !== UserStatus.ACTIVE && listItemCommonStyles.outlinedError, style.itemComponentContainer]} user={selectedUser} navigation={navigation} />}
            defaultItems={[selectedUser]}
            onItemsSelected={this.onUserSelected.bind(this)}
            navigation={navigation}
            selectionMode={ItemSelectionMode.SINGLE}>
            <Users filters={{issuer: true}} navigation={navigation} />
          </ModalSelect>
        )}
        {settingsErrors.billingError && this.renderBillingErrorMessages(style)}
      </View>
    );
  }

  private renderCarSelection(style: any) {
    const { navigation } = this.props;
    const { sessionContextLoading, selectedUser, selectedCar, connector } = this.state;
    const disabled = connector?.status !== ChargePointStatus.PREPARING && connector?.status !== ChargePointStatus.AVAILABLE;
    return (
      <View style={style.rowUserCarBadgeContainer}>
        <ModalSelect<Car>
          disabled={disabled}
          openable={true}
          renderNoItem={this.renderNoCar.bind(this)}
          renderItem={(car) => <CarComponent car={car} navigation={navigation} />}
          ref={this.carModalRef}
          defaultItems={[selectedCar]}
          renderItemPlaceholder={this.renderCarPlaceholder.bind(this)}
          defaultItemLoading={sessionContextLoading}
          onItemsSelected={(selectedCars: Car[]) => this.setState({selectedCar: selectedCars?.[0]}, () => void this.loadUserSessionContext())}
          navigation={navigation}
          selectionMode={ItemSelectionMode.SINGLE}>
          <Cars userIDs={[selectedUser?.id as string]} navigation={navigation} />
        </ModalSelect>
      </View>
    );
  }

  private renderCarPlaceholder() {
    const listItemCommonStyle = computeListItemCommonStyle();
    const style = computeStyleSheet();
    return (
      <View style={[listItemCommonStyle.container, style.noItemContainer, style.noCarContainer]}>
        <Icon size={scale(50)} style={style.noCarIcon} as={MaterialCommunityIcons} name={'car'} />
        <View style={style.column}>
          <Text style={style.messageText}>{I18n.t('cars.noCarMessageTitle')}</Text>
        </View>
      </View>
    );
  }

  private renderNoCar() {
    const listItemCommonStyle = computeListItemCommonStyle();
    const style = computeStyleSheet();
    const { selectedUser } = this.state;
    const { navigation } = this.props;
    return (
      <View style={[listItemCommonStyle.container, style.noItemContainer, style.noCarContainer]}>
        <Icon size={scale(50)} style={style.noCarIcon} as={MaterialCommunityIcons} name={'car'} />
        <View style={style.column}>
          <Text style={style.messageText}>{I18n.t('cars.noCarMessageTitle')}</Text>
          {(this.currentUser?.id === selectedUser?.id || this.securityProvider.canListUsers()) && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCar', { params: { user: selectedUser } })}
              style={style.addItemContainer}>
              <Text style={[style.linkText, style.plusSign]}>+</Text>
              <Text style={[style.messageText, style.linkText, style.linkLabel]}>{I18n.t('cars.addCarTitle')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  private renderTagSelection(style: any) {
    const { navigation } = this.props;
    const { sessionContextLoading, selectedUser, selectedTag, connector } = this.state;
    const disabled = connector?.status !== ChargePointStatus.PREPARING && connector?.status !== ChargePointStatus.AVAILABLE;
    const listItemCommonStyles = computeListItemCommonStyle();
    return (
      <View style={style.rowUserCarBadgeContainer}>
        <ModalSelect<Tag>
          renderItem={(tag) => <TagComponent containerStyle={[!tag.active && listItemCommonStyles.outlinedError, style.itemComponentContainer]} tag={selectedTag} navigation={navigation} />}
          disabled={disabled}
          openable={true}
          renderNoItem={this.renderNoTag.bind(this)}
          itemsEquals={(a, b) => a?.visualID === b?.visualID}
          ref={this.tagModalRef}
          defaultItems={[selectedTag]}
          defaultItemLoading={sessionContextLoading}
          onItemsSelected={(selectedTags: Tag[]) => this.setState({ selectedTag: selectedTags?.[0] }, () => void this.loadUserSessionContext())}
          navigation={navigation}
          selectionMode={ItemSelectionMode.SINGLE}>
          <Tags disableInactive={true} sorting={'-active'} userIDs={[selectedUser?.id as string]} navigation={navigation} />
        </ModalSelect>
      </View>
    );
  }

  private renderNoTag() {
    const listItemCommonStyle = computeListItemCommonStyle();
    const style = computeStyleSheet();
    return (
      <View style={[listItemCommonStyle.container, style.noItemContainer, style.noTagContainer]}>
        <Icon size={scale(50)} as={MaterialCommunityIcons} name={'credit-card-off'} style={style.noTagIcon} />
        <View style={style.column}>
          <Text style={style.errorMessage}>{I18n.t('tags.noTagMessageTitle')}</Text>
          <Text style={style.errorMessage}>{I18n.t('tags.noTagMessageSubtitle')}</Text>
        </View>
      </View>
    );
  }

  private onUserSelected(selectedUsers: User[]): void {
    const selectedUser = selectedUsers?.[0];
    // Reset errors and selected fields when new user selected
    this.tagModalRef?.current?.resetInput();
    this.carModalRef?.current?.resetInput();
    this.setState(
      {
        selectedUser,
        selectedCar: null,
        selectedTag: null,
        sessionContext: null
      },
      () => {
        void this.loadUserSessionContext();
      }
    );
  }

  private async loadUserSessionContext(): Promise<void> {
    const { selectedUser, chargingStation, connector } = this.state;
    let { selectedCar, selectedTag }  = this.state;
    this.setState({sessionContextLoading: true}, async () => {
      const userSessionContext = await this.getUserSessionContext(
        selectedUser?.id as string,
        chargingStation?.id,
        connector?.connectorId,
        selectedCar?.id,
        selectedTag?.id
      );
      selectedCar = userSessionContext?.car ? {...userSessionContext.car, user: selectedUser} : null;
      selectedTag = userSessionContext?.tag;
      const defaultDepartureTime = userSessionContext?.smartChargingSessionParameters?.departureTime;
      this.setState({
        selectedCar,
        selectedTag,
        sessionContextLoading: false,
        sessionContext: userSessionContext,
        currentSoC: userSessionContext?.smartChargingSessionParameters?.carStateOfCharge,
        departureSoC: userSessionContext?.smartChargingSessionParameters?.targetStateOfCharge,
        departureTime: defaultDepartureTime && I18nManager.isValidDate(defaultDepartureTime) ? new Date(defaultDepartureTime) : null
      });
    });
  }

  private computeSettingsErrors(): SettingsErrors {
    const { selectedUser, selectedTag, departureSoC, currentSoC, sessionContext } = this.state;
    return {
      inactiveUserError: selectedUser?.status !== UserStatus.ACTIVE,
      inactiveBadgeError: !selectedTag?.active,
      noBadgeError: !selectedTag,
      billingError: !Utils.isEmptyArray(sessionContext?.errorCodes),
      // null <= 0 return true
      departureSoCError: !this.showCurrentSoCInput() ? departureSoC <= 0 : departureSoC <= currentSoC
    };
  }

  private showCurrentSoCInput(): boolean {
    return !!this.state.sessionContext?.smartChargingSessionParameters?.carStateOfCharge;
  }

  private renderStartTransactionDialog() {
    const chargingStationID = Utils.getParamFromNavigation(this.props.route, 'chargingStationID', null) as string;
    const modalCommonStyle = computeModalCommonStyle();
    return (
      <DialogModal
        title={I18n.t('details.startTransaction')}
        withCloseButton={true}
        close={() => this.setState({ showStartTransactionDialog: false })}
        renderIcon={(style) => <Icon style={style} size={scale(style.fontSize)} as={MaterialIcons} name={'play-circle-outline'} />}
        description={I18n.t('details.startTransactionMessage', { chargeBoxID: chargingStationID })}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () => this.setState({ showStartTransactionDialog: false }, async () => this.startTransaction()),
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            buttonStyle: modalCommonStyle.primaryButton
          },
          {
            text: I18n.t('general.no'),
            action: () => this.setState({ showStartTransactionDialog: false }),
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            buttonStyle: modalCommonStyle.primaryButton
          }
        ]}
      />
    );
  }

  private isButtonDisabled(): boolean {
    const { sessionContextLoading, transactionPending, connector } = this.state;
    return sessionContextLoading
        || Object.values(this.computeSettingsErrors()).some(error => error)
        || transactionPending
        || connector?.status === ChargePointStatus.FAULTED
        || connector?.status === ChargePointStatus.UNAVAILABLE;
  }

  private getMinimumDateMillisecs(): number {
    return new Date().getTime() + MIN_SESSION_DURATION_MILLISECS;
  }

  private async getUserSessionContext(userID: string, chargingStationID: string, connectorID: number, carID: string, tagID: string): Promise<UserSessionContext> {
    try {
      return this.centralServerProvider.getUserSessionContext(
        userID,
        chargingStationID,
        connectorID,
        carID,
        tagID
      );
    } catch (error) {
      await Utils.handleHttpUnexpectedError(
        this.centralServerProvider,
        error,
        null,
        this.props.navigation,
        this.refresh.bind(this)
      );
      return null;
    }
  }
}
