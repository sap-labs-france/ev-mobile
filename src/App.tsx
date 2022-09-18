import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { InitialState, NavigationContainer, NavigationState } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { CheckVersionResponse } from 'react-native-check-version';
import { RootSiblingParent } from 'react-native-root-siblings';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import computeStyleSheet from './AppStyles';
import AppUpdateDialog from './components/modal/app-update/AppUpdateDialog';
import ThemeManager from './custom-theme/ThemeManager';
import DeepLinkingManager from './deeplinking/DeepLinkingManager';
import I18nManager from './I18n/I18nManager';
import LocationManager from './location/LocationManager';
import MigrationManager from './migration/MigrationManager';
import NotificationManager from './notification/NotificationManager';
import CentralServerProvider from './provider/CentralServerProvider';
import ProviderFactory from './provider/ProviderFactory';
import Eula from './screens/auth/eula/Eula';
import Login from './screens/auth/login/Login';
import ResetPassword from './screens/auth/reset-password/ResetPassword';
import RetrievePassword from './screens/auth/retrieve-password/RetrievePassword';
import SignUp from './screens/auth/sign-up/SignUp';
import AddCar from './screens/cars/AddCar';
import Cars from './screens/cars/Cars';
import ChargingStationActions from './screens/charging-stations/actions/ChargingStationActions';
import ChargingStationConnectorDetails from './screens/charging-stations/connector-details/ChargingStationConnectorDetails';
import ChargingStations from './screens/charging-stations/list/ChargingStations';
import ChargingStationOcppParameters from './screens/charging-stations/ocpp/ChargingStationOcppParameters';
import ChargingStationProperties from './screens/charging-stations/properties/ChargingStationProperties';
import ChargingStationQrCode from './screens/home/ChargingStationQrCode';
import Invoices from './screens/invoices/Invoices';
import PaymentMethods from './screens/payment-methods/PaymentMethods';
import StripePaymentMethodCreationForm from './screens/payment-methods/stripe/StripePaymentMethodCreationForm';
import ReportError from './screens/report-error/ReportError';
import Settings from './screens/settings/Settings';
import Sidebar from './screens/sidebar/SideBar';
import SiteAreas from './screens/site-areas/SiteAreas';
import Sites from './screens/sites/Sites';
import Statistics from './screens/statistics/Statistics';
import Tags from './screens/tags/Tags';
import TenantQrCode from './screens/tenants/TenantQrCode';
import Tenants from './screens/tenants/Tenants';
import TransactionChart from './screens/transactions/chart/TransactionChart';
import TransactionDetails from './screens/transactions/details/TransactionDetails';
import TransactionsHistory from './screens/transactions/history/TransactionsHistory';
import TransactionsInProgress from './screens/transactions/in-progress/TransactionsInProgress';
import Users from './screens/users/list/Users';
import BaseProps from './types/BaseProps';
import SecuredStorage from './utils/SecuredStorage';
import Utils from './utils/Utils';

// Init i18n
I18nManager.initialize();

// Navigation Stack variable
const AuthStack = createStackNavigator();
const StatsStack = createStackNavigator();
const ReportErrorStack = createStackNavigator();
const SitesStack = createStackNavigator();
const ChargingStationsStack = createStackNavigator();
const TransactionHistoryStack = createStackNavigator();
const TransactionInProgressStack = createStackNavigator();
const rootStack = createStackNavigator();
const UsersStack = createStackNavigator();
const TagsStack = createStackNavigator();
const CarsStack = createStackNavigator();
const InvoicesStack = createStackNavigator();
const PaymentMethodsStack = createStackNavigator();
const SettingsStack = createStackNavigator();

// Navigation Tab variable
const ChargingStationDetailsTabs = createMaterialBottomTabNavigator();
const ChargingStationConnectorDetailsTabs = createMaterialBottomTabNavigator();
const TransactionDetailsTabs = createMaterialBottomTabNavigator();

// Navigation Drawer variable
const AppDrawer = createDrawerNavigator();

