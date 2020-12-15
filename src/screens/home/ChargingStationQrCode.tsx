import { DrawerActions, StackActions } from '@react-navigation/native';
import base64 from 'base-64';
import I18n from 'i18n-js';
import { Container } from 'native-base';
import React from 'react';
import { Alert } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import QRCodeScanner from 'react-native-qrcode-scanner';

import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import { Connector } from '../../types/ChargingStation';
import ChargingStationQRCode from '../../types/QrCode';
import { EndpointCloud, TenantConnection } from '../../types/Tenant';
import Message from '../../utils/Message';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';

export interface Props extends BaseProps {
  currentTenantSubDomain: string;
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
    this.tenantEndpointClouds = Utils.getEndpointCloud();
  }

  public async componentDidMount() {
    await super.componentDidMount();
    Orientation.lockToPortrait();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async logoffAndNavigateToLogin(tenant: TenantConnection) {
    // Logoff
    await this.centralServerProvider.logoff();
    // Navigate to login
    this.props.navigation.dispatch(
      StackActions.replace(
        'AuthNavigator', {
          name: 'Login',
          params: {
            tenantSubDomain: tenant.subdomain,
          },
          key: `${Utils.randomNumber()}`,
        }
      ),
    );
  }

  public async saveTenantAndLogOff(chargingStationQRCode: ChargingStationQRCode, newTenantEndpointCloud: EndpointCloud) {
    // Create new tenant
    const newTenant: TenantConnection = {
      subdomain: chargingStationQRCode.tenantSubDomain,
      name: chargingStationQRCode.tenantName,
      endpoint: newTenantEndpointCloud.endpoint
    };
    // Add to existing list
    this.props.tenants.push(newTenant);
    // Save
    await SecuredStorage.saveTenants(this.props.tenants);
    // Navigate to login
    await this.logoffAndNavigateToLogin(newTenant);
  }

  public async checkQrCodeDataAndNavigate(qrCodeData: string): Promise<void> {
    const { navigation } = this.props;
    try {
      // Decode
      const decodedQrCodeData = base64.decode(qrCodeData);
      // Parse
      const chargingStationQrCode = JSON.parse(decodedQrCodeData) as ChargingStationQRCode;
      // Check mandatory props
      if (!chargingStationQrCode.tenantSubDomain ||
          !chargingStationQrCode.tenantName ||
          !chargingStationQrCode.endpoint ||
          !chargingStationQrCode.chargingStationID ||
          !chargingStationQrCode.connectorID) {
        Message.showError(I18n.t('qrCode.invalidQRCode'));
        return;
      }
      // Check Endpoint
      const endpointCloud = this.tenantEndpointClouds.find(
        (tenantEndpointCloud) => tenantEndpointCloud.id === chargingStationQrCode.endpoint);
      if (!endpointCloud) {
        Message.showError(I18n.t('qrCode.unknownEndpoint', { endpoint: chargingStationQrCode.endpoint }));
        return;
      }
      // Check Tenant
      const tenant = await this.centralServerProvider.getTenant(chargingStationQrCode.tenantSubDomain);
      // Scanned Tenant is not the current one where the user is logged
      if (chargingStationQrCode.tenantSubDomain !== this.props.currentTenantSubDomain) {
        // User in wrong tenant!
        // Check if the tenant already exists
        if (tenant) {
          // Tenant exists: Propose the user to switch to the existing one and log off
          Alert.alert(
            I18n.t('qrCode.wrongOrganizationTitle'),
            I18n.t('qrCode.wrongOrganizationMessage', { tenantName: tenant.name }),
            [
              { text: I18n.t('general.no'), style: 'cancel' },
              { text: I18n.t('general.yes'), onPress: ()  => this.logoffAndNavigateToLogin(tenant)}
            ],
            { cancelable: false }
          );
          return;
        } else {
          Alert.alert(
            I18n.t('qrCode.unknownOrganizationTitle'),
            I18n.t('qrCode.unknownOrganizationMessage', {tenantName: chargingStationQrCode.tenantName}),
            [
              { text: I18n.t('general.no'), style: 'cancel' },
              { text: I18n.t('general.yes'), onPress: ()  => this.saveTenantAndLogOff(chargingStationQrCode, endpointCloud) }
            ],
            { cancelable: false }
          );
          return;
        }
      }
      // Check Charging Station
      try {
        const chargingStation = await this.centralServerProvider.getChargingStation(
          { ID: chargingStationQrCode.chargingStationID });
        // Check Connector
        const foundConnector = chargingStation.connectors.find(
          (connector: Connector) => connector.connectorId === chargingStationQrCode.connectorID);
        // Check if the Connector exist
        if (!foundConnector) {
          Message.showError(I18n.t('qrCode.unknownConnector', { connectorID: chargingStationQrCode.connectorID }));
          return;
        }
      } catch (error) {
        // Charging Station not found
        Message.showError(I18n.t('qrCode.unknownChargingStation', { chargingStationID: chargingStationQrCode.chargingStationID }));
        return;
      }
      // Ok: Navigate to connector
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
      this.close();
    } catch (error) {
      // Do not display message until we get the right QR Code
    }
  }

  private close() {
    Orientation.unlockAllOrientations();
    this.props.close();
  }

  public render() {
    const { navigation } = this.props;
    return (
      <Container>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('qrCode.scanChargingStationQrCodeTitle')}
          leftAction={() => this.close()}
          leftActionIcon={'navigate-before'}
          hideHomeAction={true}
          rightAction={() => navigation.dispatch(DrawerActions.openDrawer())}
          rightActionIcon={'menu'}
        />
        <QRCodeScanner
          cameraProps={{captureAudio: false}}
          showMarker={true}
          reactivate={true}
          reactivateTimeout={500}
          onRead={(qrCode) => this.checkQrCodeDataAndNavigate(qrCode.data)}/>
      </Container>
    );
  }
}
