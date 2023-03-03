import { StackActions } from '@react-navigation/native';
import base64 from 'base-64';
import I18n from 'i18n-js';
import React from 'react';
import { Alert, View } from 'react-native';
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
import Configuration from '../../config/Configuration';

export interface Props extends BaseProps {
  currentTenantSubDomain: string;
  tenants: TenantConnection[];
  close: () => boolean;
}

interface State {
  activateQrCode?: boolean;
}

export default class ChargingStationQrCode extends BaseScreen<State, Props> {
  public state: State;
  public props: Props;
  private tenantEndpointClouds: EndpointCloud[];
  private currentTenant: TenantConnection;

  public constructor(props: Props) {
    super(props);
    this.state = {
      activateQrCode: true
    };
    this.tenantEndpointClouds = Configuration.getEndpoints();
  }

  public async componentDidMount() {
    await super.componentDidMount();
    this.currentTenant = this.centralServerProvider?.getUserTenant();
    Orientation.lockToPortrait();
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async logoffAndNavigateToLogin(tenant: TenantConnection) {
    // Logoff
    await this.centralServerProvider.logoff();
    // Navigate to login
    this.props.navigation.dispatch(
      StackActions.replace('AuthNavigator', {
        name: 'Login',
        params: {
          tenantSubDomain: tenant.subdomain
        },
        key: `${Utils.randomNumber()}`
      })
    );
  }

  public async saveTenantAndLogOff(chargingStationQRCode: ChargingStationQRCode, newTenantEndpointCloud: EndpointCloud) {
    // Create new tenant
    const newTenant: TenantConnection = {
      subdomain: chargingStationQRCode.tenantSubDomain,
      name: chargingStationQRCode.tenantName,
      endpoint: newTenantEndpointCloud.endpoint
    };
    const tenants = await this.centralServerProvider?.getTenants();
    // Add to existing list
    tenants.push(newTenant);
    // Save
    await SecuredStorage.saveTenants(tenants);
    // Navigate to login
    await this.logoffAndNavigateToLogin(newTenant);
  }

  public async checkQrCodeDataAndNavigate(qrCodeData: string): Promise<void> {
    try {
      // Decode
      const decodedQrCodeData = base64.decode(qrCodeData);
      // Parse
      const chargingStationQrCode = JSON.parse(decodedQrCodeData) as ChargingStationQRCode;
      // Check mandatory props
      if (
        !chargingStationQrCode. tenantSubDomain ||
        !chargingStationQrCode.tenantName ||
        !chargingStationQrCode.endpoint ||
        !chargingStationQrCode.chargingStationID ||
        !chargingStationQrCode.connectorID
      ) {
        Message.showError(I18n.t('qrCode.invalidQRCode'));
        return;
      }
      // Check Endpoint
      const endpointCloud = this.tenantEndpointClouds.find(
        (tenantEndpointCloud) => tenantEndpointCloud.id === chargingStationQrCode.endpoint
      );
      if (!endpointCloud) {
        Message.showError(I18n.t('qrCode.unknownEndpoint', { endpoint: chargingStationQrCode.endpoint }));
        return;
      }
      // Check Tenant
      const tenant = await this.centralServerProvider.getTenant(chargingStationQrCode.tenantSubDomain);
      // Scanned Tenant is not the current one where the user is logged
      if (chargingStationQrCode.tenantSubDomain !== this.currentTenant?.subdomain) {
        // User in wrong tenant!
        // Check if the tenant already exists
        if (tenant) {
          // Tenant exists: Propose the user to switch to the existing one and log off
          this.setState(
            {
              activateQrCode: false
            },
            () => {
              Alert.alert(
                I18n.t('qrCode.wrongOrganizationTitle'),
                I18n.t('qrCode.wrongOrganizationMessage', { tenantName: tenant.name }),
                [
                  { text: I18n.t('general.no'), style: 'cancel', onPress: () => this.setState({ activateQrCode: true }) },
                  { text: I18n.t('general.yes'), onPress: async () => this.logoffAndNavigateToLogin(tenant) }
                ],
                { cancelable: false }
              );
            }
          );
        } else {
          this.setState(
            {
              activateQrCode: false
            },
            () => {
              Alert.alert(
                I18n.t('qrCode.unknownOrganizationTitle'),
                I18n.t('qrCode.unknownOrganizationMessage', { tenantName: chargingStationQrCode.tenantName }),
                [
                  { text: I18n.t('general.no'), style: 'cancel', onPress: () => this.setState({ activateQrCode: true }) },
                  { text: I18n.t('general.yes'), onPress: async () => this.saveTenantAndLogOff(chargingStationQrCode, endpointCloud) }
                ],
                { cancelable: false }
              );
            }
          );
        }
        return;
      }
      // Check Charging Station
      try {
        const chargingStation = await this.centralServerProvider.getChargingStation(chargingStationQrCode.chargingStationID);
        // Check Connector
        const foundConnector = chargingStation.connectors.find(
          (connector: Connector) => connector.connectorId === chargingStationQrCode.connectorID
        );
        // Check if the Connector exist
        if (!foundConnector) {
          Message.showError(I18n.t('qrCode.unknownConnector', { connectorID: chargingStationQrCode.connectorID }));
          return;
        }
      } catch (error) {
        // Charging Station not found
        Message.showError(I18n.t('qrCode.unknownChargingStation', { chargingStationID: chargingStationQrCode.chargingStationID }));
        return;
      }
      // Ok: Navigate to connector
      this.props.navigation.navigate('ChargingStationConnectorDetailsTabs', {
        key: `${Utils.randomNumber()}`,
        params: {
          params: {
            chargingStationID: chargingStationQrCode.chargingStationID,
            connectorID: chargingStationQrCode.connectorID,
            startTransaction: true
          }
        }
      });
      this.close();
    } catch (error) {
      // Do not display message until we get the right QR Code
    }
  }

  public render() {
    const { activateQrCode } = this.state;
    const commonColor = Utils.getCurrentCommonColor();
    return (
      <View>
        <HeaderComponent
          navigation={this.props.navigation}
          title={I18n.t('qrCode.scanChargingStationQrCodeTitle')}
          backArrow={true}
        />
       {activateQrCode && (
          <QRCodeScanner
            cameraProps={{ captureAudio: false }}
            markerStyle={{borderColor: commonColor.primaryLight}}
            showMarker
            containerStyle={{height: '100%', alignItems: 'center', justifyContent: 'center'}}
            reactivate
            reactivateTimeout={1000}
            onRead={async (qrCode) => this.checkQrCodeDataAndNavigate(qrCode.data)}
          />
        )}
      </View>
    );
  }

  private close() {
    Orientation.unlockAllOrientations();
    this.props.close();
  }
}