type TabBarIconType =
  | 'AntDesign'
  | 'Entypo'
  | 'EvilIcons'
  | 'Feather'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Foundation'
  | 'Ionicons'
  | 'MaterialCommunityIcons'
  | 'MaterialIcons'
  | 'Octicons'
  | 'SimpleLineIcons'
  | 'Zocial';

function getCardStyle(): any {
  const insets = useSafeAreaInsets();
  return {
    paddingBottom: insets.bottom,
  };
}

function getBarStyle(): any {
  const commonColor = Utils.getCurrentCommonColor();
  const insets = useSafeAreaInsets();
  return {
    backgroundColor: commonColor.containerBgColor,
    borderTopWidth: 0.5,
    borderTopColor: commonColor.disabledDark,
    paddingBottom: insets.bottom,
    paddingTop: 0,
    marginTop: 0
  };
}

const createTabBarIcon = (
  props: { focused: boolean; tintColor?: string; horizontal?: boolean },
  type: any,
  name: string
): React.ReactNode => {
  const commonColor = Utils.getCurrentCommonColor();
  return (
    <Icon
      style={{
        color: props.focused ? commonColor.textColor : commonColor.disabledDark,
      }}
      size={scale(21)}
      as={type}
      name={name}
    />
  );
};

const persistNavigationState = async (navigationState: NavigationState) => {
  try {
    await SecuredStorage.saveNavigationState(navigationState);
  } catch (error) {
    console.log(error);
  }
};

function createAuthNavigator(props: BaseProps) {
  return (
    <AuthStack.Navigator
      initialRouteName={'Login'}
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <AuthStack.Screen name="Login" component={Login} initialParams={props?.route?.params?.params} />
      <AuthStack.Screen name="Tenants" component={Tenants} initialParams={props?.route?.params?.params} />
      <AuthStack.Screen name="TenantQrCode" component={TenantQrCode} initialParams={props?.route?.params?.params} />
      <AuthStack.Screen name="Eula" component={Eula} initialParams={props?.route?.params?.params} />
      <AuthStack.Screen name="SignUp" component={SignUp} initialParams={props?.route?.params?.params} />
      <AuthStack.Screen name="ResetPassword" component={ResetPassword} initialParams={props?.route?.params?.params} />
      <AuthStack.Screen name="RetrievePassword" component={RetrievePassword} initialParams={props?.route?.params?.params} />
    </AuthStack.Navigator>
  );
}

function createStatsNavigator(props: BaseProps) {
  return (
    <StatsStack.Navigator
      initialRouteName="Statistics"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <StatsStack.Screen name="Statistics" component={Statistics} initialParams={props?.route?.params?.params} />
    </StatsStack.Navigator>
  );
}

function createReportErrorNavigator(props: BaseProps) {
  return (
    <ReportErrorStack.Navigator
      initialRouteName="ReportError"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}>
      <ReportErrorStack.Screen name="ReportError" component={ReportError} initialParams={props?.route?.params?.params} />
    </ReportErrorStack.Navigator>
  );
}

function createChargingStationDetailsTabsNavigator(props: BaseProps) {
  const commonColor = Utils.getCurrentCommonColor();
  const style = computeStyleSheet();
  return (
    <ChargingStationDetailsTabs.Navigator
      initialRouteName="ChargingStationActions"
      activeColor={commonColor.textColor}
      inactiveColor={commonColor.disabledDark}
      barStyle={getBarStyle()}
      labeled
      backBehavior={'initialRoute'}
    >
      <ChargingStationDetailsTabs.Screen
        name="ChargingStationActions"
        component={ChargingStationActions}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('chargers.actions')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, MaterialIcons, 'build')
        }}
      />
      <ChargingStationDetailsTabs.Screen
        name="ChargingStationOcppParameters"
        component={ChargingStationOcppParameters}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('chargers.ocpp')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, MaterialIcons, 'format-list-bulleted')
        }}
      />
      <ChargingStationDetailsTabs.Screen
        name="ChargingStationProperties"
        component={ChargingStationProperties}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('chargers.properties')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, MaterialIcons, 'info')
        }}
      />
    </ChargingStationDetailsTabs.Navigator>
  );
}

