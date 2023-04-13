import base64 from 'base-64';
import I18n from 'i18n-js';
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
import { View } from 'react-native';

export interface Props extends BaseProps {}

interface State {}

export default class TenantQrCode extends BaseScreen<State, Props> {
  public state: State;
  public props: Props;
  private tenantEndpointClouds: EndpointCloud[];
  private tenants: TenantConnection[];


  public async componentDidMount() {
    await super.componentDidMount();
    this.tenantEndpointClouds = await Utils.getEndpointClouds();
    this.tenants = await SecuredStorage.getTenants();
    Orientation.lockToPortrait();
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async createTenant(tenantQrCode: TenantQRCode) {
    // Get Endpoint
    const newTenantEndpointCloud = this.tenantEndpointClouds.find(
      (tenantEndpointCloud) => tenantEndpointCloud.id === tenantQrCode.endpoint
    );
    // Create
    const newTenant: TenantConnection = {
      subdomain: tenantQrCode.tenantSubDomain,
      name: tenantQrCode.tenantName,
      endpoint: newTenantEndpointCloud
    };
    // Add
    this.tenants.push(newTenant);
    try {
      // Save
      await SecuredStorage.saveTenants(this.tenants);
      Message.showSuccess(I18n.t('qrCode.scanTenantQrCodeSuccess', {tenantName: newTenant.name}));
      this.props.navigation.navigate('Tenants', {newTenantSubdomain: newTenant.subdomain });
    } catch ( e ) {
      Message.showError(I18n.t('qrCode.saveOrganizationError'));
    }
  }

  public async checkQrCodeDataAndNavigate(qrCodeData: string) {
    try {
      // Decode
      const decodedQrCodeData = base64.decode(qrCodeData);
      // Parse
      const tenantQrCode = JSON.parse(decodedQrCodeData) as TenantQRCode;
      // Check mandatory props
      if (!tenantQrCode.tenantSubDomain || !tenantQrCode.tenantName || !tenantQrCode.endpoint) {
        Message.showError(I18n.t('qrCode.invalidQRCode'));
        return;
      }
      // Check Endpoint
      const newTenantEndpointCloud = this.tenantEndpointClouds.find(
        (tenantEndpointCloud) => tenantEndpointCloud.id === tenantQrCode.endpoint
      );
      if (!newTenantEndpointCloud) {
        Message.showError(I18n.t('qrCode.unknownEndpoint', { endpoint: tenantQrCode.endpoint }));
        return;
      }
      // Check QR Code
      const tenant = await this.centralServerProvider.getTenant(tenantQrCode.tenantSubDomain);
      if (!tenant) {
        this.createTenant(tenantQrCode);
      } else {
        Message.showError(I18n.t('general.subdomainAlreadyUsed', {tenantName: tenant.name}));
      }
    } catch (error) {
      // Do not display message until we get the right QR Code
    }
  }

  public render() {
    const commonColor = Utils.getCurrentCommonColor();
    return (
      <View style={{backgroundColor: commonColor.containerBgColor}}>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('qrCode.scanTenantQrCodeTitle')}
        />
        <QRCodeScanner
          cameraProps={{ captureAudio: false }}
          markerStyle={{borderColor: commonColor.primaryLight}}
          showMarker
          reactivate
          containerStyle={{height: '100%', alignItems: 'center', justifyContent: 'center'}}
          reactivateTimeout={1000}
          onRead={async (qrCode) => this.checkQrCodeDataAndNavigate(qrCode.data)}
        />
      </View>
    );
  }
}
