import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import SelectDropdown from 'react-native-select-dropdown';

import Configuration from '../../../config/Configuration';
import BaseProps from '../../../types/BaseProps';
import { EndpointCloud, TenantConnection } from '../../../types/Tenant';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import DialogModal, { DialogCommonProps } from '../DialogModal';
import { Input } from 'react-native-elements';
import computeStyleSheet from './AddTenantManuallyDialogStyle';
import computeModalCommonStyle from '../ModalCommonStyle';
import Message from '../../../utils/Message';

export interface Props extends BaseProps, DialogCommonProps {
  tenants: TenantConnection[];
  mode: TenantDialogMode;
  tenantIndex?: number;
}

interface State {
  newTenantSubDomain?: string;
  newTenantName?: string;
  tenantEndpointClouds: EndpointCloud[];
  newTenantEndpointCloud?: EndpointCloud;
  errorNewTenantName?: Record<string, unknown>[];
  errorNewTenantSubDomain?: Record<string, unknown>[];
  tenantNameWithSameSubdomain?: TenantConnection;
  errorSubdomainAlreadyUsed: boolean;
}

export enum TenantDialogMode {
  ADD = 'ADD',
  EDIT = 'EDIT'
}

export default class AddEditTenantDialog extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public tenantEndpointClouds: EndpointCloud[];
  private tenant: TenantConnection;

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

  public constructor(props: Props) {
    super(props);
    const tenantEndpointClouds: EndpointCloud[] = Configuration.getEndpoints();
    this.tenant = props.tenants?.[props.tenantIndex];
    // Set initial state
    this.state = {
      newTenantSubDomain: null,
      newTenantName: null,
      tenantEndpointClouds,
      newTenantEndpointCloud: null,
      errorSubdomainAlreadyUsed: false
    };
  }

  public componentDidMount() {
    const { mode } = this.props;
    if (mode === TenantDialogMode.EDIT) {
      const newTenantEndpointCloud = Configuration.getEndpoints()?.find((e) => e.endpoint === this.tenant.endpoint);
      this.setState({
        newTenantSubDomain: this.tenant?.subdomain,
        newTenantName: this.tenant?.name,
        newTenantEndpointCloud
      });
    }
  }

  public render() {
    const style = computeStyleSheet();
    const modalCommonStyle = computeModalCommonStyle();
    const { newTenantSubDomain, newTenantName, newTenantEndpointCloud } = this.state;
    const { back, mode, withCancel } = this.props;
    const addButtons = [
      {
        text: I18n.t('general.create'),
        buttonTextStyle: modalCommonStyle.primaryButton,
        buttonStyle: modalCommonStyle.primaryButton,
        action: () => {
          this.createTenant(newTenantSubDomain, newTenantName, newTenantEndpointCloud);
        }
      },
      {
        text: I18n.t('general.back'),
        buttonTextStyle: modalCommonStyle.outlinedButton,
        buttonStyle: modalCommonStyle.outlinedButton,
        action: () => back?.()
      }
    ];
    const editButtons = [
      {
        text: I18n.t('general.save'),
        buttonTextStyle: modalCommonStyle.primaryButton,
        buttonStyle: modalCommonStyle.primaryButton,
        action: () => {
          this.editTenant(newTenantSubDomain, newTenantName, newTenantEndpointCloud);
        }
      }
    ];
    return (
      <DialogModal
        renderIcon={(iconStyle) =>
          mode === TenantDialogMode.ADD ? (
            <Icon style={iconStyle} type={'MaterialIcons'} name={'add-business'} />
          ) : (
            <Icon style={iconStyle} type={'MaterialCommunityIcons'} name={'home-edit'} />
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
        buttons={mode === TenantDialogMode.ADD ? addButtons : editButtons}
        renderControls={() => this.renderControls(style)}
      />
    );
  }

  private renderControls(style: any) {
    const {
      tenantEndpointClouds,
      newTenantEndpointCloud,
      tenantNameWithSameSubdomain,
      errorSubdomainAlreadyUsed,
      newTenantName,
      newTenantSubDomain
    } = this.state;
    const commonColor = Utils.getCurrentCommonColor();
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
          onChangeText={(value: string) => this.setState({ newTenantSubDomain: value?.toLowerCase() })}
        />
        <Input
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
          onChangeText={(value: string) => this.setState({ newTenantName: value })}
        />

        {/* TODO style arrow icon */}
        <Input
          label={I18n.t('authentication.tenantEndpoint')}
          labelStyle={[style.inputLabel, style.selectLabel]}
          containerStyle={style.inputContainer}
          inputStyle={style.inputText}
          inputContainerStyle={style.inputInnerContainer}
          InputComponent={() => (
            <SelectDropdown
              data={tenantEndpointClouds}
              defaultButtonText={newTenantEndpointCloud?.name}
              buttonTextAfterSelection={(selectedItem: EndpointCloud) => selectedItem.name}
              rowTextForSelection={(item: EndpointCloud) => item.name}
              buttonStyle={style.selectField}
              buttonTextStyle={style.selectFieldText}
              dropdownStyle={style.selectDropdown}
              rowStyle={style.selectDropdownRow}
              rowTextStyle={style.selectDropdownRowText}
              renderDropdownIcon={() => <Icon type={'MaterialIcons'} name={'arrow-drop-down'} />}
              onSelect={(endpointCloud: EndpointCloud) => this.setState({ newTenantEndpointCloud: endpointCloud })}
            />
          )}
        />
        {errorSubdomainAlreadyUsed && (
          <Text style={style.inputError}>{I18n.t('general.subdomainAlreadyUsed', { tenantName: tenantNameWithSameSubdomain.name })}</Text>
        )}
      </View>
    );
  }

  private async editTenant(newSubdomain: string, newName: string, newEndpointCloud: EndpointCloud) {
    const { tenantIndex, tenants } = this.props;
    let formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
    if (this.tenant?.subdomain !== newSubdomain) {
      const foundTenant = tenants.find((tenantConnection) => tenantConnection.subdomain === newSubdomain);
      if (foundTenant) {
        formIsValid = false;
        this.setState({ tenantNameWithSameSubdomain: foundTenant, errorSubdomainAlreadyUsed: true });
      }
    }
    if (formIsValid) {
      const editedTenant: TenantConnection = {
        subdomain: newSubdomain,
        name: newName,
        endpoint: newEndpointCloud?.endpoint
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
      formIsValid = false;
      this.setState({ tenantNameWithSameSubdomain: foundTenant, errorSubdomainAlreadyUsed: true });
    }
    const newTenant: TenantConnection = {
      subdomain,
      name,
      endpoint: endpointCloud?.endpoint
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