function createChargingStationConnectorDetailsTabsNavigator(props: BaseProps) {
  const commonColor = Utils.getCurrentCommonColor();
  const style = computeStyleSheet();
  return (
    <ChargingStationConnectorDetailsTabs.Navigator
      initialRouteName="ChargingStationConnectorDetails"
      activeColor={commonColor.textColor}
      inactiveColor={commonColor.disabledDark}
      barStyle={getBarStyle()}
      labeled
      backBehavior={'initialRoute'}

    >
      <ChargingStationConnectorDetailsTabs.Screen
        name="ChargingStationConnectorDetails"
        component={ChargingStationConnectorDetails}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('sites.chargePoint')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, FontAwesome, 'bolt')
        }}
      />
      <ChargingStationConnectorDetailsTabs.Screen
        name="TransactionChart"
        component={TransactionChart}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('details.graph')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, MaterialCommunityIcons, 'chart-areaspline-variant')
        }}
      />
    </ChargingStationConnectorDetailsTabs.Navigator>
  );
}

function createTransactionDetailsTabsNavigator(props: BaseProps) {
  const commonColor = Utils.getCurrentCommonColor();
  const style = computeStyleSheet();
  return (
    <TransactionDetailsTabs.Navigator
      initialRouteName="TransactionDetails"
      activeColor={commonColor.textColor}
      inactiveColor={commonColor.disabledDark}
      barStyle={getBarStyle()}
      labeled
      backBehavior={'initialRoute'}
    >
      <TransactionDetailsTabs.Screen
        name="TransactionDetails"
        component={TransactionDetails}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('transactions.transaction')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, FontAwesome, 'bolt')
        }}
      />
      <TransactionDetailsTabs.Screen
        name="TransactionChart"
        component={TransactionChart}
        initialParams={props?.route?.params?.params}
        options={{
          tabBarLabel: <Text style={style.bottomTabsIcon}>{I18n.t('details.graph')}</Text>,
          tabBarIcon: (iconProps) => createTabBarIcon(iconProps, MaterialCommunityIcons, 'chart-areaspline-variant')
        }}
      />
    </TransactionDetailsTabs.Navigator>
  );
}

