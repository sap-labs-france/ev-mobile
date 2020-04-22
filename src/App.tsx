import I18n from 'i18n-js';
import { Icon, Root } from 'native-base';
import CentralServerProvider from 'provider/CentralServerProvider';
import React from 'react';
import { StatusBar } from 'react-native';
import { createAppContainer, createSwitchNavigator, NavigationContainer, NavigationContainerComponent, NavigationState } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import computeStyleSheet from './AppStyles';
import DeepLinkingManager from './deeplinking/DeepLinkingManager';
import I18nManager from './I18n/I18nManager';
import NotificationManager from './notification/NotificationManager';
import ProviderFactory from './provider/ProviderFactory';
import Eula from './screens/auth/eula/Eula';
import Login from './screens/auth/login/Login';
import ResetPassword from './screens/auth/reset-password/ResetPassword';
import RetrievePassword from './screens/auth/retrieve-password/RetrievePassword';
import SignUp from './screens/auth/sign-up/SignUp';
import ChargerActions from './screens/chargers/actions/ChargerActions';
import ChargerConnectorDetails from './screens/chargers/connector-details/ChargerConnectorDetails';
import Chargers from './screens/chargers/list/Chargers';
import ChargerOcppParameters from './screens/chargers/ocpp/ChargerOcppParameters';
import ChargerProperties from './screens/chargers/properties/ChargerProperties';
import Home from './screens/home/Home';
import Sidebar from './screens/sidebar/SideBar';
import SiteAreas from './screens/site-areas/SiteAreas';
import Sites from './screens/sites/Sites';
import Statistics from './screens/statistics/Statistics';
import TransactionChart from './screens/transactions/chart/TransactionChart';
import TransactionDetails from './screens/transactions/details/TransactionDetails';
import TransactionsInProgress from './screens/transactions/in-progress/TransactionsInProgress';
import TransactionsHistory from './screens/transactions/list/TransactionsHistory';
import commonColor from './theme/variables/commonColor';
import SecuredStorage from './utils/SecuredStorage';

// Init i18n
I18nManager.initialize();

const appStyles = computeStyleSheet();

// Auth Stack Navigation
const authNavigator: NavigationContainer = createStackNavigator(
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
const homeNavigator: NavigationContainer = createStackNavigator(
  {
    Home: { screen: Home }  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
);

// Stats Stack Navigation
const statisticsNavigator: NavigationContainer = createStackNavigator(
  {
    Statistics: { screen: Statistics }
  },
  {
    initialRouteName: 'Statistics',
    headerMode: 'none'
  }
);

const chargerDetailsTabsNavigator = createMaterialBottomTabNavigator(
  {
    ChargerActions: {
      screen: ChargerActions,
      navigationOptions: {
        title: I18n.t('chargers.actions'),
        tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'build')
      }
    },
    ChargerOcppParameters: {
      screen: ChargerOcppParameters,
      navigationOptions: {
        title: I18n.t('chargers.ocpp'),
        tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'format-list-bulleted')
      }
    },
    ChargerProperties: {
      screen: ChargerProperties,
      navigationOptions: {
        title: I18n.t('chargers.properties'),
        tabBarIcon: (props) => createTabBarIcon(props, 'MaterialIcons', 'info')
      }
    }
  },
  {
    activeColor: commonColor.topTabBarActiveTextColor,
    inactiveColor: commonColor.topTabBarTextColor,
    barStyle: { backgroundColor: commonColor.brandPrimaryDark },
    labeled: true,
    backBehavior: 'none',
    initialRouteName: 'ChargerProperties',
  }
);

const chargerConnectorDetailsTabsNavigator = createMaterialBottomTabNavigator(
  {
    ChargerConnectorDetails: {
      screen: ChargerConnectorDetails,
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
  },
  {
    activeColor: commonColor.topTabBarActiveTextColor,
    inactiveColor: commonColor.topTabBarTextColor,
    barStyle: { backgroundColor: commonColor.brandPrimaryDark },
    labeled: true,
    backBehavior: 'none',
    initialRouteName: 'ChargerConnectorDetails',
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
    }
  },
  {
    activeColor: commonColor.topTabBarActiveTextColor,
    inactiveColor: commonColor.topTabBarTextColor,
    barStyle: { backgroundColor: commonColor.brandPrimaryDark },
    labeled: true,
    backBehavior: 'none',
    initialRouteName: 'TransactionDetails',
  }
);

