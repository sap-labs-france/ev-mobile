import I18n from 'i18n-js';
import moment from 'moment';
import { HStack, Icon, IIconProps } from 'native-base';
import React from 'react';
import {
  Image,
  ImageStyle,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView
} from 'react-native';
import { CheckVersionResponse } from 'react-native-check-version';
import DeviceInfo from 'react-native-device-info';

import AppUpdateDialog from '../../components/modal/app-update/AppUpdateDialog';
import UserAvatar from '../../components/user/avatar/UserAvatar';
import User from '../../types/User';
import UserToken from '../../types/UserToken';
import Utils from '../../utils/Utils';
import computeStyleSheet from './SideBarStyles';
import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import SecurityProvider from '../../provider/SecurityProvider';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';
import {AuthContext} from '../../context/AuthContext';
import {CommonActions, DrawerActions} from '@react-navigation/native';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import Color from 'color';

export interface Props extends DrawerContentComponentProps {}

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
    this.getUserInfo();
    const appVersion = await Utils.checkForUpdate();
    this.setState({ appVersion, tenantLogo });
  }

  public async getUpdateDate() {
    const lastUpdateTime = await DeviceInfo.getLastUpdateTime();
    this.setState({ updateDate: lastUpdateTime && lastUpdateTime !== -1 && moment(lastUpdateTime).format('LL') });
  }

  public getUserInfo() {
    // Logoff
    const userInfo = this.centralServerProvider.getUserInfo();
    this.setState({
      userToken: this.centralServerProvider.getUserInfo(),
      isComponentOrganizationActive: this.securityProvider ? this.securityProvider.isComponentOrganizationActive() : false,
      tenantName: userInfo?.tenantName
    });
  };

  public async logoff(callback?: () => void) {
    // Logoff
    this.centralServerProvider.setAutoLoginDisabled(true);
    await this.centralServerProvider.logoff();
    callback?.();
  }

  public navigateTo = (container: string, screen: string, params?: {}) => {
    // Navigate
    this.props.navigation.navigate(container, { screen, params, key: Utils.randomNumber().toString() });
  };

  public render() {
    const style = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { userToken, tenantName, showAppUpdateDialog, appVersion, tenantLogo } = this.state;
    const user = { firstName: userToken?.firstName, name: userToken?.name, id: userToken?.id } as User;
    let lastDrawerSection: boolean;
    // Get logo
    return (
      <View style={style.container}>
        <View style={style.sidebar}>
          <SafeAreaView style={{flex: 0}} />
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
          <DrawerContentScrollView contentContainerStyle={style.scrollviewInnerContainer} style={style.scrollview} {...this.props} >
            {this.props.state.routes.map((route, index) => {
              const { drawerIcon, drawerLabel, drawerSection, drawerActiveTintColor, drawerActiveBackgroundColor, drawerItemStyle } = this.props.descriptors[route.key].options;
              const focused = this.props.state.index === index;
              const newSection = drawerSection !== lastDrawerSection && index !== 0;
              lastDrawerSection = drawerSection;
              return <React.Fragment key={route.key}>
                {newSection && (
                  <View style={style.drawerSeparation} />
                )}
                <DrawerItem
                  label={drawerLabel ?? ''}
                  labelStyle={style.drawerLabel}
                  style={[drawerItemStyle, style.drawerItem]}
                  icon={drawerIcon}
                  focused={focused}
                  activeTintColor={drawerActiveTintColor}
                  activeBackgroundColor={drawerActiveBackgroundColor}
                  onPress={() => {
                    this.props.navigation.dispatch({
                      ...(focused
                        ? DrawerActions.closeDrawer()
                        : CommonActions.navigate(route.name)),
                      target: this.props.state.key,
                    });
                  }}
                />
              </React.Fragment>;
            })}
          </DrawerContentScrollView>
          <View style={{backgroundColor: commonColor.listItemBackground}}>
            <View style={style.bottomContainer}>
              <View style={style.avatarContainer}>
                <UserAvatar user={user} />
              </View>
              <View style={style.rightContainer}>
                <Text style={style.userName}>
                  {Utils.buildUserName(user)}
                </Text>
                <HStack style={{alignItems: 'center'}}>
                  <TouchableOpacity style={style.settingsContainer} onPress={() => this.navigateTo('SettingsNavigator', 'Settings')}>
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.logoutText}>{I18n.t('sidebar.settings')}</Text>
                  </TouchableOpacity>
                  <View style={{width: scale(4), height: scale(4), borderRadius: scale(4), backgroundColor: commonColor.primary, marginHorizontal: scale(10)}} />
                  <AuthContext.Consumer>
                    {authService => (
                      <TouchableOpacity style={style.logoutContainer} onPress={() => void this.logoff(() => authService.handleSignOut())}>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.logoutText}>{I18n.t('authentication.logOut')}</Text>
                      </TouchableOpacity>
                    )}
                  </AuthContext.Consumer>
                </HStack>
              </View>
            </View>
            <SafeAreaView />
          </View>
        </View>
      </View>
    );
  }
}
