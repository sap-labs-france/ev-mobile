import I18n from 'i18n-js';
import { Button, Item, Picker, Text, View } from 'native-base';
import React from 'react';
import { Alert, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import computeModalStyleSheet from '../../../ModalStyles';
import Configuration from '../../../config/Configuration';
import BaseProps from '../../../types/BaseProps';
import Tenant, { EndpointCloud, TenantConnection } from '../../../types/Tenant';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';

export interface Props extends BaseProps {
  tenants: TenantConnection[];
  close: (newTenant?: TenantConnection) => void;
}

interface State {
  newTenantSubDomain?: string;
  newTenantName?: string;
  newTenantEndpointCloud?: EndpointCloud;
  errorNewTenantName?: object[];
  errorNewTenantSubDomain?: object[];
}

export default class Login extends React.Component<Props, State> {
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
      },
    },
  };

  constructor(props: Props) {
    super(props);
    if (__DEV__) {
      this.tenantEndpointClouds = Configuration.ENDPOINT_CLOUDS_QA;
    } else {
      this.tenantEndpointClouds = Configuration.ENDPOINT_CLOUDS_PROD;
    }
    this.state = {
      newTenantSubDomain: null,
      newTenantName: null,
      newTenantEndpointCloud: this.tenantEndpointClouds.find((tenantEndpointCloud) => tenantEndpointCloud.id === 'scp')
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  private createTenant = async (subdomain: string, name: string, endpointCloud: EndpointCloud) => {
    const { tenants, close } = this.props;
    // Check field
    const formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
    const newTenant: TenantConnection = {
      subdomain,
      name,
      endpoint: endpointCloud.endpoint
    }
    if (formIsValid) {
      const foundTenant = tenants.find((tenant) => tenant.subdomain === subdomain)
      // Already exists
      if (foundTenant) {
        Alert.alert(
          I18n.t('general.error'),
          I18n.t('general.tenantExists'),
          [{ text: I18n.t('general.ok'), style: 'cancel' }],
          { cancelable: false }
        );
      // Add new Tenant and Save
      } else {
        tenants.push(newTenant);
        // Save
        await SecuredStorage.saveTenants(tenants);
        // Hide Modal
        close(newTenant);
      }
    }
  };

  public render() {
    const modalStyle = computeModalStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    // Render
    return (
      <Modal style={modalStyle.modal} isVisible={true} onBackdropPress={() => this.props.close()}>
        <View style={modalStyle.modalContainer}>
          <View style={modalStyle.modalHeaderContainer}>
            <Text style={modalStyle.modalTextHeader}>{I18n.t('authentication.createTenantTitle')}</Text>
          </View>
          <View style={modalStyle.modalContentContainer}>
            <View style={modalStyle.modalRow}>
              <Item inlineLabel={true} style={modalStyle.modalInputGroup}>
                <TextInput
                  autoFocus={true}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  placeholder={I18n.t('authentication.tenantSubdomain')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  style={modalStyle.modalInputField}
                  onChangeText={(value) => this.setState({ newTenantSubDomain: value.toLowerCase() })}
                />
              </Item>
            </View>
            <View style={modalStyle.modalRowError}>
              {this.state.errorNewTenantSubDomain &&
                this.state.errorNewTenantSubDomain.map((errorMessage, index) => (
                  <Text style={modalStyle.modalErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
            </View>
            <View style={modalStyle.modalRow}>
              <Item inlineLabel={true} style={modalStyle.modalInputGroup}>
                <TextInput
                  placeholder={I18n.t('authentication.tenantName')}
                  placeholderTextColor={commonColor.placeholderTextColor}
                  autoCorrect={false}
                  style={modalStyle.modalInputField}
                  onChangeText={(value) => this.setState({ newTenantName: value })}
                />
              </Item>
            </View>
            <View style={modalStyle.modalRowError}>
              {this.state.errorNewTenantName &&
                this.state.errorNewTenantName.map((errorMessage, index) => (
                  <Text style={modalStyle.modalErrorText} key={index}>
                    {errorMessage}
                  </Text>
                ))}
            </View>
            <View style={modalStyle.modalRow}>
              <Item picker={true} inlineLabel={true} style={modalStyle.modalPickerGroup}>
                <Picker
                  mode='dialog'
                  style={modalStyle.modalPickerField}
                  placeholder={I18n.t('authentication.tenantEndpoint')}
                  headerBackButtonText={I18n.t('general.back')}
                  iosHeader={I18n.t('authentication.tenantEndpoint')}
                  placeholderStyle={modalStyle.modalPickerPlaceHolder}
                  headerStyle={modalStyle.modalPickerModal}
                  headerTitleStyle={modalStyle.modalPickerText}
                  headerBackButtonTextStyle={modalStyle.modalPickerText}
                  textStyle={modalStyle.modalPickerText}
                  itemTextStyle={modalStyle.modalPickerText}
                  itemStyle={modalStyle.modalPickerModal}
                  modalStyle={modalStyle.modalPickerModal}
                  selectedValue={this.state.newTenantEndpointCloud}
                  onValueChange={(value) => this.setState({ newTenantEndpointCloud: value })}
                >
                  {this.tenantEndpointClouds.map((tenantEndpointCloud) =>
                    <Picker.Item key={tenantEndpointCloud.id} value={tenantEndpointCloud} label={tenantEndpointCloud.name} />)
                  }
                </Picker>
              </Item>
            </View>
          </View>
          <View style={modalStyle.modalButtonsContainer}>
            <Button style={[modalStyle.modalButton]} full={true} danger={true}
              onPress={() => {
                this.createTenant(this.state.newTenantSubDomain, this.state.newTenantName, this.state.newTenantEndpointCloud);
              }} >
              <Text style={modalStyle.modalTextButton} uppercase={false}>{I18n.t('general.create')}</Text>
            </Button>
            <Button style={[modalStyle.modalButton]} full={true} light={true}
              onPress={() => { this.props.close() }} >
              <Text style={modalStyle.modalTextButton} uppercase={false}>{I18n.t('general.cancel')}</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}
