import I18n from 'i18n-js';
import { Icon, Spinner } from 'native-base';
import React from 'react';
import { FlatList, RefreshControl, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { EndpointCloud, TenantConnection } from '../../types/Tenant';

import HeaderComponent from '../../components/header/HeaderComponent';
import BaseProps from '../../types/BaseProps';
import Message from '../../utils/Message';
import SecuredStorage from '../../utils/SecuredStorage';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import AddEditTenantDialog, { TenantDialogMode } from '../../components/modal/tenants/AddEditTenantDialog';
import computeTenantStyleSheet from './TenantsStyle';
import DialogModal from '../../components/modal/DialogModal';
import TenantComponent from '../../components/tenant/TenantComponent';
import computeFabStyles from '../../components/fab/FabComponentStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

interface State {
  tenants?: TenantConnection[];
  showAddTenantManuallyDialog?: boolean;
  tenantToBeEditedIndex?: number;
  showAddTenantDialog?: boolean;
  newTenant?: TenantConnection;
  loading?: boolean;
  refreshing?: boolean;
}

export default class Tenants extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      showAddTenantManuallyDialog: false,
      tenantToBeEditedIndex: null,
      showAddTenantDialog: false,
      newTenant: null,
      tenants: [],
      loading: true
    };
  }

  public async componentDidMount() {
    await super.componentDidMount();
    const showAddTenantWithQRCode = Utils.getParamFromNavigation(this.props.route, 'openQRCode', false);
    if (showAddTenantWithQRCode) {
       this.openQrCodeScanner();
    } else {
      this.refreshTenants(true);
    }
  }

  public async componentDidFocus() {
    await super.componentDidFocus();
    const newTenantSubdomain = Utils.getParamFromNavigation(this.props.route, 'newTenantSubdomain', null, true);
    if (newTenantSubdomain) {
      const tenants = await this.getTenants();
      this.setState({newTenant: tenants.find(e => e.subdomain === newTenantSubdomain) });
    }
    this.refreshTenants(true);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  private openQrCodeScanner(): void {
    this.props.navigation.navigate('TenantQrCode');
  }

  private async refreshTenants(showSpinner = false): Promise<void> {
    const newState = showSpinner ? (Utils.isEmptyArray(this.state.tenants) ? {loading: true} : {refreshing: true}) : this.state;
    this.setState(newState, async () => {
      const tenants = await this.getTenants();
      this.setState({tenants, loading: false, refreshing: false});
    } );
  }

  private async getTenants(): Promise<TenantConnection[]> {
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
      showAddTenantDialog,
      newTenant,
      tenantToBeEditedIndex,
      loading,
      refreshing
    } = this.state;
    const style = computeTenantStyleSheet();
    const fabStyles = computeFabStyles();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={{ flex: 1 }}>
        {showAddTenantDialog && this.renderAddTenantDialog(style)}
        {newTenant && this.renderNewTenantAddedDialog(style)}
        {tenantToBeEditedIndex !== null && this.renderEditTenantDialog(style)}
        <View style={style.container}>
          <SafeAreaView style={fabStyles.fabContainer}>
            <TouchableOpacity delayPressIn={0} onPress={() => this.setState({ showAddTenantDialog: true })} style={fabStyles.fab}>
              <Icon size={scale(18)} as={MaterialCommunityIcons} name={'plus'} style={fabStyles.fabIcon} />
            </TouchableOpacity>
          </SafeAreaView>
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
            backAction={() => this.onBack()}
            sideBar={false}
            containerStyle={style.headerContainer}
          />
          {loading ? <Spinner style={style.spinner} color={commonColors.disabledDark} /> : (
            <View style={style.listContainer}>
              <FlatList
                data={tenants}
                refreshControl={<RefreshControl onRefresh={() => this.refreshTenants(true)} refreshing={refreshing} />}
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
          )}
        </View>
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
          <Icon size={scale(20)} as={MaterialCommunityIcons} style={style.actionIcon} name="trash-can" />
        </TouchableOpacity>
        <TouchableOpacity style={style.editIconButton} onPress={() => this.setState({ tenantToBeEditedIndex: index })}>
          <Icon size={scale(20)} style={style.actionIcon} name="edit" as={MaterialIcons} />
        </TouchableOpacity>
      </View>
    );
  }

  private renderAddTenantDialog(style: any) {
    return (
      <DialogModal
        animationIn={'fadeInLeft'}
        title={I18n.t('authentication.addTenantTitle')}
        renderIcon={(iconStyle) => <Icon size={scale(iconStyle.fontSize)} style={iconStyle} as={MaterialIcons} name={'add-business'} />}
        description={I18n.t('authentication.addTenantText')}
        close={() => this.setState({ showAddTenantDialog: false })}
        withCancel={true}
        withCloseButton={true}
        buttons={[
          {
            text: I18n.t('qrCode.qrCode'),
            action: () => this.setState({ showAddTenantDialog: false }, () => this.openQrCodeScanner()),
            buttonTextStyle: style.modalPrimaryButtonText,
            buttonStyle: style.modalPrimaryButton
          },
          {
            text: I18n.t('general.manually'),
            action: () => this.setState({ showAddTenantManuallyDialog: true, showAddTenantDialog: false }),
            buttonTextStyle: style.modalPrimaryButtonText,
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
        close={() => this.setState({ newTenant: null })}
        buttons={[
          {
            text: I18n.t('authentication.signUp'),
            buttonTextStyle: style.modalPrimaryButtonText,
            buttonStyle: style.modalPrimaryButton,
            action: () =>
              this.setState({ newTenant: null }, () =>
                navigation.navigate('SignUp', { tenantSubDomain: newTenant?.subdomain })
              )
          },
          {
            text: I18n.t('authentication.signIn'),
            buttonTextStyle: style.modalPrimaryButtonText,
            buttonStyle: style.modalPrimaryButton,
            action: () =>
              this.setState({ newTenant: null }, () =>
                navigation.navigate('Login', { tenantSubDomain: newTenant?.subdomain })
              )
          }
        ]}
      />
    );
  }

  private async addEditTenantDialogClosed(newTenant?: TenantConnection): Promise<void> {
    // Always close pop-up
    const tenants = await this.getTenants();
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
