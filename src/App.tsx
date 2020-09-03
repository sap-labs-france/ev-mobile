import I18n from 'i18n-js';
import { Icon } from 'native-base';
import CentralServerProvider from 'provider/CentralServerProvider';
import React from 'react';
import { StatusBar } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainerComponent, NavigationState, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import computeStyleSheet from './AppStyles';
import ThemeManager from './custom-theme/ThemeManager';
import DeepLinkingManager from './deeplinking/DeepLinkingManager';
import I18nManager from './I18n/I18nManager';
import LocationManager from './location/LocationManager';
import NotificationManager from './notification/NotificationManager';
import ProviderFactory from './provider/ProviderFactory';
import ReportError from './screens//report-error//ReportError'
import Eula from './screens/auth/eula/Eula';
import Login from './screens/auth/login/Login';
import ResetPassword from './screens/auth/reset-password/ResetPassword';
import RetrievePassword from './screens/auth/retrieve-password/RetrievePassword';
import SignUp from './screens/auth/sign-up/SignUp';
import ChargingStationActions from './screens/charging-stations/actions/ChargingStationActions';
import ChargingStationConnectorDetails from './screens/charging-stations/connector-details/ChargingStationConnectorDetails';
import ChargingStations from './screens/charging-stations/list/ChargingStations';
import ChargingStationOcppParameters from './screens/charging-stations/ocpp/ChargingStationOcppParameters';
import ChargingStationProperties from './screens/charging-stations/properties/ChargingStationProperties';
import Home from './screens/home/Home';
import Sidebar from './screens/sidebar/SideBar';
import SiteAreas from './screens/site-areas/SiteAreas';
import Sites from './screens/sites/Sites';
import Statistics from './screens/statistics/Statistics';
import TransactionChart from './screens/transactions/chart/TransactionChart';
import TransactionDetails from './screens/transactions/details/TransactionDetails';
import TransactionsHistory from './screens/transactions/history/TransactionsHistory';
import TransactionsInProgress from './screens/transactions/in-progress/TransactionsInProgress';
import SecuredStorage from './utils/SecuredStorage';
import Utils from './utils/Utils';

// Init i18n
I18nManager.initialize();

export interface Props {
}

interface State {
}