function createSitesNavigator(props: BaseProps) {
  return (
    <SitesStack.Navigator
      initialRouteName="Sites"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <SitesStack.Screen
        name="Sites"
        component={Sites}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="SiteAreas"
        component={SiteAreas}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="ChargingStations"
        component={ChargingStations}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="AddCar" component={AddCar}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="AddPaymentMethod"
        component={StripePaymentMethodCreationForm}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen name="ChargingStationDetailsTabs"
        children={createChargingStationDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="ChargingStationConnectorDetailsTabs"
        children={createChargingStationConnectorDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="TransactionDetailsTabs"
        children={createTransactionDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
      <SitesStack.Screen
        name="ReportError"
        component={ReportError}
        initialParams={props?.route?.params?.params}
      />
    </SitesStack.Navigator>
  );
}

function createChargingStationsNavigator(props: BaseProps) {
  return (
    <ChargingStationsStack.Navigator
      initialRouteName="ChargingStations"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyle: getCardStyle()
      }}
    >
      <ChargingStationsStack.Screen
        name="ChargingStations"
        component={ChargingStations}
        initialParams={props?.route?.params?.params}
      />
      <ChargingStationsStack.Screen
        name="ChargingStationDetailsTabs"
        initialParams={props?.route?.params?.params}
        children={createChargingStationDetailsTabsNavigator}
      />
      <ChargingStationsStack.Screen
        name="ChargingStationConnectorDetailsTabs"
        children={createChargingStationConnectorDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
      <ChargingStationsStack.Screen name="AddCar" component={AddCar} initialParams={props?.route?.params?.params} />
      <ChargingStationsStack.Screen
        name="AddPaymentMethod"
        component={StripePaymentMethodCreationForm}
        initialParams={props?.route?.params?.params}
      />
      <ChargingStationsStack.Screen name="QRCodeScanner" component={ChargingStationQrCode} initialParams={props?.route?.params?.params} />
      <ChargingStationsStack.Screen
        name="TransactionDetailsTabs"
        children={createTransactionDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
      <ChargingStationsStack.Screen
        name="ReportError"
        component={ReportError}
        initialParams={props?.route?.params?.params}
      />
    </ChargingStationsStack.Navigator>
  );
}

function createTransactionHistoryNavigator(props: BaseProps) {
  return (
    <TransactionHistoryStack.Navigator
      initialRouteName="TransactionsHistory"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <TransactionHistoryStack.Screen
        name="TransactionsHistory"
        component={TransactionsHistory}
        initialParams={props?.route?.params?.params}
      />
      <TransactionHistoryStack.Screen
        name="TransactionDetailsTabs"
        children={createTransactionDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
    </TransactionHistoryStack.Navigator>
  );
}

function createTransactionInProgressNavigator(props: BaseProps) {
  return (
    <TransactionInProgressStack.Navigator
      initialRouteName="TransactionsInProgress"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <TransactionInProgressStack.Screen
        name="TransactionsInProgress"
        component={TransactionsInProgress}
        initialParams={props?.route?.params?.params}
      />
      <TransactionInProgressStack.Screen
        name="ChargingStationConnectorDetailsTabs"
        children={createChargingStationConnectorDetailsTabsNavigator}
        initialParams={props?.route?.params?.params}
      />
    </TransactionInProgressStack.Navigator>
  );
}

function createUsersNavigator(props: BaseProps) {
  return (
    <UsersStack.Navigator
      initialRouteName="Users"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <UsersStack.Screen name="Users" component={Users} initialParams={props?.route?.params?.params} />
    </UsersStack.Navigator>
  );
}

function createTagsNavigator(props: BaseProps) {
  return (
    <TagsStack.Navigator initialRouteName="Tags"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <TagsStack.Screen name="Tags" component={Tags} initialParams={props?.route?.params?.params} />
    </TagsStack.Navigator>
  );
}

function createCarsNavigator(props: BaseProps) {
  return (
    <CarsStack.Navigator
      initialRouteName="Cars"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <CarsStack.Screen name="Cars" component={Cars} initialParams={props?.route?.params?.params} />
      <CarsStack.Screen name={'AddCar'} component={AddCar} initialParams={props?.route?.params?.params} />
    </CarsStack.Navigator>
  );
}

function createInvoicesNavigator(props: BaseProps) {
  return (
    <InvoicesStack.Navigator
      initialRouteName="Invoices"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <InvoicesStack.Screen name="Invoices" component={Invoices} initialParams={props?.route?.params?.params} />
    </InvoicesStack.Navigator>
  );
}

function createPaymentMethodsNavigator(props: BaseProps) {
  return (
    <PaymentMethodsStack.Navigator
      initialRouteName="PaymentMethods"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <PaymentMethodsStack.Screen
        name="PaymentMethods"
        component={PaymentMethods}
        initialParams={props?.route?.params?.params}
      />
      <PaymentMethodsStack.Screen
        name="StripePaymentMethodCreationForm"
        component={StripePaymentMethodCreationForm}
        initialParams={props?.route?.params?.params}
      />
    </PaymentMethodsStack.Navigator>
  );
}

function createSettingsNavigator(props: BaseProps) {
  return (
    <SettingsStack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: false,
        cardStyle: getCardStyle()
      }}
    >
      <SettingsStack.Screen
        name="Settings"
        component={Settings}
        initialParams={props?.route?.params?.params}
      />
    </SettingsStack.Navigator>
  );
}

function createAppDrawerNavigator(props: BaseProps) {
  return (
    <AppDrawer.Navigator
      initialRouteName="ChargingStationsNavigator"
      screenOptions={(drawerProps) => ({
        headerShown: false,
        drawerType: 'front',
        swipeEnabled: false,
        swipeEdgeWidth: scale(50),
        unmountOnBlur: false,
        drawerStyle: {
          width: '83%'
        }
      })}
      backBehavior={'history'}
      drawerPosition="left"
      drawerContent={(drawerProps) => <Sidebar {...drawerProps} />}>
      <AppDrawer.Screen name="ChargingStationsNavigator" children={createChargingStationsNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="QRCodeScanner" component={ChargingStationQrCode} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="SitesNavigator" children={createSitesNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="StatisticsNavigator" children={createStatsNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="ReportErrorNavigator" children={createReportErrorNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="TransactionHistoryNavigator" children={createTransactionHistoryNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="TransactionInProgressNavigator" children={createTransactionInProgressNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="UsersNavigator" children={createUsersNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="TagsNavigator" children={createTagsNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="CarsNavigator" children={createCarsNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="InvoicesNavigator" children={createInvoicesNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="PaymentMethodsNavigator" children={createPaymentMethodsNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="SettingsNavigator" children={createSettingsNavigator} initialParams={props?.route?.params?.params}/>
    </AppDrawer.Navigator>
  );
}

export interface Props {}
interface State {
  switchTheme?: boolean;
  isNavigationStateLoaded?: boolean;
  navigationState?: InitialState;
  showAppUpdateDialog?: boolean;
}

export default class App extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public notificationManager: NotificationManager;
  public deepLinkingManager: DeepLinkingManager;
  public centralServerProvider: CentralServerProvider;
  private location: LocationManager;
  private appVersion: CheckVersionResponse;

  public constructor(props: Props) {
    super(props);
    this.state = {
      switchTheme: false,
      navigationState: null,
      isNavigationStateLoaded: false,
      showAppUpdateDialog: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async componentDidMount() {
    // Load Navigation State
    const navigationState = await SecuredStorage.getNavigationState();
    // Get the central server
    this.centralServerProvider = await ProviderFactory.getProvider();
    // Init Notification --------------------------------------
    this.notificationManager = NotificationManager.getInstance();
    this.notificationManager.setCentralServerProvider(this.centralServerProvider);
    await this.notificationManager.start();
    // Assign
    this.centralServerProvider.setNotificationManager(this.notificationManager);
    // Init Deep Linking ---------------------------------------
    this.deepLinkingManager = DeepLinkingManager.getInstance();
    // Activate Deep links
    this.deepLinkingManager.startListening();
    // Location ------------------------------------------------
    this.location = await LocationManager.getInstance();
    this.location.startListening();
    // Check migration
    const migrationManager = MigrationManager.getInstance();
    migrationManager.setCentralServerProvider(this.centralServerProvider);
    await migrationManager.migrate();
    // Check for app updates
    this.appVersion = await Utils.checkForUpdate();
    // Set
    this.setState({
      navigationState,
      isNavigationStateLoaded: true,
      showAppUpdateDialog: !!this.appVersion?.needsUpdate
    });
  }

  public componentWillUnmount() {
    // Deactivate Deep links
    this.deepLinkingManager?.stopListening();
    // Stop Notifications
    this.notificationManager?.stop();
    // Stop Location
    this.location?.stopListening();
  }

  public render() {
    const { showAppUpdateDialog } = this.state;
    return (
      this.state.isNavigationStateLoaded && (
        <RootSiblingParent>
          {showAppUpdateDialog && (
            <AppUpdateDialog appVersion={this.appVersion} close={() => this.setState({ showAppUpdateDialog: false })} />
          )}
          <StatusBar barStyle={ThemeManager.getInstance()?.isThemeTypeIsDark() ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
          {this.createRootNavigator()}
        </RootSiblingParent>
      )
    );
  }

  private createRootNavigator() {
    return (
      <SafeAreaProvider>
        <NavigationContainer
          ref={(navigatorRef) => {
            if (navigatorRef) {
              this.notificationManager?.initialize(navigatorRef);
              this.notificationManager.checkOnHoldNotification();
              this.deepLinkingManager?.initialize(navigatorRef, this.centralServerProvider);
            }
          }}
          onStateChange={persistNavigationState}
          initialState={this.state.navigationState}>
          <rootStack.Navigator initialRouteName="AuthNavigator" screenOptions={{ headerShown: false }}>
            <rootStack.Screen name="AuthNavigator" children={createAuthNavigator} />
            <rootStack.Screen name="AppDrawerNavigator" children={createAppDrawerNavigator} />
          </rootStack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
