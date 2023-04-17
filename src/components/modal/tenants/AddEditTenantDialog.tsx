import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';

import Configuration from '../../../config/Configuration';
import BaseProps from '../../../types/BaseProps';
import { EndpointCloud, TenantConnection } from '../../../types/Tenant';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import DialogModal, { DialogCommonProps } from '../DialogModal';
import { Button, Input } from 'react-native-elements';
import computeStyleSheet from './AddTenantManuallyDialogStyle';
import computeModalCommonStyle from '../ModalCommonStyle';
import Message from '../../../utils/Message';
import {TouchableOpacity, Text, View, TextInput} from 'react-native';
import { scale } from 'react-native-size-matters';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export interface Props extends BaseProps, DialogCommonProps {
  tenants: TenantConnection[];
  mode: TenantDialogMode;
  tenantIndex?: number;
}

interface State {
  newTenantSubDomain?: string;
  newTenantName?: string;
  newEndpointName?: string;
  newEndpointURL?: string;
  newTenantEndpointCloud?: EndpointCloud;
  errorNewTenantName?: string[];
  errorNewTenantSubDomain?: string[];
  errorNewEndpointName?: string[];
  errorNewEndpointURL?: string[];
  endpointWithSameName?: EndpointCloud;
  endpointWithSameURL?: EndpointCloud;
  showEndpointCreationForm: boolean;
  loadingAddNewEndpoint: boolean;
  userEndpoints?: EndpointCloud[];
  staticEndpoints?: EndpointCloud[];
}

export enum TenantDialogMode {
  ADD = 'ADD',
  EDIT = 'EDIT'
}

