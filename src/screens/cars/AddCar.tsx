import React from 'react';
import {Keyboard, Text, TextInput, View} from 'react-native';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './AddCarStyle';
import computeFormStyleSheet from '../../FormStyles';
import ModalSelect from '../../components/modal/ModalSelect';
import Car, {CarCatalog, CarConverter, CarConverterType, CarType} from '../../types/Car';
import {ItemSelectionMode} from '../../components/list/ItemsList';
import {Icon} from 'native-base';
import {Button, CheckBox, Input, Switch} from 'react-native-elements';
import Utils from '../../utils/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import CarCatalogComponent from '../../components/car/CarCatalogComponent';
import CarCatalogs from './CarCatalogs';
import User, {UserStatus} from '../../types/User';
import UserComponent from '../../components/user/UserComponent';
import Users from '../users/list/Users';
import Orientation from 'react-native-orientation-locker';
import Message from '../../utils/Message';
import {HTTPError} from '../../types/HTTPError';
import I18n from 'i18n-js';
import Constants from '../../utils/Constants';
import {RestResponse} from '../../types/ActionResponse';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {scale} from 'react-native-size-matters';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface State {
  selectedCarCatalog: CarCatalog;
  selectedCarCatalogConverters: CarConverter[];
  selectedConverter: CarConverter;
  vin: string;
  licensePlate: string;
  selectedUser: User;
  isDefault: boolean;
  type: CarType;
  addCarPending: boolean;
}

export interface Props extends BaseProps {}

