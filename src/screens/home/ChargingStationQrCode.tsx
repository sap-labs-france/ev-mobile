import { DrawerActions, StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Container } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import base64 from 'react-native-base64';
import Orientation from 'react-native-orientation-locker';
import QRCodeScanner from 'react-native-qrcode-scanner';

import HeaderComponent from '../../components/header/HeaderComponent';
import Configuration from '../../config/Configuration';
import BaseProps from '../../types/BaseProps';
import { Connector } from '../../types/ChargingStation';
import ChargingStationQRCode from '../../types/QrCode';
import { EndpointCloud, TenantConnection } from '../../types/Tenant';
import Message from '../../utils/Message';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';

export interface Props extends BaseProps {
  tenantSubDomain: string;
  tenants: TenantConnection[];
  close: () => void;
}

interface State {
}

export default class ChargingStationQrCode extends BaseScreen<State, Props> {
  public state: State;
  public props: Props;
  private tenantEndpointClouds: EndpointCloud[];

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

  public async logoff(tenant: TenantConnection) {
    // Logoff
    this.centralServerProvider.logoff();
    // Navigate to login
    this.props.navigation.dispatch(
      StackActions.replace(
        'AuthNavigator', {
          name: 'Login',
          params: {
            subdomain: tenant.subdomain,
            name: tenant.name,
            endpoint: tenant.endpoint,
          },
          key: `${Utils.randomNumber()}`,
        }
      ),
    );
  }

  public async saveTenantAndLogOff(chargingStationQRCode: ChargingStationQRCode, newTenantEndpointCloud: EndpointCloud) {
    this.props.tenants = await this.centralServerProvider.getTenants();
    const newTenant: TenantConnection = {
      subdomain: chargingStationQRCode.tenantSubDomain,
      name: chargingStationQRCode.tenantName,
      endpoint: newTenantEndpointCloud.endpoint
    };
    this.props.tenants.push(newTenant);
    await SecuredStorage.saveTenants(this.props.tenants);
    await this.logoff(newTenant);
  }

  public async checkTenantQrCodeData(chargingStationQRCode: ChargingStationQRCode): Promise<boolean> {
    const tenant = await this.centralServerProvider.getTenant(chargingStationQRCode.tenantSubDomain);
    const endpointCloud = this.tenantEndpointClouds.find((tenantEndpointCloud) => tenantEndpointCloud.id === chargingStationQRCode.endpoint);
    if (chargingStationQRCode.tenantSubDomain !== this.props.tenantSubDomain) {
      // Check tenant exist
      if (tenant) {
        await Alert.alert(
          I18n.t('qrCode.wrongOrganizationTitle'),
          I18n.t('qrCode.wrongOrganizationMessage', {tenantName: tenant.name}),
          [
            { text: I18n.t('general.no'), style: 'cancel' },
            { text: I18n.t('general.yes'), onPress: ()  => this.logoff(tenant)}
          ],
          { cancelable: false }
        );
        return false;
      } else {
        if (!endpointCloud) {
          Message.showError(I18n.t('qrCode.unknownEndpoint', {endpoint: chargingStationQRCode.endpoint}));
          return false;
        }
        await Alert.alert(
          I18n.t('qrCode.unknownOrganizationTitle'),
          I18n.t('qrCode.unknownOrganizationMessage', {tenantName: chargingStationQRCode.tenantName}),
          [
            { text: I18n.t('general.no'), style: 'cancel' },
            { text: I18n.t('general.yes'), onPress: ()  => this.saveTenantAndLogOff(chargingStationQRCode, endpointCloud) }
          ],
          { cancelable: false }
        );
        return false;
      }
    }
    if (tenant.name !== chargingStationQRCode.tenantName) {
      Message.showError(I18n.t('qrCode.tenantNameError'));
      return false;
    }
    if (tenant.endpoint !== endpointCloud.endpoint) {
      Message.showError(I18n.t('qrCode.endpointError'));
      return false;
    }
    return true;
  }

  public async checkQrCodeDataAndSave(chargingStationQRCode: ChargingStationQRCode): Promise<boolean> {
    // Check the Tenant Sub Domain
    if (!(await this.checkTenantQrCodeData(chargingStationQRCode))) {
      return false;
    }
    try {
      // Check if the Charging Station exist
      const chargingStation = await this.centralServerProvider.getChargingStation({ID: chargingStationQRCode.chargingStationID});
      const foundConnector = chargingStation.connectors.find((connector: Connector) => connector.connectorId === chargingStationQRCode.connectorID);
      // Check if the Connector exist
      if (!foundConnector) {
        Message.showError(I18n.t('qrCode.unknownConnector', {connectorID: chargingStationQRCode.connectorID}));
        return false;
      }
    } catch (error) {
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
        'chargers.chargerUnexpectedError', this.props.navigation);
      Message.showError(I18n.t('qrCode.unknownChargingStation', {chargingStationID: chargingStationQRCode.chargingStationID}));
      return false;
    }
    Message.showSuccess(I18n.t('general.scanQrCodeSuccess'));
    return true;
  }

  public async checkQrCodeDataAndNavigate(decodeData: string) {
    const { navigation } = this.props;
    // Check Qr code Data
    const chargingStationQrCode: ChargingStationQRCode  = JSON.parse(decodeData);

    if (await this.checkQrCodeDataAndSave(chargingStationQrCode)) {
      // Navigate to connector
      navigation.navigate(
        'ChargingStationConnectorDetailsTabs', {
          params: {
            chargingStationID: chargingStationQrCode.chargingStationID,
            connectorID: chargingStationQrCode.connectorID,
            startTransaction: true
          },
          key: `${Utils.randomNumber()}`
        }
      );
    }
    this.props.close();
  }

  public render() {
    const { navigation } = this.props;
    return (
      <Container>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('qrCode.scanChargingStationQrCodeTitle')}
          leftAction={() => this.props.close()}
          leftActionIcon={'navigate-before'}
          hideHomeAction={true}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
        />
        <QRCodeScanner cameraProps={{captureAudio: false}} showMarker={true} onRead={(qrCode) => this.checkQrCodeDataAndNavigate(base64.decode(qrCode.data))}/>
      </Container>
    );
  }
}
