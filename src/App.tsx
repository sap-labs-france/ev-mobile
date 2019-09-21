import moment from "moment";
import { Root } from "native-base";
import React from "react";
import { Dimensions, StatusBar } from "react-native";
import { createAppContainer, createDrawerNavigator, createStackNavigator, createSwitchNavigator, NavigationContainer, NavigationState } from "react-navigation";
import NotificationManager from "./notification/NotificationManager";
import Eula from "./screens/auth/eula/Eula";
import Login from "./screens/auth/login/Login";
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
const AuthNavigator: NavigationContainer = createStackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);

// Organizations Stack Navigation
const SitesNavigator: NavigationContainer = createStackNavigator(
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
const ChargersNavigator: NavigationContainer = createStackNavigator(
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
const TransactionsNavigator: NavigationContainer = createStackNavigator(
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

// Get the Notification Scheduler
const notificationManager: NotificationManager = NotificationManager.getInstance();
notificationManager.initialize();

// Drawer Navigation
const AppDrawerNavigator: NavigationContainer = createDrawerNavigator(
  {
    SitesNavigator,
    ChargersNavigator,
    TransactionsNavigator
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

const RootNavigator: NavigationContainer = createSwitchNavigator(
  {
    AuthNavigator,
    AppDrawerNavigator
  },
  {
    initialRouteName: "AuthNavigator"
  }
);

// Create a container to wrap the main navigator
const RootContainer: NavigationContainer = createAppContainer(RootNavigator);

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

const RootContainerPersists = () => (
  <RootContainer persistNavigationState={persistNavigationState} loadNavigationState={loadNavigationState} />
);

export default class App extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  public async componentDidMount() {
    // Activate
    notificationManager.setActive(true);
  }

  public async componentWillUnmount() {
    // Deactivate
    notificationManager.setActive(false);
  }

  // eslint-disable-next-line class-methods-use-this
  public render() {
    return (
      <Root>
        <StatusBar hidden={true} />
        <RootContainerPersists />
      </Root>
    );
  }
}
