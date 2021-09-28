import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import { DrawerActions } from '@react-navigation/native';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './AddCarStyle';
import ModalSelect from '../../components/modal/ModalSelect';
import { CarCatalog, CarConverter, CarConverterType, CarDTO, CarType } from '../../types/Car';
import { ItemSelectionMode } from '../../components/list/ItemsList';
import computeListItemCommonStyle from '../../components/list/ListItemCommonStyle';
import { CheckBox, Icon } from 'native-base';
import { Button, Input } from 'react-native-elements';
import Utils from '../../utils/Utils';
import SelectDropdown from 'react-native-select-dropdown';
import CarCatalogComponent from '../../components/car/CarCatalogComponent';
import CarCatalogs from './CarCatalogs';
import User, { UserStatus } from '../../types/User';
import UserComponent from '../../components/user/UserComponent';
import Users from '../users/list/Users';
import computeModalCommonStyle from '../../components/modal/ModalCommonStyle';
import Orientation from 'react-native-orientation-locker';
import { RestResponse } from '../../types/Server';
import Message from '../../utils/Message';
import { HTTPError } from '../../types/HTTPError';
import I18n from 'i18n-js';
import computeFormStyleSheet from '../../FormStyles';
import { RadioButton } from 'react-native-paper';
import Constants from '../../utils/Constants';

interface State {
  selectedCarCatalog: CarCatalog;
  selectedCarCatalogConverters: CarConverter[];
  selectedConverter: CarConverter;
  vin: string;
  licensePlate: string;
  selectedUser: User;
  isDefault: boolean;
  type: CarType;
}

export interface Props extends BaseProps {}

