import { StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import moment from 'moment';
import { Icon, HStack, View } from 'native-base';
import React from 'react';
import { Image, ImageStyle, SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';
import { CheckVersionResponse } from 'react-native-check-version';
import DeviceInfo from 'react-native-device-info';

import AppUpdateDialog from '../../components/modal/app-update/AppUpdateDialog';
import UserAvatar from '../../components/user/avatar/UserAvatar';
import BaseProps from '../../types/BaseProps';
import User from '../../types/User';
import UserToken from '../../types/UserToken';
import Utils from '../../utils/Utils';
import computeStyleSheet from './SideBarStyles';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import SecurityProvider from '../../provider/SecurityProvider';

export interface Props extends BaseProps {}

interface State {
  userToken?: UserToken;
  tenantName?: string;
  isComponentOrganizationActive?: boolean;
  updateDate?: string;
  showAppUpdateDialog?: boolean;
  appVersion?: CheckVersionResponse;
  tenantLogo?: string;
}

export default class SideBar extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private centralServerProvider: CentralServerProvider;
  private securityProvider: SecurityProvider;
  private componentFocusUnsubscribe: () => void;
  private componentBlurUnsubscribe: () => void;

  public constructor(props: Props) {
    super(props);
   // this.componentFocusUnsubscribe = this.props.navigation?.addListener('focus', () => this.componentDidFocus());
   // this.componentBlurUnsubscribe = this.props.navigation?.addListener('blur', () => this.componentDidFocus());
    this.state = {
      userToken: null,
      tenantName: '',
      isComponentOrganizationActive: false,
      updateDate: '',
      showAppUpdateDialog: false,
      appVersion: null
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount(): Promise<void> {
    this.centralServerProvider = await ProviderFactory.getProvider();
    this.securityProvider = this.centralServerProvider?.getSecurityProvider();
    await this.getUpdateDate();
    const tenantLogo = await this.centralServerProvider.getCurrentTenantLogo();
    await this.getUserInfo();
    const appVersion = await Utils.checkForUpdate();
    this.setState({ appVersion, tenantLogo });
    // Init User (delay it)
  }

  public componentWillUnmount(): void {
    this.componentFocusUnsubscribe?.();
    this.componentBlurUnsubscribe?.();
  }

  public async getUpdateDate() {
    const lastUpdateTime = await DeviceInfo.getLastUpdateTime();
    this.setState({ updateDate: lastUpdateTime && lastUpdateTime !== -1 && moment(lastUpdateTime).format('LL') });
  }

  public getUserInfo = async () => {
    // Logoff
    const userInfo = this.centralServerProvider.getUserInfo();
    this.setState({
      userToken: this.centralServerProvider.getUserInfo(),
      isComponentOrganizationActive: this.securityProvider ? this.securityProvider.isComponentOrganizationActive() : false,
      tenantName: userInfo.tenantName
    });
  };

  public async logoff() {
    const userTenant = this.centralServerProvider.getUserTenant();
    // Logoff
    this.centralServerProvider.setAutoLoginDisabled(true);
    await this.centralServerProvider.logoff();
    // Navigate to login
    this.props.navigation.dispatch(
      StackActions.replace('AuthNavigator', {
        name: 'Login',
        key: `${Utils.randomNumber()}`,
        params: {
          tenantSubDomain: userTenant.subdomain
        }
      })
    );
  }

  public navigateTo = (container: string, screen: string, params?: {}) => {
    // Navigate
    this.props.navigation.navigate(container, { screen, params, key: Utils.randomNumber().toString() });
  };

  public render() {
    const style = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { userToken, tenantName, isComponentOrganizationActive, showAppUpdateDialog, appVersion, tenantLogo } = this.state;
    const user = { firstName: userToken?.firstName, name: userToken?.name, id: userToken?.id } as User;
    // Get logo
    return (
      <SafeAreaView style={style.sidebar}>
        <View style={style.header}>
          {tenantLogo && <Image source={{ uri: tenantLogo }} style={style.logo as ImageStyle} />}
          <Text numberOfLines={1} style={style.tenantName}>
            {tenantName}
          </Text>
          <TouchableOpacity
            disabled={!appVersion?.needsUpdate}
            onPress={() => this.setState({ showAppUpdateDialog: true })}
            style={style.versionContainer}>
            <Text style={style.versionText}>{`${I18n.t('general.version')} ${DeviceInfo.getVersion()}`}</Text>
            {appVersion?.needsUpdate && (
              <View style={style.newVersionContainer}>
                <Icon style={style.newVersionIcon} type={'MaterialIcons'} name={'update'} />
                <Text style={style.newVersionText}>{I18n.t('appUpdate.appUpdateDialogTitle')}</Text>
              </View>
            )}
          </TouchableOpacity>
          {showAppUpdateDialog && <AppUpdateDialog appVersion={appVersion} close={() => this.setState({ showAppUpdateDialog: false })} />}
        </View>
        <View style={style.border} />
        <ScrollView style={style.drawerContent}>
          <View style={style.linkContainer}>
            <HStack style={style.links} button iconLeft onPress={() => this.props.navigation.navigate('QRCodeScanner')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="qr-code-scanner" />
              <Text style={style.linkText}>{I18n.t('sidebar.qrCodeScanner')}</Text>
            </HStack>
            {isComponentOrganizationActive && (
              <HStack style={style.links} button iconLeft onPress={() => this.navigateTo('SitesNavigator', 'Sites')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="store-mall-directory" />
                <Text style={style.linkText}>{I18n.t('sidebar.sites')}</Text>
              </HStack>
            )}
            <HStack style={[style.links]} button iconLeft onPress={() => this.navigateTo('ChargingStationsNavigator', 'ChargingStations')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="ev-station" />
              <Text style={style.linkText}>{I18n.t('sidebar.chargers')}</Text>
            </HStack>
            <HStack
              style={style.links}
              button
              iconLeft
              onPress={() => this.navigateTo('TransactionHistoryNavigator', 'TransactionsHistory')}>
              <Icon style={style.linkIcon} type="MaterialCommunityIcons" name="history" />
              <Text style={style.linkText}>{I18n.t('sidebar.transactionsHistory')}</Text>
            </HStack>
            <HStack
              style={style.links}
              button
              iconLeft
              onPress={() => this.navigateTo('TransactionInProgressNavigator', 'TransactionsInProgress')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="play-arrow" />
              <Text style={style.linkText}>{I18n.t('sidebar.transactionsInProgress')}</Text>
            </HStack>
            <HStack style={style.links} button iconLeft onPress={() => this.navigateTo('StatisticsNavigator', 'Statistics')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="assessment" />
              <Text style={style.linkText}>{I18n.t('sidebar.statistics')}</Text>
            </HStack>
            {this.securityProvider?.canListUsers() && (
              <HStack style={style.links} button iconLeft onPress={() => this.navigateTo('UsersNavigator', 'Users')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="people" />
                <Text style={style.linkText}>{I18n.t('sidebar.users')}</Text>
              </HStack>
            )}
            {this.securityProvider?.canListTags() && (
              <HStack style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('TagsNavigator', 'Tags')}>
                <Icon style={style.linkIcon} type="MaterialCommunityIcons" name="credit-card" />
                <Text style={style.linkText}>{I18n.t('sidebar.badges')}</Text>
              </HStack>
            )}
            {this.securityProvider?.canListCars() && this.securityProvider?.isComponentCarActive() && (
              <HStack style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('CarsNavigator', 'Cars')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="directions-car" />
                <Text style={style.linkText}>{I18n.t('sidebar.cars')}</Text>
              </HStack>
            )}
            {this.securityProvider?.canListPaymentMethods() && this.securityProvider?.isComponentBillingActive() && (
              <HStack
                style={style.links}
                button={true}
                iconLeft={true}
                onPress={() => this.navigateTo('PaymentMethodsNavigator', 'PaymentMethods')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="payments" />
                <Text style={style.linkText}>{I18n.t('sidebar.paymentMethods')}</Text>
              </HStack>
            )}
            {this.securityProvider?.canListInvoices() && this.securityProvider?.isComponentBillingActive() && (
              <HStack style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('InvoicesNavigator', 'Invoices')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="receipt" />
                <Text style={style.linkText}>{I18n.t('sidebar.invoices')}</Text>
              </HStack>
            )}
            <HStack
              style={style.links}
              button={true}
              iconLeft={true}
              onPress={() => this.navigateTo('ReportErrorNavigator', 'ReportError')}>
              <Icon style={[style.linkIcon, { color: commonColor.dangerLight }]} type="MaterialIcons" name="error-outline" />
              <Text style={[style.linkText, { color: commonColor.dangerLight }]}>{I18n.t('sidebar.reportError')}</Text>
            </HStack>
          </View>
        </ScrollView>
        <View style={style.bottomContainer}>
          <View style={style.avatarContainer}>
            <UserAvatar user={user} navigation={this.props.navigation} />
          </View>
          <View style={style.rightContainer}>
            <Text style={style.userName}>
              {Utils.buildUserName(user)}
            </Text>
            <TouchableOpacity style={style.logoutContainer} onPress={async () => this.logoff()}>
              <Text style={style.logoutText}>{I18n.t('authentication.logOut')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