export default class App extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private notificationManager: NotificationManager;
  private deepLinkingManager: DeepLinkingManager;
  private centralServerProvider: CentralServerProvider;
  private navigator: NavigationContainerComponent;
  private location: LocationManager;
  private theme: ThemeManager;

  constructor(props: Props) {
    super(props);
    this.state = {
      switchTheme: false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public async componentDidMount() {
    // Get the central server
    this.centralServerProvider = await ProviderFactory.getProvider();
    // Init Notification --------------------------------------
    this.notificationManager = NotificationManager.getInstance();
    this.notificationManager.setCentralServerProvider(this.centralServerProvider);
    this.notificationManager.initialize(this.navigator);
    await this.notificationManager.start();
    // Assign
    this.centralServerProvider.setNotificationManager(this.notificationManager);
    // Init Deep Linking ---------------------------------------
    this.deepLinkingManager = DeepLinkingManager.getInstance();
    this.deepLinkingManager.initialize(this.navigator, this.centralServerProvider);
    // Activate Deep links
    this.deepLinkingManager.startListening();
    // Location ------------------------------------------------
    this.location = await LocationManager.getInstance();
    this.location.startListening();
    // Check on hold notification
    this.notificationManager.checkOnHoldNotification();
  }

  public async componentWillUnmount() {
    // Deactivate Deep links
    this.deepLinkingManager.stopListening();
    // Stop Notifications
    await this.notificationManager.stop();
    // Stop Location
    this.location.stopListening();
  }

  public render() {
    return (
      <RootSiblingParent>
        <StatusBar hidden={true} />
        {this.createRootContainerNavigation()}
      </RootSiblingParent>
    );
  }

  private createRootContainerNavigation() {
    const commonColor = Utils.getCurrentCommonColor();
    const appStyles = computeStyleSheet();
    const barStyle = {
      backgroundColor: commonColor.containerBgColor,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: commonColor.topTabBarTextColor
    };
    // Auth Stack Navigation
    const authNavigator = createStackNavigator(
      {
        Login: { screen: Login },
        Eula: { screen: Eula },
        SignUp: { screen: SignUp },
        ResetPassword: { screen: ResetPassword },
        RetrievePassword: { screen: RetrievePassword }
      },
      {
        initialRouteName: 'Login',
        headerMode: 'none'
      }
    );
    // Home Stack Navigation
    const homeNavigator = createStackNavigator(
      {
        Home: { screen: Home }
      },
      {
        initialRouteName: 'Home',
        headerMode: 'none'
      }
    );
    // Stats Stack Navigation
    const statisticsNavigator = createStackNavigator(
      {
        Statistics: { screen: Statistics }
      },
      {
        initialRouteName: 'Statistics',
        headerMode: 'none'
      }
    );
    const chargingStationDetailsTabsNavigator = createMaterialBottomTabNavigator(
      {
        ChargingStationActions: {
          screen: ChargingStationActions,
          navigationOptions: {
            title: I18n.t('chargers.actions'),
            tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'build')
          }
        },
        ChargingStationOcppParameters: {
          screen: ChargingStationOcppParameters,
          navigationOptions: {
            title: I18n.t('chargers.ocpp'),
            tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'format-list-bulleted')
          }
        },
        ChargingStationProperties: {
          screen: ChargingStationProperties,
          navigationOptions: {
            title: I18n.t('chargers.properties'),
            tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'info')
          }
        }
      },
      {
        activeColor: commonColor.topTabBarActiveTextColor,
        inactiveColor: commonColor.topTabBarTextColor,
        barStyle,
        labeled: true,
        backBehavior: 'none',
        initialRouteName: 'ChargingStationActions',
      }
    );
    const chargingStationConnectorDetailsTabsNavigator = createMaterialBottomTabNavigator(
      {
        ChargingStationConnectorDetails: {
          screen: ChargingStationConnectorDetails,
          navigationOptions: {
            title: I18n.t('sites.chargePoint'),
            tabBarIcon: (props) => createTabBarIcon(props, 'FontAwesome', 'bolt')
          },
        },
        TransactionChart: {
          screen: TransactionChart,
          navigationOptions: {
            title: I18n.t('details.graph'),
            tabBarIcon: (props) => createTabBarIcon(props, 'AntDesign', 'linechart')
          }
        },
        ReportError: {
          screen: ReportError,
          navigationOptions: {
            title: I18n.t('details.reportError'),
            tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'report')
          }
        },
      },
      {
        activeColor: commonColor.topTabBarActiveTextColor,
        inactiveColor: commonColor.topTabBarTextColor,
        barStyle,
        labeled: true,
        backBehavior: 'none',
        initialRouteName: 'ChargingStationConnectorDetails',
      }
    );
    const transactionDetailsTabsNavigator = createMaterialBottomTabNavigator(
      {
        TransactionDetails: {
          screen: TransactionDetails,
          navigationOptions: {
            title: I18n.t('transactions.transaction'),
            tabBarIcon: (props) => createTabBarIcon(props, 'FontAwesome', 'bolt')
          },
        },
        TransactionChart: {
          screen: TransactionChart,
          navigationOptions: {
            title: I18n.t('details.graph'),
            tabBarIcon: (props) => createTabBarIcon(props, 'AntDesign', 'linechart')
          }
        },
      },
      {
        activeColor: commonColor.topTabBarActiveTextColor,
        inactiveColor: commonColor.topTabBarTextColor,
        barStyle,
        labeled: true,
        backBehavior: 'none',
        initialRouteName: 'TransactionDetails',
      }
    );
    // Organizations Stack Navigation
    const sitesNavigator = createStackNavigator(
      {
        Sites: { screen: Sites },
        SiteAreas: { screen: SiteAreas },
        ChargingStations: { screen: ChargingStations },
        ChargingStationDetailsTabs: { screen: chargingStationDetailsTabsNavigator },
        ChargingStationConnectorDetailsTabs: { screen: chargingStationConnectorDetailsTabsNavigator },
        TransactionDetailsTabs: { screen: transactionDetailsTabsNavigator },
      },
      {
        initialRouteName: 'Sites',
        headerMode: 'none'
      }
    );
    // ChargingStations Stack Navigation
    const chargingStationsNavigator = createStackNavigator(
      {
        ChargingStations: { screen: ChargingStations },
        ChargingStationDetailsTabs: { screen: chargingStationDetailsTabsNavigator },
        ChargingStationConnectorDetailsTabs: { screen: chargingStationConnectorDetailsTabsNavigator },
        TransactionDetailsTabs: { screen: transactionDetailsTabsNavigator },
      },
      {
        initialRouteName: 'ChargingStations',
        headerMode: 'none'
      }
    );
    const createTabBarIcon = (props: { focused: boolean; tintColor?: string; horizontal?: boolean; },
      type: 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Foundation' | 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial',
      name: string): React.ReactNode => {
      return <Icon style={{
        color: props.focused ? commonColor.topTabBarActiveTextColor : commonColor.topTabBarTextColor, paddingBottom: 5, fontSize: 23
      }} type={type} name={name} />
    };
    const transactionHistoryNavigator = createStackNavigator(
      {
        TransactionsHistory: { screen: TransactionsHistory },
        TransactionDetailsTabs: { screen: transactionDetailsTabsNavigator }
      },
      {
        initialRouteName: 'TransactionsHistory',
        headerMode: 'none'
      }
    );
    const transactionInProgressNavigator = createStackNavigator(
      {
        TransactionsInProgress: { screen: TransactionsInProgress },
        ChargingStationDetailsTabs: { screen: chargingStationDetailsTabsNavigator },
        ChargingStationConnectorDetailsTabs: { screen: chargingStationConnectorDetailsTabsNavigator }
      },
      {
        initialRouteName: 'TransactionsInProgress',
        headerMode: 'none'
      }
    );
    // Drawer Navigation
    const appDrawerNavigator = createDrawerNavigator(
      {
        HomeNavigator: { screen: homeNavigator },
        SitesNavigator: { screen: sitesNavigator },
        ChargingStationsNavigator: { screen: chargingStationsNavigator },
        StatisticsNavigator: { screen: statisticsNavigator },
        TransactionHistoryNavigator: { screen: transactionHistoryNavigator },
        TransactionInProgressNavigator: { screen: transactionInProgressNavigator },
      },
      {
        navigationOptions: {
          swipeEnabled: true
        },
        drawerWidth: appStyles.sideMenu.width,
        initialRouteName: 'HomeNavigator',
        unmountInactiveRoutes: true,
        drawerPosition: 'right',
        contentComponent: (props) => <Sidebar {...props} />
      }
    );
    const rootNavigator = createSwitchNavigator(
      {
        AuthNavigator: { screen: authNavigator },
        AppDrawerNavigator: { screen: appDrawerNavigator }
      },
      {
        initialRouteName: 'AuthNavigator'
      }
    );
    // Create a container to wrap the main navigator
    const RootContainer = createAppContainer(rootNavigator);
    // Handle persistence of navigation
    const persistNavigationState = async (navigationState: NavigationState) => {
      try {
        await SecuredStorage.saveNavigationState(navigationState);
      } catch (error) {
        // tslint:disable-next-line: no-console
        console.log(error);
      }
    };
    const loadNavigationState = async () => {
      const navigationState = await SecuredStorage.getNavigationState();
      return navigationState;
    };
    return (
      <RootContainer
        ref={(navigatorRef) => {
          this.navigator = navigatorRef;
        }}
        persistNavigationState={persistNavigationState}
        loadNavigationState={loadNavigationState} />
    )
  }
}
