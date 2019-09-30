import moment from "moment";
import { Root } from "native-base";
import CentralServerProvider from "provider/CentralServerProvider";
import React from "react";
import { Dimensions, StatusBar } from "react-native";
import { createAppContainer, createSwitchNavigator, NavigationContainer, NavigationContainerComponent, NavigationState } from "react-navigation";
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import DeepLinkingManager from "./deeplinking/DeepLinkingManager";
import NotificationManager from "./notification/NotificationManager";
import ProviderFactory from "./provider/ProviderFactory";
import Eula from "./screens/auth/eula/Eula";
import Login from "./screens/auth/login/Login";
import ResetPassword from "./screens/auth/reset-password/ResetPassword";
import RetrievePassword from "./screens/auth/retrieve-password/RetrievePassword";
import SignUp from "./screens/auth/sign-up/SignUp";
import ChargerDetailsTabs from "./screens/charger-details/ChargerDetailsTabs";
import Chargers from "./screens/chargers/Chargers";
import Sidebar from "./screens/sidebar/SideBar";
import SiteAreas from "./screens/site-areas/SiteAreas";
import Sites from "./screens/sites/Sites";
import TransactionChartContainer from "./screens/transactions/chart/TransactionChartContainer";
import TransactionTabs from "./screens/transactions/TransactionTabs";
import SecuredStorage from "./utils/SecuredStorage";
import Utils from "./utils/Utils";

// Get the supported locales
require("moment/locale/fr");
require("moment/locale/de");
require("moment/locale/en-gb");
// Set the current locale
moment.locale(Utils.getLocaleShort());

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
    initialRouteName: "Login",
    headerMode: "none"
  }
);

// Organizations Stack Navigation
const sitesNavigator: NavigationContainer = createStackNavigator(
  {
    Sites: { screen: Sites },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerDetailsTabs: { screen: ChargerDetailsTabs }
  },
  {
    initialRouteName: "Sites",
    headerMode: "none"
  }
);

// Chargers Stack Navigation
const chargersNavigator: NavigationContainer = createStackNavigator(
  {
    Chargers: { screen: Chargers },
    ChargerDetailsTabs: { screen: ChargerDetailsTabs }
  },
  {
    initialRouteName: "Chargers",
    headerMode: "none"
  }
);

// Transactions Stack Navigation
const transactionsNavigator: NavigationContainer = createStackNavigator(
  {
    TransactionTabs: { screen: TransactionTabs },
    ChargerDetailsTabs: { screen: ChargerDetailsTabs },
    TransactionChart: { screen: TransactionChartContainer }
  },
  {
    initialRouteName: "TransactionTabs",
    headerMode: "none"
  }
);

// Drawer Navigation
const appDrawerNavigator: NavigationContainer = createDrawerNavigator(
  {
    SitesNavigator: { screen: sitesNavigator },
    ChargersNavigator: { screen: chargersNavigator },
    TransactionsNavigator: { screen: transactionsNavigator }
  },
  {
    navigationOptions: {
      swipeEnabled: true
    },
    drawerWidth: Dimensions.get("window").width / 1.5,
    initialRouteName: "SitesNavigator",
    unmountInactiveRoutes: true,
    drawerPosition: "right",
    contentComponent: (props) => <Sidebar {...props} />
  }
);

const rootNavigator: NavigationContainer = createSwitchNavigator(
  {
    AuthNavigator: { screen: authNavigator },
    AppDrawerNavigator: { screen: appDrawerNavigator }
  },
  {
    initialRouteName: "AuthNavigator"
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
    // Init Notification
    this.notificationManager = NotificationManager.getInstance();
    this.notificationManager.initialize();
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  // eslint-disable-next-line class-methods-use-this
  public async componentDidMount() {
    // Get the central server
    this.centralServerProvider = await ProviderFactory.getProvider();
    // Init Deep Linking
    this.deepLinkingManager = DeepLinkingManager.getInstance();
    this.deepLinkingManager.initialize(this.navigator, this.centralServerProvider);  
    // Activate Deep links
    this.deepLinkingManager.startListening();
    // Activate Notifications
    this.notificationManager.setActive(true);
  }

  public async componentWillUnmount() {
    // Deactivate Notifications
    this.notificationManager.setActive(false);
    // Deactivate Deep links
    this.deepLinkingManager.stopListening();
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
