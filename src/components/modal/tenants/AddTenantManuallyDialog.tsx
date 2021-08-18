import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
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

export interface Props extends BaseProps, DialogCommonProps {
  tenants: TenantConnection[];
}

interface State {
  newTenantSubDomain?: string;
  newTenantName?: string;
  tenantEndpointClouds: EndpointCloud[];
  newTenantEndpointCloud?: EndpointCloud;
  errorNewTenantName?: Record<string, unknown>[];
  errorNewTenantSubDomain?: Record<string, unknown>[];
  tenantNameWithSameSubdomain?: TenantConnection;
  showSubdomainAlreadyUsedError: boolean;
}

export default class AddTenantManuallyDialog extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public tenantEndpointClouds: EndpointCloud[];

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
    let tenantEndpointClouds: EndpointCloud[];
    if (__DEV__) {
      tenantEndpointClouds = Configuration.DEVELOPMENT_ENDPOINT_CLOUDS;
    } else {
      tenantEndpointClouds = Configuration.ENDPOINT_CLOUDS;
    }
    // Set initial state
    this.state = {
      newTenantSubDomain: null,
      newTenantName: null,
      tenantEndpointClouds,
      newTenantEndpointCloud: Configuration.ENDPOINT_CLOUDS?.[0],
      showSubdomainAlreadyUsedError: false
    };
  }

  public render() {
    const style = computeStyleSheet();
    const modalCommonStyle = computeModalCommonStyle();
    const { newTenantSubDomain, newTenantName, newTenantEndpointCloud } = this.state;
    const { back } = this.props;

    return (
      <DialogModal
        renderIcon={(iconStyle) => <Icon style={iconStyle} type={'MaterialIcons'} name={'add-business'} />}
        animationIn={'fadeInLeft'}
        animationOut={'fadeOutRight'}
        close={() => this.props.close?.()}
        title={I18n.t('authentication.addTenantManuallyTitle')}
        withCloseButton={true}
        onBackButtonPressed={() => back?.()}
        onBackDropPress={() => {}}
        buttons={[
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
        ]}
        renderControls={() => this.renderControls(style)}
      />
    );
  }

  private renderControls(style: any) {
    const { tenantEndpointClouds, newTenantEndpointCloud, tenantNameWithSameSubdomain, showSubdomainAlreadyUsedError } = this.state;
    const commonColor = Utils.getCurrentCommonColor();
    return (
      <View style={style.modalControlsContainer}>
        <Input
          autoCorrect={false}
          autoCapitalize={'none'}
          placeholder={I18n.t('authentication.tenantSubdomainPlaceholder')}
          placeholderTextColor={commonColor.placeholderTextColor}
          errorMessage={this.state.errorNewTenantSubDomain?.join(' ')}
          errorStyle={style.inputError}
          label={I18n.t('authentication.tenantSubdomain')}
          labelStyle={style.inputLabel}
          containerStyle={style.inputContainer}
          inputContainerStyle={style.inputInnerContainer}
          inputStyle={style.inputText}
          onChangeText={(value: string) => this.setState({ newTenantSubDomain: value?.toLowerCase() })}
        />
        <Input
          autoCorrect={false}
          placeholder={I18n.t('authentication.tenantNamePlaceholder')}
          placeholderTextColor={commonColor.placeholderTextColor}
          errorMessage={this.state.errorNewTenantName?.join(' ')}
          errorStyle={style.inputError}
          label={I18n.t('authentication.tenantName')}
          labelStyle={style.inputLabel}
          containerStyle={style.inputContainer}
          inputContainerStyle={style.inputInnerContainer}
          inputStyle={style.inputText}
          onChangeText={(value: string) => this.setState({ newTenantName: value })}
        />
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
        {showSubdomainAlreadyUsedError && (
          <Text style={style.inputError}>{I18n.t('general.subdomainAlreadyUsed', { tenantName: tenantNameWithSameSubdomain })}</Text>
        )}
      </View>
    );
  }

  private createTenant = async (subdomain: string, name: string, endpointCloud: EndpointCloud) => {
    const { tenants, close } = this.props;
    // Check field
    const formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
    const newTenant: TenantConnection = {
      subdomain,
      name,
      endpoint: endpointCloud.endpoint
    };
    if (formIsValid) {
      const foundTenant = tenants.find((tenant) => tenant.subdomain === subdomain);
      // Already exists
      if (foundTenant) {
        this.setState({ tenantNameWithSameSubdomain: foundTenant.name, showSubdomainAlreadyUsedError: true });
        // Add new Tenant and Save
      } else {
        // Save
        tenants.push(newTenant);
        await SecuredStorage.saveTenants(tenants);
        // Hide Modal
        close(newTenant);
      }
    }
  };
}