export default class AddCar extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  private user: User;
  private licensePlateInput: TextInput;

  public constructor(props: Props) {
    super(props);
    this.state = {
      selectedCarCatalog: null,
      selectedCarCatalogConverters: [],
      selectedConverter: null,
      vin: null,
      licensePlate: null,
      selectedUser: null,
      isDefault: false,
      type: CarType.COMPANY,
      addCarPending: false
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    Orientation.lockToPortrait();
    const currentUserToken = this.centralServerProvider.getUserInfo();
    this.user = Utils.getParamFromNavigation(this.props.route, 'user', null) as unknown as User;
    const currentUser = {
      id: currentUserToken?.id,
      firstName: currentUserToken?.firstName,
      name: currentUserToken?.name,
      status: UserStatus.ACTIVE,
      role: currentUserToken.role,
      email: currentUserToken.email
    } as User;
    this.setState({
      selectedUser: this.user ?? currentUser
    });
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public render() {
    const { navigation } = this.props;
    const {
      selectedCarCatalog,
      selectedConverter,
      selectedCarCatalogConverters,
      selectedUser,
      vin,
      licensePlate,
      isDefault,
      type,
      addCarPending
    } = this.state;
    const commonColors = Utils.getCurrentCommonColor();
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    return (
      <SafeAreaView edges={['bottom']} style={style.container}>
        <HeaderComponent
          title={I18n.t('cars.addCarTitle')}
          navigation={navigation}
          backArrow={true}
          containerStyle={style.headerContainer}
        />
        <KeyboardAwareScrollView bounces={false} persistentScrollbar={true} contentContainerStyle={formStyle.scrollViewContentContainer} keyboardShouldPersistTaps={'handled'} style={formStyle.scrollView}>
          <Input
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, selectedCarCatalog && {paddingLeft: 0}]}
            labelStyle={style.inputLabel}
            renderErrorMessage={false}
            InputComponent={() => (
              <ModalSelect<CarCatalog>
                openable={true}
                defaultItems={[selectedCarCatalog]}
                renderItem={(carCatalog: CarCatalog) => this.renderCarCatalog(style, carCatalog)}
                renderItemPlaceholder={() => this.renderCarCatalogPlaceholder(style)}
                onItemsSelected={(selectedCarCatalogs: CarCatalog[]) => this.onCarCatalogSelected(selectedCarCatalogs?.[0])}
                navigation={navigation}
                selectionMode={ItemSelectionMode.SINGLE}>
                <CarCatalogs navigation={navigation} />
              </ModalSelect>
            )}
          />
          <Input
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={formStyle.inputTextContainer}
            labelStyle={[style.inputLabel, !selectedCarCatalog && style.disabledInputLabel]}
            renderErrorMessage={false}
            InputComponent={() => (
              <SelectDropdown
                disabled={!selectedCarCatalog}
                defaultValue={selectedConverter}
                statusBarTranslucent={true}
                defaultButtonText={I18n.t('cars.converter')}
                data={selectedCarCatalogConverters}
                buttonTextAfterSelection={(carConverter: CarConverter) => Utils.buildCarCatalogConverterName(carConverter)}
                rowTextForSelection={(carConverter: CarConverter) => Utils.buildCarCatalogConverterName(carConverter)}
                buttonStyle={{...style.selectField, ...(!selectedCarCatalog ? style.selectFieldDisabled : {})}}
                buttonTextStyle={{...style.selectFieldText, ...(!selectedConverter ? style.selectFieldTextPlaceholder : {})}}
                dropdownStyle={style.selectDropdown}
                rowStyle={style.selectDropdownRow}
                rowTextStyle={style.selectDropdownRowText}
                renderDropdownIcon={() => <Icon size={scale(25)} style={style.dropdownIcon} as={MaterialIcons} name={'arrow-drop-down'} />}
                onSelect={(carConverter: CarConverter) => this.setState({ selectedConverter: carConverter })}
              />
            )}
          />
          <Input
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, !this.checkVIN() && formStyle.inputTextContainerError]}
            placeholder={Constants.VIN_FULL}
            placeholderTextColor={commonColors.disabledDark}
            labelStyle={style.inputLabel}
            autoCapitalize={'characters'}
            autoCorrect={false}
            renderErrorMessage={!this.checkVIN()}
            errorMessage={!this.checkVIN() ? vin && I18n.t('cars.invalidVIN'): null}
            errorStyle={formStyle.inputError}
            returnKeyType={'next'}
            onSubmitEditing={() => this.licensePlateInput?.focus()}
            onChangeText={(newVin: string) => this.setState({ vin: newVin })}
          />
          <Input
            ref={(ref) => this.licensePlateInput = ref}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, !this.checkLicensePlate() && formStyle.inputTextContainerError]}
            placeholder={I18n.t('cars.licensePlate')}
            placeholderTextColor={commonColors.disabledDark}
            labelStyle={style.inputLabel}
            autoCapitalize={'characters'}
            autoCorrect={false}
            renderErrorMessage={!this.checkLicensePlate()}
            errorMessage={!this.checkLicensePlate() ? licensePlate && I18n.t('cars.invalidLicensePlate') : null}
            errorStyle={style.inputError}
            returnKeyType={'done'}
            onSubmitEditing={() => Keyboard.dismiss()}
            onChangeText={(newLicensePlate: string) => this.setState({ licensePlate: newLicensePlate })}
          />
          {this.securityProvider?.canListUsers() && (
            <Input
              containerStyle={formStyle.inputContainer}
              inputStyle={formStyle.inputText}
              inputContainerStyle={[formStyle.inputTextContainer, selectedUser && {paddingLeft: 0}]}
              labelStyle={style.inputLabel}
              renderErrorMessage={false}
              InputComponent={() => (
                <ModalSelect<User>
                  openable={true}
                  disabled={false}
                  defaultItems={[selectedUser]}
                  renderItem={(user: User) => this.renderUser(style, user)}
                  onItemsSelected={(users: User[]) => this.setState({ selectedUser: users?.[0] })}
                  navigation={navigation}
                  selectionMode={ItemSelectionMode.SINGLE}>
                  <Users navigation={navigation} />
                </ModalSelect>
              )}
            />
          )}
          <View style={style.defaultContainer}>
            <Switch
              trackColor={{ true: commonColors.primary, false: commonColors.disabledDark }}
              thumbColor={commonColors.disabled}
              style={style.switch}
              onValueChange={() => this.setState({ isDefault: !this.state.isDefault })}
              value={isDefault}
            />
            <Text style={style.text}>{I18n.t('cars.defaultCar')}</Text>
          </View>
          <View style={style.carTypeContainer}>
            <CheckBox
              containerStyle={formStyle.checkboxContainer}
              textStyle={formStyle.checkboxText}
              checked={type === CarType.COMPANY}
              checkedIcon={<Icon size={scale(25)} color={commonColors.textColor} name="radiobox-marked" as={MaterialCommunityIcons}/>}
              uncheckedIcon={<Icon size={scale(25)} color={commonColors.textColor} name="radiobox-blank" as={MaterialCommunityIcons} />}
              onPress={() => this.setState({ type: CarType.COMPANY })}
              title={I18n.t('carTypes.companyCar')}
            />
            <CheckBox
              containerStyle={formStyle.checkboxContainer}
              textStyle={formStyle.checkboxText}
              checked={type === CarType.POOL_CAR}
              checkedIcon={<Icon size={scale(25)} color={commonColors.textColor} name="radiobox-marked" as={MaterialCommunityIcons}/>}
              uncheckedIcon={<Icon size={scale(25)} color={commonColors.textColor} name="radiobox-blank" as={MaterialCommunityIcons} />}
              onPress={() => this.setState({ type: CarType.POOL_CAR })}
              title={I18n.t('carTypes.poolCar')}
            />
            <CheckBox
              containerStyle={formStyle.checkboxContainer}
              textStyle={formStyle.checkboxText}
              checked={type === CarType.PRIVATE}
              checkedIcon={<Icon size={scale(25)} color={commonColors.textColor} name="radiobox-marked" as={MaterialCommunityIcons}/>}
              uncheckedIcon={<Icon size={scale(25)} color={commonColors.textColor} name="radiobox-blank" as={MaterialCommunityIcons} />}
              onPress={() => this.setState({ type: CarType.PRIVATE })}
              title={I18n.t('carTypes.privateCar')}
            />
          </View>
          <Button
            title={I18n.t('cars.addCarButton')}
            titleStyle={formStyle.buttonTitle}
            disabled={!this.checkForm()}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.buttonTextDisabled}
            containerStyle={formStyle.buttonContainer}
            buttonStyle={formStyle.button}
            loading={addCarPending}
            loadingProps={{color: commonColors.light}}
            onPress={() => void this.addCar()}
          />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  private checkVIN(): boolean {
    const { vin } = this.state;
    const vinPattern = new RegExp('^[A-Z\\d]{17}$');
    return !vin || vinPattern.test(vin);
  }

  private checkLicensePlate(): boolean {
    const { licensePlate } = this.state;
    const licensePlatePattern = new RegExp('^[A-Z0-9- ]*$');
    return !licensePlate || licensePlatePattern.test(licensePlate);
  }

  private checkForm(): boolean {
    const { selectedCarCatalog, selectedConverter, selectedUser, type, vin, licensePlate } = this.state;
    return this.checkVIN() && this.checkLicensePlate() && !!selectedCarCatalog && !!selectedConverter && !!selectedUser && !!type && !!vin && !!licensePlate;
  }

  private onCarCatalogSelected(selectedCarCatalog: CarCatalog) {
    this.setState({ selectedCarCatalog });
    this.loadCarCatalogConverters(selectedCarCatalog);
  }

  private loadCarCatalogConverters(selectedCarCatalog: CarCatalog) {
    const selectedCarCatalogConverters = this.buildCarCatalogConverter(selectedCarCatalog);
    this.setState({
      selectedCarCatalogConverters,
      selectedConverter: selectedCarCatalogConverters.length === 1 ? selectedCarCatalogConverters?.[0] : null
    });
  }

  private buildCarCatalogConverter(carCatalog: CarCatalog): CarConverter[] {
    const selectedCarCatalogConverters: CarConverter[] = [];
    if (carCatalog) {
      const standardConverter: CarConverter = {
        type: CarConverterType.STANDARD,
        powerWatts: carCatalog.chargeStandardPower,
        amperagePerPhase: carCatalog.chargeStandardPhaseAmp,
        numberOfPhases: carCatalog.chargeStandardPhase
      };
      const alternativeConverter: CarConverter = {
        type: CarConverterType.ALTERNATIVE,
        powerWatts: carCatalog.chargeAlternativePower,
        amperagePerPhase: carCatalog.chargeAlternativePhaseAmp,
        numberOfPhases: carCatalog.chargeAlternativePhase
      };
      const optionalConverter: CarConverter = {
        type: CarConverterType.OPTION,
        powerWatts: carCatalog.chargeOptionPower,
        amperagePerPhase: carCatalog.chargeOptionPhaseAmp,
        numberOfPhases: carCatalog.chargeOptionPhase
      };
      selectedCarCatalogConverters.push(standardConverter);
      if (carCatalog.chargeAlternativePower) {
        selectedCarCatalogConverters.push(alternativeConverter);
      }
      if (carCatalog.chargeOptionPower > 0 && carCatalog.chargeOptionPower !== carCatalog.chargeAlternativePower) {
        selectedCarCatalogConverters.push(optionalConverter);
      }
    }
    return selectedCarCatalogConverters;
  }

  private  renderCarCatalogPlaceholder(style: any) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        statusBarTranslucent={true}
        defaultButtonText={I18n.t('cars.model')}
        defaultValue={null}
        buttonStyle={style.selectField}
        buttonTextStyle={{...style.selectFieldText, ...(!this.state.selectedCarCatalog ? style.selectFieldTextPlaceholder : {})}}
        renderDropdownIcon={() => <Icon style={style.dropdownIcon} size={scale(25)} as={MaterialIcons} name={'arrow-drop-down'} />}
      />
    );
  }

  private renderCarCatalog(style: any, carCatalog: CarCatalog) {
    return (
      <SelectDropdown
        disabled={true}
        data={[]}
        statusBarTranslucent={true}
        defaultValue={null}
        renderCustomizedButtonChild={() => <CarCatalogComponent  carCatalog={carCatalog} navigation={null} />}
        buttonStyle={style.selectField}
        buttonTextStyle={style.selectFieldText}
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

  private async addCar(forced: boolean = false): Promise<void> {
    if (this.checkForm()) {
      this.setState({ addCarPending: true });
      const { selectedConverter, selectedCarCatalog, selectedUser, vin, licensePlate, isDefault, type } = this.state;
      const car = {
        vin,
        licensePlate,
        carCatalogID: selectedCarCatalog?.id,
        converter: selectedConverter,
        type,
        userID: selectedUser?.id,
        default: isDefault,
        forced
      } as Car;
      try {
        const response = await this.centralServerProvider.createCar(car, forced);
        if (response?.status === RestResponse.SUCCESS) {
          Message.showSuccess(I18n.t('cars.addCarSuccessfully'));
          const routes = this.props.navigation.getState().routes;
          this.props.navigation.navigate(routes[Math.max(0, routes.length-2)].name, {refresh: true});
          return;
        } else {
          Message.showError(I18n.t('cars.addError'));
          return;
        }
      } catch (error) {
        switch (error?.response?.status) {
          case HTTPError.CAR_ALREADY_EXIST_ERROR:
            Message.showError(I18n.t('cars.carAlreadyExistError'));
            break;
          case HTTPError.USER_ALREADY_ASSIGNED_TO_CAR:
            Message.showError(I18n.t('cars.userAlreadyAssignedError'));
            break;
          default:
            Message.showError(I18n.t('cars.addError'));
        }
      } finally {
        this.setState({ addCarPending: false });
      }
    }
    return null;
  }
}
