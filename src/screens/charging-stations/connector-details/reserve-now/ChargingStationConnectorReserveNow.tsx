import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaView } from 'react-native-safe-area-context';
import SelectDropdown from 'react-native-select-dropdown';
import { scale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import computeFormStyleSheet from '../../../../FormStyles';
import I18nManager from '../../../../I18n/I18nManager';
import CarComponent from '../../../../components/car/CarComponent';
import DateTimePickerComponent from '../../../../components/date-time/DateTimePickerComponent';
import HeaderComponent from '../../../../components/header/HeaderComponent';
import { ItemSelectionMode } from '../../../../components/list/ItemsList';
import computeListItemCommonStyle from '../../../../components/list/ListItemCommonStyle';
import ModalSelect from '../../../../components/modal/ModalSelect';
import TagComponent from '../../../../components/tag/TagComponent';
import UserComponent from '../../../../components/user/UserComponent';
import BaseScreen from '../../../../screens/base-screen/BaseScreen';
import Cars from '../../../../screens/cars/Cars';
import Tags from '../../../../screens/tags/Tags';
import Users from '../../../../screens/users/list/Users';
import { RestResponse } from '../../../../types/ActionResponse';
import BaseProps from '../../../../types/BaseProps';
import Car from '../../../../types/Car';
import ChargingStation, { Connector } from '../../../../types/ChargingStation';
import Tag from '../../../../types/Tag';
import { UserSessionContext } from '../../../../types/Transaction';
import User, { UserStatus } from '../../../../types/User';
import Message from '../../../../utils/Message';
import Utils from '../../../../utils/Utils';
import computeStyleSheet from './ChargingStationConnectorReserveNowStyles';
import moment from 'moment';
import Constants from '../../../../utils/Constants';

interface State {
  selectedChargingStation: ChargingStation;
  selectedConnector: Connector;
  selectedUser: User;
  sessionContext: UserSessionContext;
  selectedTag: Tag;
  expiryDate: Date;
  selectedParentTag?: Tag;
  selectedCar?: Car;
  sessionContextLoading?: boolean;
  refreshing?: boolean;
  isAdmin?: boolean;
  isSiteAdmin?: boolean;
}

export interface Props extends BaseProps {}

export default class ReserveNow extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private user: User;
  private currentUser: User;
  private tag: Tag;
  private chargingStation: ChargingStation;
  private connector: Connector;
  private expiryDate: Date;

  public constructor(props: Props) {
    super(props);
    this.state = {
      selectedChargingStation: null,
      selectedConnector: null,
      selectedUser: null,
      selectedTag: null,
      expiryDate: null,
      selectedParentTag: null,
      selectedCar: null,
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
    const currentUserToken = this.centralServerProvider.getUserInfo();
    this.currentUser = Utils.getParamFromNavigation(this.props.route, 'user', null) as unknown as User;
    this.tag = Utils.getParamFromNavigation(this.props.route, 'tag', null) as unknown as Tag;
    this.chargingStation = Utils.getParamFromNavigation(this.props.route, 'chargingStation', null) as unknown as ChargingStation;
    this.connector = Utils.getParamFromNavigation(this.props.route, 'connector', null) as unknown as Connector;
    this.expiryDate = moment().add(1, 'h').toDate();
    const currentUser = {
      id: currentUserToken?.id,
      firstName: currentUserToken?.firstName,
      name: currentUserToken?.name,
      status: UserStatus.ACTIVE,
      role: currentUserToken.role,
      email: currentUserToken.email
    } as User;
    this.setState(
      {
        selectedUser: this.user ?? currentUser,
        selectedTag: this.tag ?? this.state.selectedTag,
        selectedChargingStation: this.chargingStation,
        selectedConnector: this.connector,
        expiryDate: this.expiryDate
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
    const { sessionContextLoading, selectedUser, selectedTag, selectedCar, expiryDate } = this.state;
    const commonColors = Utils.getCurrentCommonColor();
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    return (
      <SafeAreaView edges={['bottom']} style={style.container}>
        <HeaderComponent
          title={I18n.t('reservations.reserve_now.title')}
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
          {this.state.selectedUser && (
            <View style={[formStyle.inputContainer]}>
              <View style={[formStyle.inputTextContainer, formStyle.inputText, { paddingLeft: 0 }]}>
                {this.renderExpiryDatePicker(
                  'reservations.expiryDate',
                  'datetime',
                  (newExpiryDate: Date) => this.setState({ expiryDate: newExpiryDate }),
                  expiryDate
                )}
              </View>
            </View>
          )}
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
          <Button
            title={I18n.t('reservations.reserve_now.tooltips')}
            titleStyle={formStyle.buttonTitle}
            disabled={!this.checkForm()}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.buttonTextDisabled}
            containerStyle={formStyle.buttonContainer}
            buttonStyle={formStyle.button}
            loadingProps={{ color: commonColors.light }}
            onPress={() => void this.reserveNow()}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  public async reserveNow(): Promise<void> {
    if (this.checkForm()) {
      const { selectedChargingStation, selectedConnector, selectedTag, selectedParentTag, selectedCar, expiryDate } = this.state;
      const connectorLetter = Utils.getConnectorLetterFromConnectorID(selectedConnector.connectorId);
      try {
        // Reserve the connector
        const response = await this.centralServerProvider.reserveNow(
          selectedChargingStation.id,
          selectedConnector.connectorId,
          expiryDate,
          selectedTag?.visualID,
          null,
          selectedCar?.id as string,
          selectedParentTag?.visualID
        );
        if (response?.status === RestResponse.SUCCESS) {
          Message.showSuccess(
            I18n.t('reservations.reserve_now.success', { chargingStationID: selectedChargingStation.id, connectorID: connectorLetter })
          );
          const routes = this.props.navigation.getState().routes;
          this.props.navigation.navigate(routes[Math.max(0, routes.length - 2)].name, { refresh: true });
          return;
        } else {
          // Show message
          Message.showError(I18n.t('reservations.reserve_now.error'));
        }
      } catch (error) {
        // Enable the button
        this.setState({ buttonDisabled: false });
        // Other common Error
        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'reservations.reserve_now.error', this.props.navigation);
      }
    }
  }

  public renderExpiryDatePicker(
    title: string,
    mode: 'date' | 'datetime' | 'time',
    onDateTimeChanged: (newDate: Date) => Promise<void> | void,
    date: Date,
    minDate: Date = new Date(),
    maxDate: Date = moment().add(Constants.EXPIRY_DATE_THRESHHOLD, 'h').toDate()
  ) {
    date = date ?? moment().add(1, 'h').toDate();
    const locale = this.centralServerProvider.getUserInfo()?.locale;
    const is24Hour = I18nManager?.isLocale24Hour(locale);
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

  private checkForm(): boolean {
    const { selectedChargingStation, selectedConnector, selectedUser, selectedTag, selectedParentTag, expiryDate } = this.state;
    return !!selectedChargingStation && !!selectedConnector && !!selectedUser && !!selectedTag && this.checkDate(expiryDate);
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

  private renderCarPlaceholder(style: any) {
    const listItemCommonStyle = computeListItemCommonStyle();
    return (
      <View style={[listItemCommonStyle.container, style.noItemContainer, style.noCarContainer]}>
        <Icon size={scale(50)} style={style.noCarIcon} as={MaterialCommunityIcons} name={'car'} />
        <View style={style.column}>
          <Text style={style.messageText}>{I18n.t('cars.noCarMessageTitle')}</Text>
        </View>
      </View>
    );
  }

  private renderNoCar(style: any) {
    const listItemCommonStyle = computeListItemCommonStyle();
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

  private renderNoTag(style: any) {
    const listItemCommonStyle = computeListItemCommonStyle();
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

  private async loadUserSessionContext(): Promise<void> {
    const { selectedUser, selectedChargingStation, selectedConnector } = this.state;
    let { selectedCar, selectedTag } = this.state;
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
        sessionContextLoading: false,
        sessionContext: userSessionContext
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
    // Reset errors and selected fields when new user selected
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

  private checkDate(date: Date): boolean {
    const parsedDate = moment(date);
    return date && parsedDate.isValid();
  }
}
