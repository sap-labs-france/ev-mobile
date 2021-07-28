import { StackActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import moment from 'moment';
import { Container, Content, Header, Icon, ListItem, Text, View } from 'native-base';
import React from 'react';
import { Image, ImageStyle, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import UserAvatar from '../../components/user/avatar/UserAvatar';
import BaseProps from '../../types/BaseProps';
import User from '../../types/User';
import UserToken from '../../types/UserToken';
import Utils from '../../utils/Utils';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './SideBarStyles';
import { checkVersion, CheckVersionResponse } from 'react-native-check-version';
import AppUpdateModal from '../../components/modal/app-update/AppUpdateModal';

export interface Props extends BaseProps {}

interface State {
  userToken?: UserToken;
  tenantName?: string;
  isComponentOrganizationActive?: boolean;
  updateDate?: string;
  showAppUpdateDialog?: boolean;
  appVersion?: CheckVersionResponse;
}

export default class SideBar extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

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

  public async componentDidMount() {
    await super.componentDidMount();
    await this.getUpdateDate();
    // Init User (delay it)
    this.refresh();
  }

  public refresh = async () => {
    await this.getUserInfo();
    const appVersion = await checkVersion({currentVersion:  '1.9'});
    this.setState({ appVersion });
  };

  public async getUpdateDate() {
    const lastUpdateTime = await DeviceInfo.getLastUpdateTime();
    this.setState({ updateDate: lastUpdateTime && lastUpdateTime !== -1 && moment(lastUpdateTime).format('LL') });
  }

  public getUserInfo = async () => {
    // Logoff
    const userInfo = this.centralServerProvider.getUserInfo();
    // Add sites(
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
    const { userToken, tenantName, isComponentOrganizationActive, showAppUpdateDialog, appVersion } = this.state;
    const user = { firstName: userToken?.firstName, name: userToken?.name, id: userToken?.id } as User;
    // Get logo
    const tenantLogo = this.centralServerProvider?.getCurrentTenantLogo();
    return (
      <Container style={style.container}>
        <Header style={style.header}>
          {tenantLogo && <Image source={{ uri: tenantLogo }} style={style.logo as ImageStyle} />}
          <Text numberOfLines={1} style={style.tenantName}>
            {tenantName}
          </Text>
          {/* <Text style={style.versionText}>{`${I18n.t("general.version")} ${DeviceInfo.getVersion()}`} (Beta)</Text> */}
          <TouchableOpacity
            disabled={!appVersion?.needsUpdate}
            onPress={() => this.setState({ showAppUpdateDialog: true })}
            style={style.versionContainer}>
            <Text style={style.versionText}>{`${I18n.t('general.version')} ${DeviceInfo.getVersion()}`}</Text>
            {appVersion?.needsUpdate && (
              <View style={style.newVersionContainer}>
                <Text style={style.newVersionText}>{I18n.t('appUpdate.appUpdateDialogTitle')}</Text>
                <Icon style={style.newVersionIcon} type={'MaterialCommunityIcons'} name={'party-popper'} />
              </View>
            )}
          </TouchableOpacity>
          {showAppUpdateDialog && <AppUpdateModal appVersion={appVersion} close={() => this.setState({ showAppUpdateDialog: false })} />}
        </Header>
        <Content style={style.drawerContent}>
          <View style={style.linkContainer}>
            <ListItem style={style.links} button iconLeft onPress={() => this.navigateTo('HomeNavigator', 'Home')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="home" />
              <Text style={style.linkText}>{I18n.t('sidebar.home')}</Text>
            </ListItem>
            {isComponentOrganizationActive && (
              <ListItem style={style.links} button iconLeft onPress={() => this.navigateTo('SitesNavigator', 'Sites')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="store-mall-directory" />
                <Text style={style.linkText}>{I18n.t('sidebar.sites')}</Text>
              </ListItem>
            )}
            <ListItem style={style.links} button iconLeft onPress={() => this.navigateTo('ChargingStationsNavigator', 'ChargingStations')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="ev-station" />
              <Text style={style.linkText}>{I18n.t('sidebar.chargers')}</Text>
            </ListItem>
            <ListItem
              style={style.links}
              button
              iconLeft
              onPress={() => this.navigateTo('TransactionHistoryNavigator', 'TransactionsHistory')}>
              <Icon style={style.linkIcon} type="MaterialCommunityIcons" name="history" />
              <Text style={style.linkText}>{I18n.t('sidebar.transactionsHistory')}</Text>
            </ListItem>
            <ListItem
              style={style.links}
              button
              iconLeft
              onPress={() => this.navigateTo('TransactionInProgressNavigator', 'TransactionsInProgress')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="play-arrow" />
              <Text style={style.linkText}>{I18n.t('sidebar.transactionsInProgress')}</Text>
            </ListItem>
            <ListItem style={style.links} button iconLeft onPress={() => this.navigateTo('StatisticsNavigator', 'Statistics')}>
              <Icon style={style.linkIcon} type="MaterialIcons" name="assessment" />
              <Text style={style.linkText}>{I18n.t('sidebar.statistics')}</Text>
            </ListItem>
            {this.securityProvider?.canListUsers() && (
              <ListItem style={style.links} button iconLeft onPress={() => this.navigateTo('UsersNavigator', 'Users')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="people" />
                <Text style={style.linkText}>{I18n.t('sidebar.users')}</Text>
              </ListItem>
            )}
            {this.securityProvider?.canListTags() && (
              <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('TagsNavigator', 'Tags')}>
                <Icon style={style.linkIcon} type="MaterialCommunityIcons" name="credit-card" />
                <Text style={style.linkText}>{I18n.t('sidebar.badges')}</Text>
              </ListItem>
            )}
            {this.securityProvider?.canListCars() && this.securityProvider?.isComponentCarActive() && (
              <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('CarsNavigator', 'Cars')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="directions-car" />
                <Text style={style.linkText}>{I18n.t('sidebar.cars')}</Text>
              </ListItem>
            )}
            {this.securityProvider?.canListPaymentMethods() && this.securityProvider?.isComponentBillingActive() && (
              <ListItem
                style={style.links}
                button={true}
                iconLeft={true}
                onPress={() => this.navigateTo('PaymentMethodsNavigator', 'PaymentMethods')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="payment" />
                <Text style={style.linkText}>{I18n.t('sidebar.paymentMethods')}</Text>
              </ListItem>
            )}
            {this.securityProvider?.canListInvoices() && this.securityProvider?.isComponentBillingActive() && (
              <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('InvoicesNavigator', 'Invoices')}>
                <Icon style={style.linkIcon} type="MaterialIcons" name="receipt" />
                <Text style={style.linkText}>{I18n.t('sidebar.invoices')}</Text>
              </ListItem>
            )}
            <ListItem
              style={style.links}
              button={true}
              iconLeft={true}
              onPress={() => this.navigateTo('ReportErrorNavigator', 'ReportError')}>
              <Icon style={[style.linkIcon, { color: commonColor.danger }]} type="MaterialIcons" name="error-outline" />
              <Text style={[style.linkText, { color: commonColor.danger }]}>{I18n.t('sidebar.reportError')}</Text>
            </ListItem>
            {/* <ListItem button onPress={() => navigation.navigate('Settings')} iconLeft style={style.links}>
              <Icon name="ios-settings-outline" />
              <Text style={style.linkText}>SETTINGS</Text>
            </ListItem>
            <ListItem button onPress={() => navigation.navigate('Feedback')} iconLeft style={style.links}>
              <Icon name="ios-paper-outline" />
              <Text style={style.linkText}>FEEDBACK</Text>
            </ListItem> */}
          </View>
        </Content>
        <View style={style.logoutContainer}>
          <View style={style.logoutButton}>
            <View style={style.gridLogoutContainer}>
              <View style={style.columnAccount}>
                <TouchableOpacity style={style.buttonLogout} onPress={async () => this.logoff()}>
                  <Text style={style.logoutText}>{I18n.t('authentication.logOut')}</Text>
                  <Text note style={style.userName}>
                    {Utils.buildUserName(user)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={style.columnThumbnail}>
                <View style={style.buttonThumbnail}>
                  <UserAvatar user={user} navigation={this.props.navigation} />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}