// Organizations Stack Navigation
const sitesNavigator: NavigationContainer = createStackNavigator(
  {
    Sites: { screen: Sites },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerDetailsTabs: { screen: chargerDetailsTabsNavigator },
    ChargerConnectorDetailsTabs: { screen: chargerConnectorDetailsTabsNavigator },
    TransactionDetailsTabs: { screen: transactionDetailsTabsNavigator }
  },
  {
    initialRouteName: 'Sites',
    headerMode: 'none'
  }
);

// Chargers Stack Navigation
const chargersNavigator: NavigationContainer = createStackNavigator(
  {
    Chargers: { screen: Chargers },
    ChargerDetailsTabs: { screen: chargerDetailsTabsNavigator },
    ChargerConnectorDetailsTabs: { screen: chargerConnectorDetailsTabsNavigator },
    TransactionDetailsTabs: { screen: transactionDetailsTabsNavigator }
  },
  {
    initialRouteName: 'Chargers',
    headerMode: 'none'
  }
);

const createTabBarIcon = (props: { focused: boolean; tintColor?: string; horizontal?: boolean;},
    type: 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'FontAwesome5' | 'Foundation' | 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial',
    name: string): React.ReactNode => {
  return <Icon style={{
      color: props.focused ? commonColor.topTabBarActiveTextColor : commonColor.topTabBarTextColor, paddingBottom: 5, fontSize: 23
    }} type={type} name={name} />
};

const transactionHistoryNavigator: NavigationContainer = createStackNavigator(
  {
    TransactionsHistory: { screen: TransactionsHistory },
    TransactionDetailsTabs: { screen: transactionDetailsTabsNavigator }
  },
  {
    initialRouteName: 'TransactionsHistory',
    headerMode: 'none'
  }
);

const transactionInProgressNavigator: NavigationContainer = createStackNavigator(
  {
    TransactionsInProgress: { screen: TransactionsInProgress },
    ChargerDetailsTabs: { screen: chargerDetailsTabsNavigator },
    ChargerConnectorDetailsTabs: { screen: chargerConnectorDetailsTabsNavigator }
  },
  {
    initialRouteName: 'TransactionsInProgress',
    headerMode: 'none'
  }
);

// Drawer Navigation
const appDrawerNavigator: NavigationContainer = createDrawerNavigator(
  {
    HomeNavigator: { screen: homeNavigator },
    SitesNavigator: { screen: sitesNavigator },
    ChargersNavigator: { screen: chargersNavigator },
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
    // @ts-ignore
    contentComponent: (props) => <Sidebar {...props} />
  }
);

const rootNavigator: any = createSwitchNavigator(
  {
    AuthNavigator: { screen: authNavigator },
    AppDrawerNavigator: { screen: appDrawerNavigator }
  },
  {
    initialRouteName: 'AuthNavigator'
  }
);

// Create a container to wrap the main navigator
const RootContainer: NavigationContainer = createAppContainer(rootNavigator);

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

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  // eslint-disable-next-line class-methods-use-this
  public async componentDidMount() {
    // Get the central server
    this.centralServerProvider = await ProviderFactory.getProvider();
    // Init Notification
    this.notificationManager = NotificationManager.getInstance();
    this.notificationManager.setCentralServerProvider(this.centralServerProvider);
    this.notificationManager.initialize(this.navigator);
    await this.notificationManager.start();
    // Assign
    this.centralServerProvider.setNotificationManager(this.notificationManager);
    // Init Deep Linking
    this.deepLinkingManager = DeepLinkingManager.getInstance();
    this.deepLinkingManager.initialize(this.navigator, this.centralServerProvider);
    // Activate Deep links
    this.deepLinkingManager.startListening();
    // Check on hold notification
    this.notificationManager.checkOnHoldNotification();
  }

  public async componentWillUnmount() {
    // Deactivate Deep links
    this.deepLinkingManager.stopListening();
    // Stop Notifications
    await this.notificationManager.stop();
  }

  // eslint-disable-next-line class-methods-use-this
  public render() {
    return (
      <Root>
        <StatusBar hidden={true} />
        <RootContainer
          ref={(navigatorRef) => {
            this.navigator = navigatorRef
          }}
          persistNavigationState={persistNavigationState}
          loadNavigationState={loadNavigationState}/>
      </Root>
    );
  }
}
