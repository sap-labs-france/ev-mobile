import React from "react";
import { StatusBar, Dimensions } from "react-native";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Root } from "native-base";
import Login from "./screens/auth/login/Login";
import Eula from "./screens/auth/eula/Eula";
import RetrievePassword from "./screens/auth/retrieve-password/RetrievePassword";
import SignUp from "./screens/auth/sign-up/SignUp";
import Sidebar from "./screens/sidebar/SideBar";
import Sites from "./screens/sites/Sites";
import SiteAreas from "./screens/site-areas/SiteAreas";
import Chargers from "./screens/chargers/Chargers";
import TransactionTabs from "./screens/transactions/TransactionTabs";
import ChargerDetailsTabs from "./screens/charger-details/ChargerDetailsTabs";
import TransactionChartContainer from "./screens/transactions/chart/TransactionChartContainer";
import NotificationManager from "./notification/NotificationManager";
import Utils from "./utils/Utils";
import SecuredStorage from "./utils/SecuredStorage";
import moment from "moment";

// Get the supported locales
require("moment/locale/fr");
require("moment/locale/de");
require("moment/locale/en-gb");
// Set the current locale
moment.locale(Utils.getLocaleShort());

// Auth Stack Navigation
const AuthNavigator = createStackNavigator(
  {
    Login: { screen: Login },
    Eula: { screen: Eula },
    SignUp: { screen: SignUp },
    RetrievePassword: { screen: RetrievePassword }
  },
  {
    initialRouteName: "Login",
    header: null,
    headerMode: "none"
  }
);

// Organizations Stack Navigation
const SitesNavigator = createStackNavigator(
  {
    Sites: { screen: Sites },
    SiteAreas: { screen: SiteAreas },
    Chargers: { screen: Chargers },
    ChargerDetailsTabs: { screen: ChargerDetailsTabs }
  },
  {
    initialRouteName: "Sites",
    header: null,
    headerMode: "none"
  }
);

// Chargers Stack Navigation
const ChargersNavigator = createStackNavigator(
  {
    Chargers: { screen: Chargers },
    ChargerDetailsTabs: { screen: ChargerDetailsTabs }
  },
  {
    initialRouteName: "Chargers",
    header: null,
    headerMode: "none"
  }
);

// Transactions Stack Navigation
const TransactionsNavigator = createStackNavigator(
  {
    TransactionTabs: { screen: TransactionTabs },
    ChargerDetailsTabs: { screen: ChargerDetailsTabs },
    TransactionChart: { screen: TransactionChartContainer }
  },
  {
    initialRouteName: "TransactionTabs",
    header: null,
    headerMode: "none"
  }
);

// Get the Notification Scheduler
const _notificationManager = NotificationManager.getInstance();
// Initialize
_notificationManager.initialize();

// Drawer Navigation
const AppDrawerNavigator = createDrawerNavigator(
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
    header: null,
    headerMode: "none",
    drawerPosition: "right",
    contentComponent: (props) => <Sidebar {...props} />
  }
);

const RootNavigator = createSwitchNavigator(
  {
    AuthNavigator,
    AppDrawerNavigator
  },
  {
    initialRouteName: "AuthNavigator"
  }
);

// Create a container to wrap the main navigator
const RootContainer = createAppContainer(RootNavigator);

// Handle persistence of navigation
const persistNavigationState = async (navigationState) => {
  try {
    await SecuredStorage.saveNavigationState(navigationState);
  } catch (error) {
    // eslint-disable-next-line no-console
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
  async componentDidMount() {
    // Activate
    _notificationManager.setActive(true);
  }

  async componentWillUnmount() {
    // Deactivate
    this._notificationManager.setActive(false);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Root>
        <StatusBar hidden={true} />
        <RootContainerPersists />
      </Root>
    );
  }
}
