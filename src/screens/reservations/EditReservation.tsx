import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import { scale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import computeFormStyleSheet from '../../FormStyles';
import I18nManager from '../../I18n/I18nManager';
import CarComponent from '../../components/car/CarComponent';
import DateTimePickerComponent from '../../components/date-time/DateTimePickerComponent';
import HeaderComponent from '../../components/header/HeaderComponent';
import { ItemSelectionMode } from '../../components/list/ItemsList';
import ModalSelect from '../../components/modal/ModalSelect';
import TagComponent from '../../components/tag/TagComponent';
import UserComponent from '../../components/user/UserComponent';
import BaseScreen from '../../screens/base-screen/BaseScreen';
import Users from '../../screens/users/list/Users';
import { RestResponse } from '../../types/ActionResponse';
import BaseProps from '../../types/BaseProps';
import Car from '../../types/Car';
import ChargingStation, { ChargePointStatus, Connector } from '../../types/ChargingStation';
import Reservation, { ReservationType } from '../../types/Reservation';
import Tag from '../../types/Tag';
import { UserSessionContext } from '../../types/Transaction';
import User from '../../types/User';
import UserToken from '../../types/UserToken';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import computeStyleSheet from './AddReservationStyles';
import Tags from '../../screens/tags/Tags';
import Cars from '../../screens/cars/Cars';
import ReservableChargingStations from '../../screens/charging-stations/list/ReservableChargingStations';
import moment from 'moment';
import ReservableChargingStationComponent from '../../components/charging-station/ReservableChargingStationComponent';
import Constants from '../../utils/Constants';

interface State {
  reservation: Reservation;
  reservableChargingStations: ChargingStation[];
  selectedChargingStation: ChargingStation;
  selectedConnector: Connector;
  selectedUser: User;
  sessionContext: UserSessionContext;
  selectedTag: Tag;
  expiryDate: Date;
  fromDate: Date;
  toDate: Date;
  arrivalTime: Date;
  departureTime: Date;
  selectedParentTag?: Tag;
  selectedCar?: Car;
  reservationID: number;
  type: ReservationType;
  sessionContextLoading?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  isSiteAdmin?: boolean;
}

export interface Props extends BaseProps {}

export default class EditReservation extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private reservation: Reservation;
  private currentUser: UserToken;

  public constructor(props: Props) {
    super(props);
    this.state = {
      reservation: null,
      reservationID: null,
      reservableChargingStations: null,
      selectedChargingStation: null,
      selectedConnector: null,
      selectedUser: null,
      selectedTag: null,
      selectedCar: null,
      expiryDate: null,
      fromDate: null,
      toDate: null,
      arrivalTime: null,
      departureTime: null,
      type: null,
      refreshing: false,
      isAdmin: false,
      isSiteAdmin: false,
      sessionContext: null,
      sessionContextLoading: true
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    Orientation.lockToPortrait();
    this.currentUser = this.centralServerProvider.getUserInfo();
    this.reservation = Utils.getParamFromNavigation(this.props.route, 'reservation', null) as unknown as Reservation;
    const selectedConnector = Utils.getConnectorFromID(this.reservation.chargingStation, this.reservation.connectorID);
    this.setState(
      {
        reservation: this.reservation,
        reservationID: this.reservation.id,
        selectedChargingStation: this.reservation.chargingStation,
        selectedConnector,
        selectedUser: this.reservation.tag.user,
        selectedTag: this.reservation.tag,
        selectedCar: this.reservation.car,
        expiryDate: moment(this.reservation.expiryDate).toDate(),
        fromDate: moment(this.reservation.fromDate).toDate(),
        toDate: moment(this.reservation.toDate).toDate(),
        arrivalTime: moment(this.reservation.arrivalTime).toDate(),
        departureTime: moment(this.reservation.departureTime).toDate(),
        type: this.reservation.type
      },
      async () => await this.loadUserSessionContext()
    );
  }

  public componentWillUnmount(): void {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public render() {
    const { navigation } = this.props;
    const {
      selectedChargingStation,
      selectedConnector,
      selectedUser,
      selectedTag,
      selectedCar,
      type,
      expiryDate,
      fromDate,
      toDate,
      arrivalTime,
      departureTime,
      sessionContextLoading
    } = this.state;
    const commonColors = Utils.getCurrentCommonColor();
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    return (
      <SafeAreaView edges={['bottom']} style={style.container}>
        <HeaderComponent
          title={I18n.t('reservations.update.title')}
          navigation={navigation}
          backArrow={true}
          containerStyle={style.headerContainer}
        />
        <KeyboardAwareScrollView
          bounces={false}
          persistentScrollbar={true}
          contentContainerStyle={formStyle.scrollViewContentContainer}
          keyboardShouldPersistTaps={'handled'}
          style={formStyle.scrollView}>
          {type === ReservationType.RESERVE_NOW && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, formStyle.inputText, { paddingLeft: 0 }]}>
                {this.renderDatePicker(
                  'reservations.expiryDate',
                  'datetime',
                  (newExpiryDate: Date) => this.setState({ expiryDate: newExpiryDate, toDate: null, departureTime: null }),
                  expiryDate
                )}
              </View>
            </View>
          )}
          <View style={style.twoItemsContainer}>
            {type === ReservationType.PLANNED_RESERVATION && (
              <View style={[formStyle.inputContainer, { width: '45%' }]}>
                <View style={[formStyle.inputTextContainer, formStyle.inputText, { paddingLeft: 0 }]}>
                  {this.renderDatePicker(
                    'reservations.toDate',
                    'date',
                    (newToDate: Date) => this.setState({ toDate: newToDate }),
                    toDate,
                    fromDate
                  )}
                </View>
              </View>
            )}
            {type === ReservationType.PLANNED_RESERVATION && (
              <View style={[formStyle.inputContainer, { width: '45%' }]}>
                <View style={[formStyle.inputTextContainer, formStyle.inputText, { paddingLeft: 0 }]}>
                  {this.renderDatePicker(
                    'reservations.fromDate',
                    'date',
                    (newFromDate: Date) => this.setState({ fromDate: newFromDate }),
                    fromDate,
                    null,
                    toDate
                  )}
                </View>
              </View>
            )}
          </View>
          {type === ReservationType.PLANNED_RESERVATION && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, formStyle.inputText, { paddingLeft: 0 }]}>
                {this.renderDatePicker(
                  'reservations.arrivalTime',
                  'time',
                  (newArrivalTime: Date) => this.setState({ arrivalTime: newArrivalTime }),
                  arrivalTime
                )}
              </View>
            </View>
          )}
          {type === ReservationType.PLANNED_RESERVATION && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, formStyle.inputText, { paddingLeft: 0 }]}>
                {this.renderDatePicker(
                  'reservations.departureTime',
                  'time',
                  (newDepartureTime: Date) => this.setState({ departureTime: newDepartureTime }),
                  departureTime
                )}
              </View>
            </View>
          )}
          <View style={[formStyle.inputContainer]}>
            <View style={[formStyle.inputTextContainer, selectedChargingStation && { paddingLeft: 0 }]}>
              <ModalSelect<ChargingStation>
                openable={true}
                disabled={!(!!this.state.expiryDate || (!!this.state.fromDate && !!this.state.toDate))}
                defaultItems={[selectedChargingStation]}
                renderItemPlaceholder={() => this.renderChargingStationPlaceholder(style)}
                renderItem={(chargingStation: ChargingStation) => this.renderChargingStation(style, chargingStation)}
                onItemsSelected={(chargingStations: ChargingStation[]) => this.onChargingStationSelected(chargingStations?.[0])}
                navigation={navigation}
                selectionMode={ItemSelectionMode.SINGLE}>
                <ReservableChargingStations
                  filters={{
                    issuer: true,
                    WithSite: true,
                    WithSiteArea: true,
                    fromDate: this.state.fromDate ?? moment().toDate(),
                    toDate: this.state.toDate ?? this.state.expiryDate ?? moment().add(1, 'd').toDate()
                  }}
                  navigation={navigation}
                />
              </ModalSelect>
            </View>
          </View>
          <View style={[formStyle.inputContainer]}>
            <View style={[formStyle.inputTextContainer, formStyle.inputText]}>
              <SelectDropdown
                disabled={!selectedChargingStation}
                defaultValue={selectedConnector}
                statusBarTranslucent={true}
                defaultButtonText={I18n.t('reservations.connectorId')}
                data={selectedChargingStation?.connectors.filter((connector) => connector.status !== ChargePointStatus.UNAVAILABLE)}
                buttonTextAfterSelection={(connector: Connector) => this.buildChargingStationConnectorName(connector)}
                rowTextForSelection={(connector: Connector) => this.buildChargingStationConnectorName(connector)}
                buttonStyle={{ ...style.selectField, ...(!selectedConnector ? style.selectFieldDisabled : {}) }}
                buttonTextStyle={{ ...style.selectFieldText, ...(!selectedConnector ? style.selectFieldTextPlaceholder : {}) }}
                dropdownStyle={style.selectDropDown}
                rowStyle={style.selectDropDownRow}
                rowTextStyle={style.selectDropdownRowText}
                renderDropdownIcon={() => <Icon size={scale(25)} style={style.dropdownIcon} as={MaterialIcons} name={'arrow-drop-down'} />}
                onSelect={(connector: Connector) => this.setState({ selectedConnector: connector })}
              />
            </View>
          </View>
          {this.securityProvider?.canListUsers() && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, selectedUser && { paddingLeft: 0 }]}>
                <ModalSelect<User>
                  openable={true}
                  disabled={false}
                  defaultItems={[selectedUser]}
                  renderItem={(user: User) => this.renderUser(style, user)}
                  renderItemPlaceholder={() => this.renderUserPlaceholder(style)}
                  onItemsSelected={this.onUserSelected.bind(this)}
                  navigation={navigation}
                  selectionMode={ItemSelectionMode.SINGLE}>
                  <Users filters={{ issuer: true }} navigation={navigation} />
                </ModalSelect>
              </View>
            </View>
          )}
          {this.securityProvider?.canListTags() && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, selectedTag && { paddingLeft: 0 }]}>
                <ModalSelect<Tag>
                  openable={true}
                  disabled={false}
                  defaultItems={[selectedTag]}
                  renderItem={(tag: Tag) => this.renderTag(style, tag)}
                  renderItemPlaceholder={() => this.renderTagPlaceholder(style)}
                  onItemsSelected={(tags: Tag[]) => this.setState({ selectedTag: tags?.[0] }, () => void this.loadUserSessionContext())}
                  navigation={navigation}
                  defaultItemLoading={sessionContextLoading}
                  selectionMode={ItemSelectionMode.SINGLE}>
                  <Tags disableInactive={true} sorting={'-active'} userIDs={[selectedUser?.id as string]} navigation={navigation} />
                </ModalSelect>
              </View>
            </View>
          )}
          {this.securityProvider?.isComponentCarActive() && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, selectedCar && { paddingLeft: 0 }]}>
                <ModalSelect<Car>
                  openable={true}
                  disabled={false}
                  defaultItems={[selectedCar]}
                  renderItemPlaceholder={() => this.renderCarPlaceholder(style)}
                  renderItem={(car) => <CarComponent car={car} navigation={navigation} />}
                  onItemsSelected={(cars: Car[]) => this.setState({ selectedCar: cars?.[0] }, () => void this.loadUserSessionContext())}
                  defaultItemLoading={sessionContextLoading}
                  navigation={navigation}
                  selectionMode={ItemSelectionMode.SINGLE}>
                  <Cars userIDs={[selectedUser?.id as string]} navigation={navigation} />
                </ModalSelect>
              </View>
            </View>
          )}
          <View style={style.defaultContainer}>
            <Switch
              trackColor={{ true: commonColors.primary, false: commonColors.disabledDark }}
              thumbColor={commonColors.disabled}
              style={style.switch}
              onValueChange={() => this.onReservationTypeChange()}
              value={type === ReservationType.PLANNED_RESERVATION}
            />
            <Text style={style.text}>{I18n.t('reservations.types.planned_reservation')}</Text>
          </View>
          <Button
            title={I18n.t('reservations.update.title')}
            titleStyle={formStyle.buttonTitle}
            disabled={!this.checkForm()}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.buttonTextDisabled}
            containerStyle={formStyle.buttonContainer}
            buttonStyle={formStyle.button}
            loadingProps={{ color: commonColors.light }}
            onPress={() => void this.updateReservation()}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  public async updateReservation(): Promise<void> {
    if (this.checkForm()) {
      const {
        reservationID,
        selectedChargingStation,
        selectedConnector,
        selectedTag,
        selectedParentTag,
        selectedCar,
        selectedUser,
        expiryDate,
        fromDate,
        arrivalTime,
        departureTime,
        toDate,
        type
      } = this.state;
      try {
        const reservation: Reservation = {
          id: reservationID,
          chargingStationID: selectedChargingStation.id,
          connectorID: selectedConnector.connectorId,
          idTag: (selectedTag?.id as string) ?? null,
          visualTagID: selectedTag.visualID,
          fromDate: fromDate ?? new Date(),
          toDate: toDate ?? expiryDate,
          expiryDate: toDate ?? expiryDate,
          arrivalTime: arrivalTime ?? new Date(),
          departureTime: departureTime ?? expiryDate,
          carID: (selectedCar?.id as string) ?? null,
          parentIdTag: selectedParentTag?.visualID ?? null,
          userID: (selectedUser?.id as string) ?? null,
          type,
          createdBy: this.reservation.createdBy,
          createdOn: this.reservation.createdOn,
          lastChangedBy: { id: this.currentUser.id, name: this.currentUser.name, firstName: this.currentUser.firstName },
          lastChangedOn: new Date()
        };
        // Create Reservation
        const response = await this.centralServerProvider.updateReservation(reservation);
        if (response?.status === RestResponse.SUCCESS) {
          Message.showSuccess(
            I18n.t('reservations.update.success', {
              chargingStationID: reservation.chargingStationID,
              connectorID: Utils.getConnectorLetterFromConnectorID(reservation.connectorID)
            })
          );
          const routes = this.props.navigation.getState().routes;
          this.props.navigation.navigate(routes[Math.max(0, routes.length - 2)].name, { refresh: true });
          return;
        }
      } catch (error) {
        // Enable the button
        this.setState({ buttonDisabled: false });
        // Handle reservation return
        if (Utils.handleReservationResponses(error)) {
          return;
        }
        // Other common Error
        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'reservations.update.error', this.props.navigation);
      }
    }
  }

  public renderDatePicker(
    title: string,
    mode: 'date' | 'datetime' | 'time',
    onDateTimeChanged: (newDate: Date) => Promise<void> | void,
    date: Date,
    minDate: Date = new Date(),
    maxDate: Date = moment().add(Constants.TIME_RANGE_THRESHHOLD, 'h').toDate()
  ) {
    date = date ?? moment().add(1, 'h').toDate();
    const locale = this.currentUser?.locale;
    const is24Hour = mode === 'time' || mode === 'datetime' ? I18nManager?.isLocale24Hour(locale) : false;
    return (
      <DateTimePickerComponent
        title={title}
        mode={mode}
        locale={locale}
        is24Hour={is24Hour}
        lowerBound={minDate}
        upperBound={maxDate}
        initialValue={date}
        onDateTimeChanged={onDateTimeChanged}
      />
    );
  }

  public renderChargingStation(style: any, chargingStation: ChargingStation) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        defaultValue={null}
        renderCustomizedButtonChild={() => <ReservableChargingStationComponent chargingStation={chargingStation} navigation={null} />}
        buttonStyle={style.selectField}
        buttonTextStyle={style.selectFieldText}
        renderDropdownIcon={() => <Icon size={scale(25)} as={MaterialIcons} style={style.dropdownIcon} name={'arrow-drop-down'} />}
      />
    );
  }

  private checkForm(): boolean {
    const {
      selectedChargingStation,
      selectedConnector,
      selectedUser,
      selectedTag,
      expiryDate,
      fromDate,
      toDate,
      arrivalTime,
      departureTime,
      type
    } = this.state;
    let valid = false;
    if (type === ReservationType.RESERVE_NOW) {
      valid = !!selectedChargingStation && !!selectedConnector && !!selectedUser && !!selectedTag && this.checkDate(expiryDate) && !!type;
    } else {
      valid =
        !!selectedChargingStation &&
        !!selectedConnector &&
        !!selectedUser &&
        !!selectedTag &&
        this.checkDateRange(fromDate, toDate) &&
        this.checkDateRange(arrivalTime, departureTime) &&
        !!type;
    }
    return valid;
  }

  private renderUserPlaceholder(style: any) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        statusBarTranslucent={true}
        defaultButtonText={I18n.t('users.user')}
        defaultValue={null}
        buttonStyle={style.selectField}
        buttonTextStyle={{ ...style.selectFieldText, ...(!this.state.selectedUser ? style.selectFieldTextPlaceholder : {}) }}
        renderDropdownIcon={() => <Icon style={style.dropdownIcon} size={scale(25)} as={MaterialIcons} name={'arrow-drop-down'} />}
      />
    );
  }

  private renderUser(style: any, user: User) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        defaultValue={null}
        renderCustomizedButtonChild={() => <UserComponent user={user} navigation={null} />}
        buttonStyle={style.selectField}
        buttonTextStyle={style.selectFieldText}
        renderDropdownIcon={() => <Icon size={scale(25)} as={MaterialIcons} style={style.dropdownIcon} name={'arrow-drop-down'} />}
      />
    );
  }

  private renderTagPlaceholder(style: any) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        statusBarTranslucent={true}
        defaultButtonText={I18n.t('tags.tag')}
        defaultValue={null}
        buttonStyle={style.selectField}
        buttonTextStyle={{ ...style.selectFieldText, ...(!this.state.selectedTag ? style.selectFieldTextPlaceholder : {}) }}
        renderDropdownIcon={() => <Icon style={style.dropdownIcon} size={scale(25)} as={MaterialIcons} name={'arrow-drop-down'} />}
      />
    );
  }

  private renderTag(style: any, tag: Tag) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        defaultValue={null}
        renderCustomizedButtonChild={() => <TagComponent tag={tag} navigation={null} />}
        buttonStyle={style.selectField}
        buttonTextStyle={style.selectFieldText}
        renderDropdownIcon={() => <Icon size={scale(25)} as={MaterialIcons} style={style.dropdownIcon} name={'arrow-drop-down'} />}
      />
    );
  }

  private renderCarPlaceholder(style: any) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        statusBarTranslucent={true}
        defaultButtonText={I18n.t('cars.car')}
        defaultValue={null}
        buttonStyle={style.selectField}
        buttonTextStyle={{ ...style.selectFieldText, ...(!this.state.selectedCar ? style.selectFieldTextPlaceholder : {}) }}
        renderDropdownIcon={() => <Icon style={style.dropdownIcon} size={scale(25)} as={MaterialIcons} name={'arrow-drop-down'} />}
      />
    );
  }

  private renderChargingStationPlaceholder(style: any) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        statusBarTranslucent={true}
        defaultButtonText={I18n.t('chargers.charger')}
        defaultValue={null}
        buttonStyle={style.selectField}
        buttonTextStyle={{ ...style.selectFieldText, ...(!this.state.selectedChargingStation ? style.selectFieldTextPlaceholder : {}) }}
        renderDropdownIcon={() => <Icon style={style.dropdownIcon} size={scale(25)} as={MaterialIcons} name={'arrow-drop-down'} />}
      />
    );
  }

  private onChargingStationSelected(selectedChargingStation: ChargingStation) {
    this.setState({ selectedChargingStation });
    this.loadChargingStationConnector(selectedChargingStation);
  }

  private loadChargingStationConnector(selectedChargingStation: ChargingStation) {
    let connector: Connector = null;
    if (selectedChargingStation.connectors.length === 1 && selectedChargingStation.connectors[0].status === ChargePointStatus.AVAILABLE) {
      connector = selectedChargingStation.connectors[0];
    }
    this.setState({
      selectedConnector: connector
    });
  }

  private async loadUserSessionContext(): Promise<void> {
    const { selectedUser, selectedChargingStation, selectedConnector } = this.state;
    let { selectedCar, selectedTag } = this.state;
    if (!selectedChargingStation || !selectedConnector) {
      this.setState({
        sessionContextLoading: false
      });
      return;
    }
    this.setState({ sessionContextLoading: true }, async () => {
      const userSessionContext = await this.getUserSessionContext(
        selectedUser?.id as string,
        selectedChargingStation?.id,
        selectedConnector?.connectorId,
        selectedCar?.id,
        selectedTag?.id
      );
      selectedCar = userSessionContext?.car ? { ...userSessionContext.car, user: selectedUser } : null;
      selectedTag = userSessionContext?.tag;
      this.setState({
        selectedCar,
        selectedTag,
        sessionContextLoading: false
      });
    });
  }

  private async getUserSessionContext(
    userID: string,
    chargingStationID: string,
    connectorID: number,
    carID: string,
    tagID: string
  ): Promise<UserSessionContext> {
    try {
      return await this.centralServerProvider.getUserSessionContext(userID, chargingStationID, connectorID, carID, tagID);
    } catch (error) {
      await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, null, this.props.navigation);
      return null;
    }
  }

  private onUserSelected(selectedUsers: User[]): void {
    const selectedUser = selectedUsers?.[0];
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

  private buildChargingStationConnectorName(connector: Connector): string {
    let connectorName = '';
    if (!connector) {
      return '-';
    }
    connectorName += `${I18n.t('reservations.connectorId')} ${Utils.getConnectorLetterFromConnectorID(connector.connectorId)}`;
    if (connector?.type && connector?.status) {
      connectorName += ` - ${Utils.translateConnectorType(connector?.type)}`;
    }
    if (connector?.amperage > 0) {
      connectorName += ` - ${connector.amperage} A`;
    }
    return connectorName;
  }

  private checkDate(date: Date): boolean {
    const parsedDate = moment(date);
    return !date || parsedDate.isValid();
  }

  private checkDateRange(minDate: Date, maxDate: Date) {
    let valid = false;
    const parsedMinDate = moment(minDate);
    const parsedMaxDate = moment(maxDate);
    if (parsedMinDate.isValid() || parsedMaxDate.isValid()) {
      valid = true;
    }
    if (parsedMinDate.isAfter(parsedMaxDate) || parsedMaxDate.isBefore(parsedMinDate)) {
      valid = false;
    }
    return valid;
  }

  private onReservationTypeChange() {
    let { type, expiryDate, fromDate, toDate, arrivalTime, departureTime } = this.state;
    switch (type) {
      case ReservationType.RESERVE_NOW:
        type = ReservationType.PLANNED_RESERVATION;
        expiryDate = null;
        break;
      case ReservationType.PLANNED_RESERVATION:
        type = ReservationType.RESERVE_NOW;
        fromDate = null;
        toDate = null;
        arrivalTime = null;
        departureTime = null;
    }
    this.setState({
      type,
      expiryDate,
      fromDate,
      toDate,
      arrivalTime,
      departureTime
    });
  }
}
