import { StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { Alert, FlatList, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TenantConnection } from 'types/Tenant';

import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import Message from '../../utils/Message';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import CreateTenantDialog from './CreateTenantDialog';
import CreateTenantQrCode from './TenantQrCode';
import computeTenantStyleSheet from './TenantsStyle';
import DialogModal from '../../components/modal/DialogModal';

export interface Props extends BaseProps {}

interface State {
  tenants?: TenantConnection[];
  createTenantVisible?: boolean;
  createQrCodeTenantVisible?: boolean;
  showCreateTenantDialog?: boolean;
}

export default class Tenants extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      createQrCodeTenantVisible: false,
      createTenantVisible: false,
      showCreateTenantDialog: false
    };
  }

  public async componentDidMount() {
    await super.componentDidMount();
    const tenants = await this.centralServerProvider.getTenants();
    const createQrCodeTenantVisible = Utils.getParamFromNavigation(this.props.route, 'openQRCode', this.state.createQrCodeTenantVisible);
    this.setState({
      tenants,
      createQrCodeTenantVisible
    });
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const navigation = this.props.navigation;
    const { tenants, createTenantVisible, createQrCodeTenantVisible, showCreateTenantDialog } = this.state;
    const style = computeTenantStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    return (
      <View style={{ flex: 1 }}>
        {showCreateTenantDialog && (
          <DialogModal
            title={I18n.t('authentication.createTenantTitle')}
            renderIcon={(iconStyle) => <Icon style={iconStyle} type={'MaterialIcons'} name={'business'} />}
            description={I18n.t('authentication.createTenantText')}
            close={() => this.setState({ showCreateTenantDialog: false })}
            withCancel={true}
            withCloseButton={true}
            buttons={[
              {
                text: I18n.t('qrCode.qrCode'),
                action: () => this.setState({ createQrCodeTenantVisible: true, showCreateTenantDialog: false }),
                buttonTextStyle: { color: commonColor.light },
                buttonStyle: { backgroundColor: commonColor.primary, borderColor: commonColor.primary }
              },
              {
                text: I18n.t('general.manually'),
                action: () => this.setState({ createTenantVisible: true, showCreateTenantDialog: false }),
                buttonTextStyle: { color: commonColor.light },
                buttonStyle: { backgroundColor: commonColor.primary, borderColor: commonColor.primary }
              }
            ]}
          />
        )}
        {createQrCodeTenantVisible ? (
          <CreateTenantQrCode
            tenants={Utils.cloneObject(this.state.tenants)}
            navigation={navigation}
            close={(tenant: TenantConnection) => {
              this.tenantCreated(tenant);
              return true;
            }}
          />
        ) : (
          <View style={style.container}>
            <HeaderComponent
              navigation={this.props.navigation}
              title={I18n.t('authentication.tenant')}
              rightActionIcon={null}
              hideHomeAction
              leftActionIcon="navigate-before"
              leftActionIconType="MaterialIcons"
              leftAction={() => {
                this.props.navigation.goBack();
                return true;
              }}
            />
            <View>
              <View style={style.toolBar}>
                <TouchableOpacity style={style.createTenantButton} onPress={() => this.setState({ showCreateTenantDialog: true})}>
                  <Icon style={style.icon} type={'MaterialIcons'} name="add" />
                </TouchableOpacity>
                {createTenantVisible && (
                  <CreateTenantDialog
                    navigation={navigation}
                    tenants={Utils.cloneObject(this.state.tenants)}
                    close={(newTenant: TenantConnection) => {
                      this.tenantCreated(newTenant);
                    }}
                  />
                )}
              </View>
              <FlatList
                data={tenants}
                keyExtractor={(item) => item.subdomain}
                renderItem={({ item, index }) => (
                  <Swipeable
                    overshootRight={false}
                    overshootLeft={false}
                    containerStyle={style.tenantContainer}
                    childrenContainerStyle={style.tenantNameContainer}
                    renderRightActions={() => (
                      <TouchableOpacity
                        style={style.trashIconButton}
                        onPress={() => {
                          this.deleteTenant(index, item.subdomain);
                        }}>
                        <Icon style={style.trashIcon} name="trash" />
                      </TouchableOpacity>
                    )}>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.dispatch(
                          StackActions.replace('AuthNavigator', {
                            name: 'Login',
                            params: {
                              tenantSubDomain: item.subdomain
                            },
                            key: `${Utils.randomNumber()}`
                          })
                        );
                      }}>
                      <Text style={style.tenantNameText}>{item.name}</Text>
                    </TouchableOpacity>
                  </Swipeable>
                )}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  private tenantCreated = async (newTenant: TenantConnection) => {
    const navigation = this.props.navigation;
    // Always close pop-up
    this.setState({
      createQrCodeTenantVisible: false,
      createTenantVisible: false
    });
    if (newTenant) {
      const foundTenant = this.state.tenants.find((tenant: TenantConnection) => tenant.subdomain === newTenant.subdomain);
      if (foundTenant) {
        // Tenant already exists
        Message.showInfo(I18n.t('general.tenantExists', { tenantName: foundTenant.name }));
      } else {
        // Refresh
        const tenants = await this.centralServerProvider.getTenants();
        this.setState({
          tenants
        });
        Message.showSuccess(I18n.t('general.createTenantSuccess', { tenantName: newTenant.name }));
        Alert.alert(I18n.t('general.registerToNewTenantTitle'), I18n.t('general.registerToNewTenant', { tenantName: newTenant.name }), [
          {
            text: I18n.t('authentication.signUp'),
            onPress: () => {
              navigation.navigate('SignUp', {
                tenantSubDomain: newTenant.subdomain
              });
            }
          },
          {
            text: I18n.t('authentication.signIn'),
            style: 'cancel',
            onPress: () => {
              navigation.navigate('Login', {
                tenantSubDomain: newTenant.subdomain
              });
            }
          },
          { text: I18n.t('general.close'), style: 'cancel' }
        ]);
      }
    }
  };

  private deleteTenant = async (index: number, subdomain: string) => {
    const tenants = this.state.tenants;
    // Remove
    const tenant = tenants.splice(index, 1)[0];
    // Save
    await SecuredStorage.saveTenants(tenants);
    // Remove cache
    await SecuredStorage.deleteUserCredentials(subdomain);
    this.setState({ tenants });
    Message.showSuccess(I18n.t('general.deleteTenantSuccess', { tenantName: tenant.name }));
  };
}
