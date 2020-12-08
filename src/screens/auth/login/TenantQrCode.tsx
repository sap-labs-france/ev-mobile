import base64 from 'base-64';
import I18n from 'i18n-js';
import { Container } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import Orientation from 'react-native-orientation-locker';
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
  close: (newTenant?: TenantConnection) => boolean;
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

  public async componentDidMount() {
    await super.componentDidMount();
    Orientation.lockToPortrait();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async createTenantAndClose(tenantQrCode: TenantQRCode) {
    const { tenants } = this.props;
    // Get Endpoint
    const newTenantEndpointCloud = this.tenantEndpointClouds.find(
      (tenantEndpointCloud) => tenantEndpointCloud.id === tenantQrCode.endpoint);
    // Create
    const newTenant: TenantConnection = {
      subdomain: tenantQrCode.tenantSubDomain,
      name: tenantQrCode.tenantName,
      endpoint: newTenantEndpointCloud.endpoint
    };
    // Add
    tenants.push(newTenant)
    // Save
    await SecuredStorage.saveTenants(tenants);
    // Ok
    Message.showSuccess(I18n.t('qrCode.scanTenantQrCodeSuccess', { tenantName: tenantQrCode.tenantName }));
    // Close
    this.close(newTenant);
  }

  public async checkQrCodeDataAndNavigate(qrCodeData: string) {
    try {
      // Decode
      const decodedQrCodeData = base64.decode(qrCodeData);
      // Parse
      const tenantQrCode = JSON.parse(decodedQrCodeData) as TenantQRCode;
      // Check mandatory props
      if (!tenantQrCode.tenantSubDomain ||
        !tenantQrCode.tenantName ||
        !tenantQrCode.endpoint) {
        Message.showError(I18n.t('qrCode.invalidQRCode'));
        this.close();
        return;
      }
      // Check Endpoint
      const newTenantEndpointCloud = this.tenantEndpointClouds.find(
        (tenantEndpointCloud) => tenantEndpointCloud.id === tenantQrCode.endpoint);
      if (!newTenantEndpointCloud) {
        Message.showError(I18n.t('qrCode.unknownEndpoint', { endpoint: tenantQrCode.endpoint }));
        this.close();
      }
      // Check QR Code
      const tenant = await this.centralServerProvider.getTenant(tenantQrCode.tenantSubDomain);
      if (!tenant) {
        Alert.alert(
          I18n.t('qrCode.newOrganizationTitle'),
          I18n.t('qrCode.newOrganizationMessage', { tenantName: tenantQrCode.tenantName }),
          [
            { text: I18n.t('general.no'), onPress: () => this.close(), style: 'cancel' },
            { text: I18n.t('general.yes'), onPress: () => this.createTenantAndClose(tenantQrCode) }
          ],
        );
      } else {
        this.close(tenant);
      }
    } catch (error) {
      Message.showError(I18n.t('qrCode.unknownQRCode'));
      this.close();
    }
  }

  private close(tenant?: TenantConnection) {
    Orientation.unlockAllOrientations();
    this.props.close(tenant);
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
        <QRCodeScanner
          cameraProps={{ captureAudio: false }}
          showMarker={true}
          onRead={(qrCode) => this.checkQrCodeDataAndNavigate(qrCode.data)} />
      </Container>
    );
  }
}
