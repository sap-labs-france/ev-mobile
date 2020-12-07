import { StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Button, Icon, Text, View } from 'native-base';
import React from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view'
import { TenantConnection } from 'types/Tenant';

import HeaderComponent from '../../../components/header/HeaderComponent';
import BaseProps from '../../../types/BaseProps';
import SecuredStorage from '../../../utils/SecuredStorage';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import computeTenantStyleSheet from '../TenantsStyle';
import CreateTenantDialog from './CreateTenantDialog';
import CreateTenantQrCode from './TenantQrCode';

export interface Props extends BaseProps {
}

interface State {
  tenants?: TenantConnection[]
  createTenantVisible?: boolean
  qrCodeVisible?: boolean
}

export default class Tenants extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      qrCodeVisible: false,
      createTenantVisible: false
    }
  }

  public async componentDidMount() {
    await super.componentDidMount();
    const tenants = await this.centralServerProvider.getTenants();
    this.setState({tenants});
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async selectTenant(tenant: TenantConnection) {
    this.setState({ tenantVisible: false })
    // this.props.onSelect(tenant);
  }

  public createTenant() {
    Alert.alert(
      'Create Tenant',
      'Choose the way you want to create the tenant', [
        { text: 'Qrcode', onPress: () => { this.setState({ qrCodeVisible: true })}},
        { text: 'Manually', onPress: () => { this.setState({ createTenantVisible: true })}}
      ]
    )
  }

  private deleteTenant = async (index: number, subdomain: string) => {
    const tenants = this.state.tenants
    tenants.splice(index, 1);
    // Save
    await SecuredStorage.saveTenants(tenants);
    // Remove cache
    await SecuredStorage.deleteUserCredentials(subdomain);
    this.setState({ tenants });
    // this.props.resetTenantTitleText();
  };

  private restoreTenants = () => {
    Alert.alert(
      I18n.t('general.restoreTenants'),
      I18n.t('general.restoreTenantsConfirm'), [
      { text: I18n.t('general.no'), style: 'cancel' },
      {
        text: I18n.t('general.yes'), onPress: async () => {
          // Remove from list and Save
          const tenants= this.centralServerProvider.getInitialTenants();
          // Save
          await SecuredStorage.saveTenants(tenants);
          this.setState({ tenants });
          // this.props.resetTenantTitleText();
        }
      }],
    );
  }

  public render() {
    const navigation = this.props.navigation
    const {tenants, createTenantVisible, qrCodeVisible} = this.state
    const tenantStyle = computeTenantStyleSheet();
    return (
      <View style={{flex: 1}}>
        {qrCodeVisible ? (
          <CreateTenantQrCode tenants={this.state.tenants} navigation={navigation}
            close={async (tenant: TenantConnection) => {
              this.setState({qrCodeVisible: false});
              // Set
              // await this.selectTenant(tenant);
              // // Check auto login
              // await this.checkAutoLogin(tenant, this.state.email, this.state.password);
            }}
          />
        ) : (
          <View style={tenantStyle.container}>
            <HeaderComponent
              navigation={this.props.navigation}
              title={I18n.t('authentication.tenant')}
              rightActionIcon={null}
              hideHomeAction={true}
              leftActionIcon='navigate-before'
              leftActionIconType='MaterialIcons'
              leftAction={() => this.props.navigation.goBack()}
            />
            <View>
              <View style={tenantStyle.toolBar}>
                <Button style={tenantStyle.restoreTenantButton} transparent={true} onPress={() => this.restoreTenants()}>
                  <Icon style={tenantStyle.icon} type={'MaterialIcons'} name='settings-backup-restore'/>
                </Button>
                <Button style={tenantStyle.createTenantButton} transparent={true} onPress={() => this.createTenant()}>
                  <Icon style={tenantStyle.icon} type={'MaterialIcons'} name='add'/>
                </Button>
                {createTenantVisible &&
                  <CreateTenantDialog navigation={navigation} tenants={this.state.tenants}
                    close={(newTenant: TenantConnection) => {
                      this.setState({ createTenantVisible: false });
                      if (newTenant) {
                        this.selectTenant(newTenant);
                      }
                    }
                  }/>
                }
              </View>
              <SwipeListView
                disableRightSwipe={true}
                useFlatList={true}
                data={tenants}
                renderItem={({ item }) => (
                  <View style={tenantStyle.tenantNameView}>
                    <TouchableOpacity onPress={() => {
                      this.props.navigation.dispatch(
                        StackActions.replace(
                          'AuthNavigator', {
                            name: 'Login',
                            params: {
                              tenantNameSelected: item.name,
                              tenantSubdomainSelected: item.subdomain,
                              tenantEndpointSelected: item.endpoint
                            },
                            key: `${Utils.randomNumber()}`,
                          }
                        ),
                      );
                    }}>
                      <Text style={tenantStyle.tenantNameText}>{item.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                renderHiddenItem={({ item, index }) => (
                  <Button style={tenantStyle.trashIconButton} danger={true} onPress={() => {this.deleteTenant(index, item.subdomain) }}>
                    <Icon style={tenantStyle.icon} name='trash'/>
                  </Button>
                )}
                rightOpenValue={-65}
                keyExtractor={(item) => item.subdomain}
              />
            </View>
          </View>
        )}
      </View>
    );
  }
}
