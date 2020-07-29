import I18n from 'i18n-js';
import { Button, Item, Text, View } from 'native-base';
import React from 'react';
import { Alert, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import computeModalStyleSheet from '../../../ModalStyles';
import BaseProps from '../../../types/BaseProps';
import Tenant from '../../../types/Tenant';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';

export interface Props extends BaseProps {
  tenants: Partial<Tenant>[];
  close: (newTenant?: Partial<Tenant>) => void;
}

interface State {
  newTenantSubDomain?: string;
  newTenantName?: string;
  errorNewTenantName?: object[];
  errorNewTenantSubDomain?: object[];
}

export default class Login extends React.Component<Props, State> {
  public state: State;
  public props: Props;
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
    this.state = {
      newTenantSubDomain: null,
      newTenantName: null,
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  private createTenant = async (subdomain: string, name: string) => {
    const { tenants } = this.props;
    // Check field
    const formIsValid = Utils.validateInput(this, this.formCreateTenantValidationDef);
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
        tenants.push({
          subdomain,
          name
        });
        // Save
        await SecuredStorage.saveTenants(tenants);
        // Hide Modal
        this.props.close({ subdomain, name });
      }
    }
  };

  public render() {
    const modalStyle = computeModalStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    // Render
    return (
      <Modal style ={modalStyle.modal} isVisible={true}
          onBackdropPress={() => this.props.close() }>
        <View style ={modalStyle.modalContainer}>
          <View style ={modalStyle.modalHeaderContainer}>
            <Text style={modalStyle.modalTextHeader}>{I18n.t('authentication.createTenantTitle')}</Text>
          </View>
          <View style={modalStyle.modalContentContainer}>
            <View style={modalStyle.modalRow}>
              <Item inlineLabel={true} style={modalStyle.modalIinputGroup}>
                <TextInput
                  autoFocus={true}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  placeholder={I18n.t('authentication.tenantSubdomain')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
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
              <Item inlineLabel={true} style={modalStyle.modalIinputGroup}>
                <TextInput
                  placeholder={I18n.t('authentication.tenantName')}
                  placeholderTextColor={commonColor.inputColorPlaceholder}
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
          </View>
          <View style={modalStyle.modalButtonsContainer}>
            <Button style={[modalStyle.modalButton]} full={true} danger={true}
                onPress={() => {
                  this.createTenant(this.state.newTenantSubDomain, this.state.newTenantName);
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
