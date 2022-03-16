import I18n from 'i18n-js';
import { Icon, View } from 'native-base';
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { EndpointCloud, TenantConnection } from '../../types/Tenant';

import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import Message from '../../utils/Message';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import AddEditTenantDialog, { TenantDialogMode } from '../../components/modal/tenants/AddEditTenantDialog';
import CreateTenantQrCode from './TenantQrCode';
import computeTenantStyleSheet from './TenantsStyle';
import DialogModal from '../../components/modal/DialogModal';
import TenantComponent from '../../components/tenant/TenantComponent';
import computeFabStyles from '../../components/fab/FabComponentStyles';

export interface Props extends BaseProps {}

interface State {
  tenants?: TenantConnection[];
  showAddTenantManuallyDialog?: boolean;
  showAddTenantWithQRCode?: boolean;
  tenantToBeEditedIndex?: number;
  showAddTenantDialog?: boolean;
  showNewTenantAddedDialog?: boolean;
  newTenant?: TenantConnection;
}

export default class Tenants extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      showAddTenantWithQRCode: false,
      showAddTenantManuallyDialog: false,
      tenantToBeEditedIndex: null,
      showAddTenantDialog: false,
      showNewTenantAddedDialog: false,
      newTenant: null,
      tenants: []
    };
  }

  public async componentDidMount() {
    await super.componentDidMount();
    const tenants = await this.refreshTenants();
    const showAddTenantWithQRCode = Utils.getParamFromNavigation(this.props.route, 'openQRCode', this.state.showAddTenantWithQRCode);
    this.setState({
      showAddTenantWithQRCode,
      tenants
    });
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  private async refreshTenants(): Promise<TenantConnection[]> {
    const tenants = await SecuredStorage.getTenants();
    // Check tenants endpoints exist and set them to empty object if not
    const allEndpoints = await Utils.getEndpointClouds();
    const endpointNames = allEndpoints.map(endpoint => endpoint.name);
    tenants.forEach(tenant => {
      if (!endpointNames.includes(tenant.endpoint?.name)) {
        tenant.endpoint = {} as EndpointCloud;
      }});
    await SecuredStorage.saveTenants(tenants);
    return tenants;
  }

  public render() {
    const navigation = this.props.navigation;
    const {
      tenants,
      showAddTenantManuallyDialog,
      showAddTenantWithQRCode,
      showAddTenantDialog,
      showNewTenantAddedDialog,
      tenantToBeEditedIndex
    } = this.state;
    const style = computeTenantStyleSheet();
    const fabStyles = computeFabStyles();
    return (
      <View style={{ flex: 1 }}>
        {showAddTenantDialog && this.renderAddTenantDialog(style)}
        {showNewTenantAddedDialog && this.renderNewTenantAddedDialog(style)}
        {tenantToBeEditedIndex !== null && this.renderEditTenantDialog(style)}
        {showAddTenantWithQRCode ? (
          <CreateTenantQrCode
            tenants={Utils.cloneObject(this.state.tenants)}
            navigation={navigation}
            close={(tenant: TenantConnection) => {
              this.addEditTenantDialogClosed(tenant);
              return true;
            }}
          />
        ) : (
          <View style={style.container}>
            <TouchableOpacity delayPressIn={0} onPress={() => this.setState({ showAddTenantDialog: true })} style={[fabStyles.fab, fabStyles.placedFab]}>
              <Icon type={'MaterialCommunityIcons'} name={'plus'} style={fabStyles.fabIcon} />
            </TouchableOpacity>
            {showAddTenantManuallyDialog && (
              <AddEditTenantDialog
                mode={TenantDialogMode.ADD}
                navigation={navigation}
                tenants={Utils.cloneObject(this.state.tenants)}
                back={() => this.setState({ showAddTenantManuallyDialog: false, showAddTenantDialog: true })}
                close={(newTenantAdded: TenantConnection) => {
                  this.addEditTenantDialogClosed(newTenantAdded);
                }}
              />
            )}
            <HeaderComponent
              navigation={this.props.navigation}
              title={I18n.t('general.tenants')}
              sideBar={false}
            />
            <View style={style.listContainer}>
              <FlatList
                data={tenants}
                keyExtractor={(item) => `${item.subdomain}${item.endpoint?.name}`}
                renderItem={({ item, index }) => (
                  <Swipeable
                    overshootRight={false}
                    overshootLeft={false}
                    containerStyle={style.tenantContainer}
                    childrenContainerStyle={style.tenantNameContainer}
                    renderRightActions={() => this.renderTenantRightActions(index, item, style)}>
                    <TenantComponent tenant={item} navigation={navigation} />
                  </Swipeable>
                )}
              />
            </View>
          </View>
        )}
      </View>
    );
  }

  private renderTenantRightActions(index: number, tenant: TenantConnection, style: any) {
    return (
      <View style={style.rightActionsContainer}>
        <TouchableOpacity
          style={style.trashIconButton}
          onPress={() => {
            this.deleteTenant(index, tenant.subdomain);
          }}>
          <Icon style={style.actionIcon} name="trash" />
        </TouchableOpacity>
        <TouchableOpacity style={style.editIconButton} onPress={() => this.setState({ tenantToBeEditedIndex: index })}>
          <Icon style={style.actionIcon} name="edit" type={'MaterialIcons'} />
        </TouchableOpacity>
      </View>
    );
  }

  private renderAddTenantDialog(style: any) {
    return (
      <DialogModal
        animationIn={'fadeInLeft'}
        title={I18n.t('authentication.addTenantTitle')}
        renderIcon={(iconStyle) => <Icon style={iconStyle} type={'MaterialIcons'} name={'add-business'} />}
        description={I18n.t('authentication.addTenantText')}
        close={() => this.setState({ showAddTenantDialog: false })}
        withCancel={true}
        withCloseButton={true}
        buttons={[
          {
            text: I18n.t('qrCode.qrCode'),
            action: () => this.setState({ showAddTenantWithQRCode: true, showAddTenantDialog: false }),
            buttonTextStyle: style.modalPrimaryButton,
            buttonStyle: style.modalPrimaryButton
          },
          {
            text: I18n.t('general.manually'),
            action: () => this.setState({ showAddTenantManuallyDialog: true, showAddTenantDialog: false }),
            buttonTextStyle: style.modalPrimaryButton,
            buttonStyle: style.modalPrimaryButton
          }
        ]}
      />
    );
  }

  private renderEditTenantDialog(style: any) {
    return (
      <AddEditTenantDialog
        mode={TenantDialogMode.EDIT}
        withCancel={true}
        navigation={this.props.navigation}
        tenantIndex={this.state.tenantToBeEditedIndex}
        tenants={Utils.cloneObject(this.state.tenants)}
        back={() => this.setState({ tenantToBeEditedIndex: null })}
        close={(newTenantCreated: TenantConnection) => {
          this.addEditTenantDialogClosed(null);
        }}
      />
    );
  }

  private renderNewTenantAddedDialog(style: any) {
    const { newTenant } = this.state;
    const { navigation } = this.props;
    return (
      <DialogModal
        title={I18n.t('general.newTenantAddedDialogTitle', { organizationName: newTenant?.name })}
        description={I18n.t('general.newTenantAddedDialogDescription', { tenantName: newTenant?.name })}
        withCloseButton={true}
        withCancel={true}
        animationIn={'fadeInLeft'}
        cancelButtonText={I18n.t('general.close')}
        close={() => this.setState({ showNewTenantAddedDialog: false })}
        buttons={[
          {
            text: I18n.t('authentication.signUp'),
            buttonTextStyle: style.modalPrimaryButton,
            buttonStyle: style.modalPrimaryButton,
            action: () =>
              this.setState({ showNewTenantAddedDialog: false }, () =>
                navigation.navigate('SignUp', { tenantSubDomain: newTenant?.subdomain })
              )
          },
          {
            text: I18n.t('authentication.signIn'),
            buttonTextStyle: style.modalPrimaryButton,
            buttonStyle: style.modalPrimaryButton,
            action: () =>
              this.setState({ showNewTenantAddedDialog: false }, () =>
                navigation.navigate('Login', { tenantSubDomain: newTenant?.subdomain })
              )
          }
        ]}
      />
    );
  }

  private async addEditTenantDialogClosed(newTenant?: TenantConnection): Promise<void> {
    // Always close pop-up
    const tenants = await this.refreshTenants();
    this.setState({
      showAddTenantWithQRCode: false,
      showAddTenantManuallyDialog: false,
      tenantToBeEditedIndex: null,
      showNewTenantAddedDialog: !!newTenant,
      newTenant,
      tenants
    });
  }

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
