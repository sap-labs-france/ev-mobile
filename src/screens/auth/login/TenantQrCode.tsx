import I18n from 'i18n-js';
import { Container } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import HeaderComponent from '../../../components/header/HeaderComponent';
import Configuration from '../../../config/Configuration';
import BaseProps from '../../../types/BaseProps';
import TenantQRCode from '../../../types/QrCode'
import { EndpointCloud, TenantConnection } from '../../../types/Tenant';
import Message from '../../../utils/Message';
import SecuredStorage from '../../../utils/SecuredStorage';
import BaseScreen from '../../base-screen/BaseScreen';

export interface Props extends BaseProps {
  tenants: TenantConnection[];
  close: (newTenant?: TenantConnection) => void;
}

interface State {
}

export default class TenantQrCode extends BaseScreen<State, Props> {
  public state: State;
  public props: Props;
  public tenantEndpointClouds: EndpointCloud[];

  constructor(props: Props) {
    super(props);
    if (__DEV__) {
      this.tenantEndpointClouds = Configuration.ENDPOINT_CLOUDS_QA;
    } else {
      this.tenantEndpointClouds = Configuration.ENDPOINT_CLOUDS_PROD;
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async createTenant(tenantQRCode: TenantQRCode) {
      const { tenants, close } = this.props;
      // Get the end point
      const newTenantEndpointCloud = this.tenantEndpointClouds.find((tenantEndpointCloud) => tenantEndpointCloud.id === tenantQRCode.endpoint)
      if (!newTenantEndpointCloud) {
        Message.showError(I18n.t('qrCode.endpointError', {endpoint: tenantQRCode.endpoint}));
        close();
        return;
      }
      // Create
      const newTenant: TenantConnection = {
        subdomain: tenantQRCode.tenantSubDomain ,
        name: tenantQRCode.tenantName,
        endpoint: newTenantEndpointCloud.endpoint
      };
      // Add
      tenants.push(newTenant)
      // Save
      await SecuredStorage.saveTenants(tenants);
      // Close
      close(newTenant);
  }

  public async checkQrCodeAndSelectOrCreateTenant(qrCode: any) {
    const { close } = this.props;
    const tenantQRCode: TenantQRCode = JSON.parse(qrCode.data);
    const tenant = await this.centralServerProvider.getTenant(tenantQRCode.tenantSubDomain);
    if (!tenant) {
      await Alert.alert(
        I18n.t('qrCode.unknownOrganizationTitle'),
        I18n.t('qrCode.unknownOrganizationMessage', {tenantName: tenantQRCode.tenantName}),
        [
          { text: I18n.t('general.no'), onPress: () => close(), style: 'cancel' },
          { text: I18n.t('general.yes'), onPress: () => this.createTenant(tenantQRCode)}
        ],
      );
    } else {
      close(tenant);
    }
    Message.showSuccess(I18n.t('general.scanQrCodeSuccess'));
  }

  public render() {
    return (
      <Container>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('qrCode.scanTenantQrCodeTitle')}
          leftAction={() => this.props.close()}
          leftActionIcon={'navigate-before'}
          hideHomeAction={true}
        />
        <QRCodeScanner showMarker={true} onRead={(qrCode) => this.checkQrCodeAndSelectOrCreateTenant(qrCode)}/>
      </Container>
    );
  }
}
