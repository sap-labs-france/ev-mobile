import base64 from 'base-64';
import I18n from 'i18n-js';
import { Container } from 'native-base';
import React from 'react';
import Orientation from 'react-native-orientation-locker';
import QRCodeScanner from 'react-native-qrcode-scanner';

import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import TenantQRCode from '../../types/QrCode';
import { EndpointCloud, TenantConnection } from '../../types/Tenant';
import Message from '../../utils/Message';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';

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
    this.tenantEndpointClouds = Utils.getEndpointCloud();
  }

  public async componentDidMount() {
    await super.componentDidMount();
    Orientation.lockToPortrait();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

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
    tenants.push(newTenant);
    // Save
    await SecuredStorage.saveTenants(tenants);
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
        return;
      }
      // Check Endpoint
      const newTenantEndpointCloud = this.tenantEndpointClouds.find(
        (tenantEndpointCloud) => tenantEndpointCloud.id === tenantQrCode.endpoint);
      if (!newTenantEndpointCloud) {
        Message.showError(I18n.t('qrCode.unknownEndpoint', { endpoint: tenantQrCode.endpoint }));
        return;
      }
      // Check QR Code
      const tenant = await this.centralServerProvider.getTenant(tenantQrCode.tenantSubDomain);
      if (!tenant) {
        this.createTenantAndClose(tenantQrCode);
      } else {
        this.close(tenant);
      }
    } catch (error) {
      // Do not display message until we get the right QR Code
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
          hideHomeAction
        />
        <QRCodeScanner
          cameraProps={{ captureAudio: false }}
          showMarker
          reactivate
          reactivateTimeout={1000}
          onRead={async (qrCode) => this.checkQrCodeDataAndNavigate(qrCode.data)} />
      </Container>
    );
  }
}
