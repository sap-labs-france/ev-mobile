import { StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import moment from 'moment';
import { Icon, IIconProps } from 'native-base';
import React from 'react';
import {
  Image,
  ImageStyle,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TouchableHighlightProps
} from 'react-native';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {}

function SidebarEntry(props: TouchableHighlightProps): React.ReactElement {
  const style = computeStyleSheet();
  const commonColor = Utils.getCurrentCommonColor();
  return (
    <TouchableHighlight underlayColor={commonColor.listItemBackground} {...props}>
      <View style={style.links}>{props.children}</View>
    </TouchableHighlight>
  );
}
function SidebarIcon(props: IIconProps): React.ReactElement {
  const commonColor = Utils.getCurrentCommonColor();
  return <Icon color={commonColor.textColor} size={scale(22)} {...props} />;
}

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
    const showEntitiesSection = this.securityProvider?.canListUsers() || this.securityProvider?.canListCars() || this.securityProvider?.canListTags();
    const showBillingSection = this.securityProvider?.isComponentBillingActive() && (this.securityProvider?.canListInvoices() || this.securityProvider?.canListPaymentMethods());
    // Get logo
    return (
      <View style={style.container}>
        <SafeAreaView style={style.sidebar}>
          <View style={style.header}>
            <View style={style.tenantContainer}>
              {tenantLogo && <Image source={{ uri: tenantLogo }} style={style.logo as ImageStyle} />}
              <Text numberOfLines={2} ellipsizeMode={'tail'} style={style.tenantName}>
                {tenantName}
              </Text>
            </View>
            <View style={style.versionContainer}>
              {!appVersion?.needsUpdate ? (
                <Text style={style.versionText}>{`${I18n.t('general.version')} ${DeviceInfo.getVersion()}`}</Text>
              ) : (
                <TouchableOpacity style={style.newVersionContainer}>
                  <SidebarIcon style={style.newVersionIcon} as={MaterialIcons} name={'update'} />
                  <Text style={style.newVersionText}>{I18n.t('appUpdate.appUpdateDialogTitle')}</Text>
                </TouchableOpacity>
              )}
            </View>
            {showAppUpdateDialog && <AppUpdateDialog appVersion={appVersion} close={() => this.setState({ showAppUpdateDialog: false })} />}
          </View>
          <ScrollView contentContainerStyle={style.scrollviewInnerContainer} style={style.scrollview}>
            <View style={style.sidebarSection}>
              <SidebarEntry onPress={() => this.props.navigation.navigate('QRCodeScanner')}>
                <SidebarIcon as={MaterialIcons} name="qr-code-scanner" />
                <Text style={style.linkText}>{I18n.t('sidebar.qrCodeScanner')}</Text>
              </SidebarEntry>
            </View>
            <View style={style.sidebarSection}>
              {isComponentOrganizationActive && (
                <SidebarEntry onPress={() => this.navigateTo('SitesNavigator', 'Sites')}>
                  <SidebarIcon as={MaterialIcons} name="store-mall-directory" />
                  <Text style={style.linkText}>{I18n.t('sidebar.sites')}</Text>
                </SidebarEntry>
              )}
              <SidebarEntry onPress={() => this.navigateTo('ChargingStationsNavigator', 'ChargingStations')}>
                <SidebarIcon as={MaterialIcons} name="ev-station" />
                <Text style={style.linkText}>{I18n.t('sidebar.chargers')}</Text>
              </SidebarEntry>
            </View>
            <View style={style.sidebarSection}>
              <SidebarEntry
                onPress={() => this.navigateTo('TransactionHistoryNavigator', 'TransactionsHistory')}>
                <SidebarIcon as={MaterialCommunityIcons} name="history" />
                <Text style={style.linkText}>{I18n.t('sidebar.transactionsHistory')}</Text>
              </SidebarEntry>
              <SidebarEntry
                onPress={() => this.navigateTo('TransactionInProgressNavigator', 'TransactionsInProgress')}>
                <SidebarIcon as={MaterialIcons} name="play-arrow" />
                <Text style={style.linkText}>{I18n.t('sidebar.transactionsInProgress')}</Text>
              </SidebarEntry>
              <SidebarEntry onPress={() => this.navigateTo('StatisticsNavigator', 'Statistics')}>
                <SidebarIcon as={MaterialIcons} name="assessment" />
                <Text style={style.linkText}>{I18n.t('sidebar.statistics')}</Text>
              </SidebarEntry>
            </View>
            {showEntitiesSection && (
              <View style={style.sidebarSection}>
                {this.securityProvider?.canListUsers() && (
                  <SidebarEntry onPress={() => this.navigateTo('UsersNavigator', 'Users')}>
                    <SidebarIcon as={MaterialIcons} name="people" />
                    <Text style={style.linkText}>{I18n.t('sidebar.users')}</Text>
                  </SidebarEntry>
                )}
                {this.securityProvider?.canListTags() && (
                  <SidebarEntry onPress={() => this.navigateTo('TagsNavigator', 'Tags')}>
                    <SidebarIcon as={MaterialCommunityIcons} name="credit-card" />
                    <Text style={style.linkText}>{I18n.t('sidebar.badges')}</Text>
                  </SidebarEntry>
                )}
                {this.securityProvider?.canListCars() && this.securityProvider?.isComponentCarActive() && (
                  <SidebarEntry onPress={() => this.navigateTo('CarsNavigator', 'Cars')}>
                    <SidebarIcon as={MaterialIcons} name="directions-car" />
                    <Text style={style.linkText}>{I18n.t('sidebar.cars')}</Text>
                  </SidebarEntry>
                )}
              </View>
            )}
            {showBillingSection && (
              <View style={style.sidebarSection}>
                {this.securityProvider?.canListPaymentMethods() && this.securityProvider?.isComponentBillingActive() && (
                  <SidebarEntry
                    onPress={() => this.navigateTo('PaymentMethodsNavigator', 'PaymentMethods')}>
                    <SidebarIcon as={MaterialIcons} name="payments" />
                    <Text style={style.linkText}>{I18n.t('sidebar.paymentMethods')}</Text>
                  </SidebarEntry>
                )}
                {this.securityProvider?.canListInvoices() && this.securityProvider?.isComponentBillingActive() && (
                  <SidebarEntry onPress={() => this.navigateTo('InvoicesNavigator', 'Invoices')}>
                    <SidebarIcon as={MaterialIcons} name="receipt" />
                    <Text style={style.linkText}>{I18n.t('sidebar.invoices')}</Text>
                  </SidebarEntry>
                )}
              </View>
            )}
            <SidebarEntry
              onPress={() => this.navigateTo('ReportErrorNavigator', 'ReportError')}>
              <SidebarIcon color={commonColor.dangerLight} as={MaterialIcons} name="error-outline" />
              <Text style={[style.linkText, { color: commonColor.dangerLight }]}>{I18n.t('sidebar.reportError')}</Text>
            </SidebarEntry>
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
      </View>
    );
  }
}
