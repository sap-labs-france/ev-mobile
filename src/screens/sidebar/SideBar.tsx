import I18n from 'i18n-js';
import moment from 'moment';
import { Container, Content, Header, Icon, ListItem, Text, Thumbnail, View } from 'native-base';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import logo from '../../../assets/logo-low.png';
import noPhoto from '../../../assets/no-photo-inverse.png';
import BaseProps from '../../types/BaseProps';
import Constants from '../../utils/Constants';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './SideBarStyles';

export interface Props extends BaseProps {
}

interface State {
  userName?: string;
  userID?: string;
  userImage?: string;
  tenantName?: string;
  isComponentOrganizationActive?: boolean;
}

export default class SideBar extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      userName: '',
      userID: '',
      userImage: '',
      tenantName: '',
      isComponentOrganizationActive: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    await super.componentDidMount();
    // Init User (delay it)
    setTimeout(this.refresh, 200);
  }

  public refresh = async () => {
    await this.getUserInfo();
  };

  public getUserInfo = async () => {
    // Logoff
    const userInfo = this.centralServerProvider.getUserInfo();
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    // Add sites
    this.setState(
      {
        userName: userInfo ? `${userInfo.name} ${userInfo.firstName}` : '',
        userID: userInfo ? `${userInfo.id}` : '',
        isComponentOrganizationActive: securityProvider ? securityProvider.isComponentOrganizationActive() : false,
        tenantName: userInfo.tenantName
      },
      async () => {
        await this.getUserImage();
      }
    );
  };

  public async getUserImage() {
    const { userID } = this.state;
    try {
      const image = await this.centralServerProvider.getUserImage({ ID: userID });
      if (image) {
        this.setState({ userImage: image });
      }
    } catch (error) {
      // Other common Error
      setTimeout(() => this.refresh(), Constants.AUTO_REFRESH_ON_ERROR_PERIOD_MILLIS);
    }
  }

  public async logoff() {
    // Logoff
    this.centralServerProvider.setAutoLoginDisabled(true);
    this.centralServerProvider.logoff();
    // Back to login
    this.props.navigation.navigate('AuthNavigator');
  }

  public navigateTo = (screen: string, params = {}) => {
    // Navigate
    this.props.navigation.navigate({
      routeName: screen,
      // key: `${Utils.randomNumnber()}`,
      params
    });
    // Close
    this.props.navigation.closeDrawer();
  };

  public render() {
    console.log(this.constructor.name + ' render ====================================');
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { userName, userImage, tenantName, isComponentOrganizationActive } = this.state;
    return (
      <Container style={style.container}>
        <Content style={style.drawerContent}>
          <Header style={style.header}>
            <Image source={logo} style={style.logo} />
            <Text numberOfLines={1} style={style.tenantName}>
              {tenantName}
            </Text>
            {/* <Text style={style.versionText}>{`${I18n.t("general.version")} ${DeviceInfo.getVersion()}`} (Beta)</Text> */}
            <Text style={style.versionText}>{`${I18n.t('general.version')} ${DeviceInfo.getVersion()}`}</Text>
            {DeviceInfo.getLastUpdateTime() && (
              <Text style={style.versionDate}>{moment(DeviceInfo.getLastUpdateTime()).format('LL')}</Text>
            )}
          </Header>
          <View style={style.linkContainer}>
            <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('HomeNavigator')}>
              <Icon style={style.linkIcon} type='MaterialIcons' name='home' />
              <Text style={style.linkText}>{I18n.t('sidebar.home')}</Text>
            </ListItem>
            {isComponentOrganizationActive && (
              <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('SitesNavigator')}>
                <Icon style={style.linkIcon} type='MaterialIcons' name='store-mall-directory' />
                <Text style={style.linkText}>{I18n.t('sidebar.sites')}</Text>
              </ListItem>
            )}
            <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('ChargersNavigator')}>
              <Icon style={style.linkIcon} type='MaterialIcons' name='ev-station' />
              <Text style={style.linkText}>{I18n.t('sidebar.chargers')}</Text>
            </ListItem>
            <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('TransactionHistoryNavigator')}>
              <Icon style={style.linkIcon} type='MaterialCommunityIcons' name='history' />
              <Text style={style.linkText}>{I18n.t('sidebar.transactions')}</Text>
            </ListItem>
            <ListItem style={style.links} button={true} iconLeft={true} onPress={() => this.navigateTo('StatisticsNavigator')}>
              <Icon style={style.linkIcon} type='MaterialIcons' name='assessment' />
              <Text style={style.linkText}>{I18n.t('sidebar.statistics')}</Text>
            </ListItem>
            {/* <ListItem button onPress={() => navigation.navigate("Settings")} iconLeft style={style.links}>
              <Icon name="ios-settings-outline" />
              <Text style={style.linkText}>SETTINGS</Text>
            </ListItem> */}
            {/* <ListItem button onPress={() => navigation.navigate("Feedback")} iconLeft style={style.links}>
              <Icon name="ios-paper-outline" />
              <Text style={style.linkText}>FEEDBACK</Text>
            </ListItem> */}
          </View>
        </Content>
        <View style={style.logoutContainer}>
          <View style={style.logoutButton}>
            <View style={style.gridLogoutContainer}>
              <View style={style.columnAccount}>
                <TouchableOpacity style={style.buttonLogout} onPress={() => this.logoff()}>
                  <Text style={style.logoutText}>{I18n.t('authentication.logOut')}</Text>
                  <Text note={true} style={style.userName}>
                    {userName}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={style.columnThumbnail}>
                <TouchableOpacity style={style.buttonThumbnail} onPress={() => navigation.navigate('Profile')}>
                  <Thumbnail style={style.profilePic} source={userImage ? { uri: userImage } : noPhoto} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Container>
    );
  }
}