export default class AddEditTenantDialog extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public staticEndpoints: EndpointCloud[] = Configuration.getEndpoints();
  private tenant: TenantConnection;
  private nameInput: TextInput;
  private endpointInput: SelectDropdown;
  private endpointURLInput: TextInput;

  private formCreateTenantValidationDef = {
    newTenantSubDomain: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryTenantSubDomain')
      }
    },
    newTenantName: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryTenantName')
      }
    }
  };

  private formCreateEndpointValidationDef = {
    newEndpointName: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryEndpointName')
      }
    },
    newEndpointURL: {
      presence: {
        allowEmpty: false,
        message: '^' + I18n.t('authentication.mandatoryEndpointURL')
      }
    }
  };

  public constructor(props: Props) {
    super(props);
    this.tenant = props.tenants?.[props.tenantIndex];
    // Set initial state
    this.state = {
      newTenantSubDomain: null,
      newTenantName: null,
      newTenantEndpointCloud: null,
      showEndpointCreationForm: false,
      userEndpoints: [],
      loadingAddNewEndpoint: false,
      errorNewEndpointName: [],
      errorNewEndpointURL: [],
      errorNewTenantSubDomain: []
    };
  }

  public async componentDidMount() {
    const userEndpoints = await SecuredStorage.getEndpoints() || [];
    const allEndpoints = [...this.staticEndpoints, ...userEndpoints];
    // Set the endpoint of the tenant being edited otherwise default to the first endpoint in the list
    const newTenantEndpointCloud =
     allEndpoints.find((e) => e.name === this.tenant?.endpoint?.name) ?? allEndpoints?.[0];
    this.setState({
      newTenantSubDomain: this.tenant?.subdomain,
      newTenantName: this.tenant?.name,
      newTenantEndpointCloud,
      userEndpoints
    });
  }

  public render() {
    const style = computeStyleSheet();
    const modalCommonStyle = computeModalCommonStyle();
    const { newTenantSubDomain, newTenantName, newTenantEndpointCloud } = this.state;
    const { back, mode, withCancel } = this.props;
    return (
      <DialogModal
        renderIcon={(iconStyle) =>
          mode === TenantDialogMode.ADD ? (
            <Icon style={iconStyle} size={scale(iconStyle.fontSize)} as={MaterialIcons} name={'add-business'} />
          ) : (
            <Icon style={iconStyle} size={scale(iconStyle.fontSize)} as={MaterialCommunityIcons} name={'home-edit'} />
          )
        }
        animationIn={'fadeInLeft'}
        animationOut={'fadeOutRight'}
        close={() => this.props.close?.()}
        withCancel={withCancel}
        title={mode === TenantDialogMode.ADD ? I18n.t('authentication.addTenantManuallyTitle') : I18n.t('authentication.editTenantTitle')}
        withCloseButton={true}
        onBackButtonPressed={() => back?.()}
        onBackDropPress={() => {}}
        buttons={
          mode === TenantDialogMode.ADD ?
            [
              {
                text: I18n.t('general.create'),
                buttonTextStyle: modalCommonStyle.primaryButtonText,
                buttonStyle: modalCommonStyle.primaryButton,
                action: () => {
                  this.createTenant(newTenantSubDomain, newTenantName, newTenantEndpointCloud);
                }
              },
              {
                text: I18n.t('general.back'),
                buttonTextStyle: modalCommonStyle.outlinedButtonText,
                buttonStyle: {...modalCommonStyle.outlinedButton, ...style.backButton},
                action: () => back?.()
              }
            ]
            :
            [
              {
                text: I18n.t('general.save'),
                buttonTextStyle: modalCommonStyle.primaryButtonText,
                buttonStyle: modalCommonStyle.primaryButton,
                action: () => {
                  this.editTenant(newTenantSubDomain, newTenantName, newTenantEndpointCloud);
                }
              }
            ]
        }
        renderControls={() => this.renderControls(style)}
      />
    );
  }

  private renderControls(style: any) {
    const {
      loadingAddNewEndpoint,
      newTenantEndpointCloud,
      newTenantName,
      newTenantSubDomain,
      showEndpointCreationForm,
      newEndpointName,
      newEndpointURL,
      userEndpoints
    } = this.state;
    const commonColor = Utils.getCurrentCommonColor();
    const modalCommonStyles = computeModalCommonStyle();
    const allEndpoints = [...this.staticEndpoints, ...userEndpoints];
    allEndpoints.sort((endpoint1, endpoint2) => endpoint1?.name?.toUpperCase() < endpoint2?.name?.toUpperCase() ? -1 : 1 );
    const data = [{}, ...allEndpoints];
    return (
      <View style={style.modalControlsContainer}>
        <Input
          autoCorrect={false}
          defaultValue={newTenantSubDomain}
          autoCapitalize={'none'}
          placeholder={I18n.t('authentication.tenantSubdomainPlaceholder')}
          placeholderTextColor={commonColor.placeholderTextColor}
          errorMessage={this.state.errorNewTenantSubDomain?.join(' ')}
          errorStyle={style.inputError}
          label={`${I18n.t('authentication.tenantSubdomain')}*`}
          labelStyle={style.inputLabel}
          containerStyle={style.inputContainer}
          inputContainerStyle={style.inputInnerContainer}
          inputStyle={style.inputText}
          returnKeyType={'next'}
          onSubmitEditing={() => this.nameInput?.focus()}
          onChangeText={(value: string) => this.setState({ newTenantSubDomain: value?.toLowerCase() })}
        />
        <Input
          ref={(ref: TextInput) => this.nameInput = ref}
          autoCorrect={false}
          defaultValue={newTenantName}
          placeholder={I18n.t('authentication.tenantNamePlaceholder')}
          placeholderTextColor={commonColor.placeholderTextColor}
          errorMessage={this.state.errorNewTenantName?.join(' ')}
          errorStyle={style.inputError}
          label={`${I18n.t('authentication.tenantName')}*`}
          labelStyle={style.inputLabel}
          containerStyle={style.inputContainer}
          inputContainerStyle={style.inputInnerContainer}
          inputStyle={style.inputText}
          returnKeyType={'next'}
          onSubmitEditing={() => this.endpointInput?.openDropdown()}
          onChangeText={(value: string) => this.setState({ newTenantName: value })}
        />

        {/* TODO style arrow icon */}
        <Input
          label={I18n.t('authentication.tenantEndpoint')}
          autoCorrect={false}
          rightIconContainerStyle={style.rightIconContainerStyle}
          labelStyle={[style.inputLabel, style.selectLabel]}
          containerStyle={style.inputContainer}
          inputStyle={style.inputText}
          inputContainerStyle={style.inputInnerContainerNoBorder}
          InputComponent={() =>
            <SelectDropdown
              ref={(ref) => this.endpointInput = ref}
              data={data}
              defaultButtonText={newTenantEndpointCloud?.name}
              buttonTextAfterSelection={(selectedItem: EndpointCloud) => selectedItem.name}
              renderCustomizedRowChild={(item: EndpointCloud, index: number) => {
                if ( index === 0 ) {
                  return (
                    <TouchableOpacity onPress={() => this.setState({showEndpointCreationForm: true})} style={style.selectDropdownRowContainer}>
                      <Icon size={scale(25)} as={MaterialIcons} name={'add'} style={[style.newEntryText, style.newEntryIcon]}/>
                      <Text style={[style.selectDropdownRowText, style.newEntryText]}>{I18n.t('general.newEntry')}</Text>
                    </TouchableOpacity>
                  );
                }
                return (
                  <View style={style.selectDropdownRowContainer}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.selectDropdownRowText}>{item.name}</Text>
                    {userEndpoints.map(userEndpoint => userEndpoint.name).includes(item.name) && (
                      <TouchableOpacity style={style.selectDropdownRowIconContainer} onPress={() => this.deleteEndpoint(item.name)}>
                        <Icon size={scale(30)} style={style.selectDropdownRowIcon} name={'close'} as={EvilIcons}/>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
              buttonStyle={style.selectField}
              buttonTextStyle={style.selectFieldText}
              dropdownStyle={style.selectDropdown}
              rowStyle={style.selectDropdownRow}
              rowTextStyle={style.selectDropdownRowText}
              renderDropdownIcon={() => <Icon size={scale(26)} style={style.selectDropdownIcon} as={MaterialIcons} name={'arrow-drop-down'} />}
              onSelect={(endpointCloud: EndpointCloud) => this.setState({ newTenantEndpointCloud: endpointCloud })}
            />
          }
        />
        {showEndpointCreationForm && (
          <View style={style.endpointCreationFormContainer}>
            <View style={style.endpointCreationFormHeader}>
              <Text style={[style.inputLabel, style.endpointCreationFormTitle]}>{I18n.t('authentication.createEndpoint')}</Text>
              <TouchableOpacity onPress={() => this.setState({showEndpointCreationForm: false})}>
                <Icon color={commonColor.textColor} size={scale(25)} as={EvilIcons} name={'close'} />
              </TouchableOpacity>
            </View>
            <Input
              defaultValue={newEndpointName}
              label={`${I18n.t('authentication.endpointName')}*`}
              placeholder={I18n.t('authentication.endpointName')}
              placeholderTextColor={commonColor.placeholderTextColor}
              errorMessage={this.state.errorNewEndpointName?.join(' ')}
              errorStyle={style.inputError}
              labelStyle={style.endpointCreationFormInputLabel}
              containerStyle={style.inputContainer}
              inputContainerStyle={style.inputInnerContainer}
              inputStyle={style.inputText}
              returnKeyType={'next'}
              onSubmitEditing={() => this.endpointURLInput?.focus()}
              onChangeText={(value: string) => this.setState({newEndpointName: value})}
            />
            <Input
              ref={(ref) => this.endpointURLInput = ref}
              defaultValue={newEndpointURL}
              autoCapitalize={'none'}
              autoCorrect={false}
              label={`${I18n.t('authentication.endpointURL')}*`}
              placeholder={I18n.t('authentication.endpointURL')}
              placeholderTextColor={commonColor.placeholderTextColor}
              errorMessage={this.state.errorNewEndpointURL?.join(' ')}
              errorStyle={style.inputError}
              labelStyle={style.endpointCreationFormInputLabel}
              containerStyle={style.inputContainer}
              inputContainerStyle={style.inputInnerContainer}
              inputStyle={style.inputText}
              onChangeText={(value: string) => this.setState({newEndpointURL: value})}
            />
            <Button
              buttonStyle={[modalCommonStyles.primaryButton, style.button]}
              title={I18n.t('authentication.addEndpoint').toUpperCase()}
              titleStyle={style.buttonText}
              loading={loadingAddNewEndpoint}
              onPress={() => this.addEndpoint(newEndpointName, newEndpointURL)}
            />
          </View>
        )}
      </View>
    );
  }

  private async deleteEndpoint(endpointName: string): Promise<void> {
    let { userEndpoints, newTenantEndpointCloud } = this.state;
    userEndpoints = userEndpoints.filter((endpoint) => endpoint.name !== endpointName);
    // Handle deletion of the currently selected endpoint
    if (endpointName === newTenantEndpointCloud.name) {
      const allEndpoints = [...userEndpoints, ...this.staticEndpoints];
      allEndpoints.sort((endpoint1, endpoint2) => endpoint1.name.toUpperCase() < endpoint2.name.toUpperCase() ? -1 : 1 );
      newTenantEndpointCloud = allEndpoints[0];
    }
    await SecuredStorage.saveEndpoints(userEndpoints);
    this.setState({userEndpoints, newTenantEndpointCloud}, () => {
      Message.showSuccess(I18n.t('general.deleteEndpointSuccess', { endpointName: endpointName }));
    });
  }

  private addEndpoint(newEndpointName: string, newEndpointURL: string): void {
    this.setState({loadingAddNewEndpoint: true}, async () => {
      const { userEndpoints } = this.state;
      let isFormValid = Utils.validateInput(this, this.formCreateEndpointValidationDef);
      const allEndpoints = [...userEndpoints, ...this.staticEndpoints];
      const endpointWithSameName = allEndpoints.find((endpoint) => endpoint.name === newEndpointName);
      const endpointWithSameURL = allEndpoints.find((endpoint) => endpoint.endpoint === newEndpointURL);
      if ( endpointWithSameName ) {
        isFormValid = false;
        const { errorNewEndpointName } = this.state;
        errorNewEndpointName.push(I18n.t('general.endpointNameAlreadyExist'));
        this.setState({ endpointWithSameName, errorNewEndpointName });
      }
      if ( endpointWithSameURL ) {
        isFormValid = false;
        const { errorNewEndpointURL } = this.state;
        errorNewEndpointURL.push(I18n.t('general.endpointURLAlreadyExist', {endpointName: endpointWithSameURL.name}));
        this.setState({ endpointWithSameURL, errorNewEndpointURL });
      }
      if ( isFormValid ) {
        const newEndpoint = { name: newEndpointName, endpoint: newEndpointURL } as EndpointCloud;
        userEndpoints.push(newEndpoint);
        await SecuredStorage.saveEndpoints(userEndpoints);
        this.setState({ userEndpoints, showEndpointCreationForm: false }, () => {
          Message.showSuccess(I18n.t('general.createEndpointSuccess', { endpointName: newEndpointName }));
        });
      }

      this.setState({loadingAddNewEndpoint: false});
    });
  }

  private async editTenant(newSubdomain: string, newName: string, newEndpointCloud: EndpointCloud) {
    const { tenantIndex, tenants } = this.props;
    let formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
    if (this.tenant?.subdomain !== newSubdomain) {
      const foundTenant = tenants.find((tenantConnection) => tenantConnection.subdomain === newSubdomain);
      if (foundTenant) {
        formIsValid = false;
        const { errorNewTenantSubDomain } = this.state;
        errorNewTenantSubDomain.push(`${I18n.t('general.subdomainAlreadyUsed', { tenantName: foundTenant.name })}`);
        this.setState({ errorNewTenantSubDomain });
      }
    }
    if (formIsValid) {
      const editedTenant: TenantConnection = {
        subdomain: newSubdomain,
        name: newName,
        endpoint: newEndpointCloud
      };
      tenants[tenantIndex] = editedTenant;
      await SecuredStorage.saveTenants(tenants);
      Message.showSuccess(I18n.t('general.editTenantSuccess'));
      this.props.close(editedTenant);
    }
  }

  private createTenant = async (subdomain: string, name: string, endpointCloud: EndpointCloud) => {
    const { tenants, close } = this.props;
    // Check field
    let formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
    const foundTenant = tenants.find((tenant) => tenant.subdomain === subdomain);
    // Already exists
    if (foundTenant) {
      const { errorNewTenantSubDomain } = this.state;
      errorNewTenantSubDomain.push(`${I18n.t('general.subdomainAlreadyUsed', { tenantName: foundTenant.name })}`);
      formIsValid = false;
      this.setState({ errorNewTenantSubDomain });
    }
    const newTenant: TenantConnection = {
      subdomain,
      name,
      endpoint: endpointCloud
    };
    if (formIsValid) {
      // Save
      tenants.push(newTenant);
      await SecuredStorage.saveTenants(tenants);
      Message.showSuccess(I18n.t('general.createTenantSuccess', { tenantName: newTenant.name }));
      // Hide Modal
      close(newTenant);
    }
  };
}