export default class AddCar extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

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
      type: CarType.COMPANY
    };
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    Orientation.lockToPortrait();
    const currentUser = this.centralServerProvider.getUserInfo();
    this.setState({
      selectedUser: {
        id: currentUser?.id,
        firstName: currentUser?.firstName,
        name: currentUser?.name,
        status: UserStatus.ACTIVE,
        role: currentUser.role,
        email: currentUser.email
      }
    });
  }

  public componentWillUnmount() {
    super.componentWillUnmount();
    Orientation.unlockAllOrientations();
  }

  public onBack(): boolean {
    this.props.navigation.goBack();
    return true;
  }

  public render() {
    const { navigation } = this.props;
    const { selectedCarCatalog, selectedConverter, selectedCarCatalogConverters, selectedUser, vin, licensePlate, isDefault, type } =
      this.state;
    const commonColors = Utils.getCurrentCommonColor();
    const modalCommonStyles = computeModalCommonStyle();
    const formStyles = computeFormStyleSheet();
    const style = computeStyleSheet();
    return (
      <View style={style.container}>
        <HeaderComponent
          title={I18n.t('cars.addCar')}
          navigation={navigation}
          leftAction={this.onBack.bind(this)}
          leftActionIcon={'navigate-before'}
          rightAction={() => {
            navigation.dispatch(DrawerActions.openDrawer());
            return true;
          }}
          rightActionIcon={'menu'}
        />
        <ScrollView style={style.scrollview} contentContainerStyle={style.content}>
          <ModalSelect<CarCatalog>
            openable={true}
            renderItem={(carCatalog: CarCatalog) => <CarCatalogComponent shadowed={true} carCatalog={carCatalog} navigation={navigation} />}
            renderItemPlaceholder={() => this.renderCarCatalogPlaceholder(style)}
            onItemsSelected={(selectedCarCatalogs: CarCatalog[]) => this.onCarCatalogSelected(selectedCarCatalogs?.[0])}
            navigation={navigation}
            selectionMode={ItemSelectionMode.SINGLE}>
            <CarCatalogs navigation={navigation} />
          </ModalSelect>
          <Input
            disabled={true}
            InputComponent={() => (
              <SelectDropdown
                disabled={!selectedCarCatalog}
                defaultValue={selectedConverter}
                defaultButtonText={`${I18n.t('cars.converter')}*`}
                data={selectedCarCatalogConverters}
                buttonTextAfterSelection={(carConverter: CarConverter) => Utils.buildCarCatalogConverterName(carConverter)}
                rowTextForSelection={(carConverter: CarConverter) => Utils.buildCarCatalogConverterName(carConverter)}
                buttonStyle={[style.selectField, !selectedCarCatalog && style.selectFieldDisabled]}
                buttonTextStyle={style.selectFieldText}
                dropdownStyle={style.selectDropdown}
                rowStyle={style.selectDropdownRow}
                rowTextStyle={style.selectDropdownRowText}
                renderDropdownIcon={() => <Icon type={'MaterialIcons'} name={'arrow-drop-down'} />}
                onSelect={(carConverter: CarConverter) => this.setState({ selectedConverter: carConverter })}
              />
            )}
          />
          <Input
            placeholder={Constants.VIN_FULL}
            placeholderTextColor={commonColors.disabledDark}
            labelStyle={style.inputLabel}
            autoCapitalize={'none'}
            autoCorrect={false}
            label={`${Constants.VIN}*`}
            errorMessage={!this.checkVIN() && vin && I18n.t('cars.invalidVIN')}
            errorStyle={style.errorText}
            inputStyle={style.selectDropdownRowText}
            onChangeText={(newVin: string) => this.setState({ vin: newVin })}
          />
          <Input
            placeholder={I18n.t('cars.licensePlate')}
            placeholderTextColor={commonColors.disabledDark}
            label={`${I18n.t('cars.licensePlate')}*`}
            labelStyle={style.inputLabel}
            autoCapitalize={'none'}
            autoCorrect={false}
            errorStyle={style.errorText}
            errorMessage={!this.checkLicensePlate() && licensePlate && I18n.t('cars.invalidLicensePlate')}
            inputStyle={style.selectDropdownRowText}
            onChangeText={(newLicensePlate: string) => this.setState({ licensePlate: newLicensePlate })}
          />
          {this.securityProvider?.canListUsers() && (
            <ModalSelect<User>
              openable={true}
              disabled={false}
              defaultItem={selectedUser}
              renderItem={(user: User) => <UserComponent shadowed={true} user={user} navigation={navigation} />}
              onItemsSelected={(users: User[]) => this.setState({ selectedUser: users?.[0] })}
              navigation={navigation}
              selectionMode={ItemSelectionMode.SINGLE}>
              <Users navigation={navigation} />
            </ModalSelect>
          )}
          <TouchableOpacity onPress={() => this.setState({ isDefault: !isDefault })} style={style.defaultContainer}>
            <CheckBox style={formStyles.checkbox} checked={isDefault} disabled={true} />
            <Text style={style.text}>{I18n.t('cars.defaultCar')}</Text>
          </TouchableOpacity>
          <View style={style.carTypeContainer}>
            <TouchableOpacity onPress={() => this.setState({ type: CarType.COMPANY })} style={style.typeContainer}>
              <RadioButton.Android
                color={commonColors.textColor}
                uncheckedColor={commonColors.textColor}
                onPress={() => this.setState({ type: CarType.COMPANY })}
                value={'Company'}
                style={style.radioButton}
                status={type === CarType.COMPANY ? 'checked' : 'unchecked'}
              />
              <Text style={style.text}>{I18n.t('carTypes.companyCar')}</Text>
            </TouchableOpacity>
            {this.securityProvider?.isAdmin() && (
              <TouchableOpacity onPress={() => this.setState({ type: CarType.POOL_CAR })} style={style.typeContainer}>
                <RadioButton.Android
                  color={commonColors.textColor}
                  uncheckedColor={commonColors.textColor}
                  onPress={() => this.setState({ type: CarType.POOL_CAR })}
                  value={'Pool'}
                  status={type === CarType.POOL_CAR ? 'checked' : 'unchecked'}
                />
                <Text style={style.text}>{I18n.t('carTypes.poolCar')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => this.setState({ type: CarType.PRIVATE })} style={style.typeContainer}>
              <RadioButton.Android
                color={commonColors.textColor}
                onPress={() => this.setState({ type: CarType.PRIVATE })}
                uncheckedColor={commonColors.textColor}
                value={'Private'}
                status={type === CarType.PRIVATE ? 'checked' : 'unchecked'}
              />
              <Text style={style.text}>{I18n.t('carTypes.privateCar')}</Text>
            </TouchableOpacity>
          </View>
          <Button
            disabled={!this.checkForm()}
            titleStyle={style.buttonText}
            disabledStyle={style.buttonDisabled}
            containerStyle={style.buttonContainer}
            buttonStyle={modalCommonStyles.primaryButton}
            onPress={this.addCar.bind(this)}
            title={'ADD CAR'}
          />
        </ScrollView>
      </View>
    );
  }

  private checkVIN(): boolean {
    const { vin } = this.state;
    const vinPattern = new RegExp('^[A-Z\\d]{17}$');
    return vin && vinPattern.test(vin);
  }

  private checkLicensePlate(): boolean {
    const { licensePlate } = this.state;
    const licensePlatePattern = new RegExp('^[A-Z0-9- ]*$');
    return licensePlate && licensePlatePattern.test(licensePlate);
  }

  private checkForm(): boolean {
    const { selectedCarCatalog, selectedConverter, selectedUser, type } = this.state;
    return this.checkVIN() && this.checkLicensePlate() && !!selectedCarCatalog && !!selectedConverter && !!selectedUser && !!type;
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

  private renderCarCatalogPlaceholder(style: any) {
    const listItemCommonStyle = computeListItemCommonStyle();
    return (
      <View style={listItemCommonStyle.container}>
        <View style={style.itemContainer}>
          <Text style={[style.text, style.model]}>{I18n.t('cars.model')}*</Text>
        </View>
      </View>
    );
  }

  private async addCar(forced: boolean = false): Promise<void> {
    if (this.checkForm()) {
      const { selectedConverter, selectedCarCatalog, selectedUser, vin, licensePlate, isDefault, type } = this.state;
      const carDTO = {
        vin,
        licensePlate,
        carCatalogID: selectedCarCatalog?.id,
        converter: selectedConverter,
        type,
        userID: selectedUser?.id,
        default: isDefault,
        forced
      } as CarDTO;
      try {
        const response = await this.centralServerProvider.createCar(carDTO, forced);
        if (response.status === RestResponse.SUCCESS) {
          Message.showSuccess('car created');
          return;
        }
        Message.showError(I18n.t('cars.addError'));
        return;
      } catch (error) {
        switch (error.status) {
          case HTTPError.CAR_ALREADY_EXIST_ERROR:
            Message.showError(I18n.t('users.carAlreadyExistError'));
            break;
          case HTTPError.USER_ALREADY_ASSIGNED_TO_CAR:
            Message.showError(I18n.t('cars.userAlreadyAssignedError'));
            break;
          default:
            Message.showError(I18n.t('cars.addError'));
        }
      }
    }
    return null;
  }
}
