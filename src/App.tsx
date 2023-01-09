import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  getStateFromPath,
  InitialState, LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import I18n from 'i18n-js';
import {Icon, NativeBaseProvider} from 'native-base';
import React from 'react';
import {Appearance, ColorSchemeName, NativeEventSubscription, StatusBar, Text} from 'react-native';
import { scale } from 'react-native-size-matters';

import DeepLinkingManager from './deeplinking/DeepLinkingManager';
import I18nManager from './I18n/I18nManager';
import LocationManager from './location/LocationManager';
import MigrationManager from './migration/MigrationManager';
import Notifications from './notification/Notifications';
import CentralServerProvider from './provider/CentralServerProvider';
import ProviderFactory from './provider/ProviderFactory';
import Eula from './screens/auth/eula/Eula';
import Login from './screens/auth/login/Login';
import ResetPassword from './screens/auth/reset-password/ResetPassword';
import RetrievePassword from './screens/auth/retrieve-password/RetrievePassword';
import SignUp from './screens/auth/sign-up/SignUp';
import Cars from './screens/cars/Cars';
import ChargingStationActions from './screens/charging-stations/actions/ChargingStationActions';
import ChargingStationConnectorDetails from './screens/charging-stations/connector-details/ChargingStationConnectorDetails';
import ChargingStations from './screens/charging-stations/list/ChargingStations';
import ChargingStationOcppParameters from './screens/charging-stations/ocpp/ChargingStationOcppParameters';
import ChargingStationProperties from './screens/charging-stations/properties/ChargingStationProperties';
import Invoices from './screens/invoices/Invoices';
import PaymentMethods from './screens/payment-methods/PaymentMethods';
import StripePaymentMethodCreationForm from './screens/payment-methods/stripe/StripePaymentMethodCreationForm';
import ReportError from './screens/report-error/ReportError';
import Sidebar from './screens/sidebar/SideBar';
import SiteAreas from './screens/site-areas/SiteAreas';
import Sites from './screens/sites/Sites';
import Statistics from './screens/statistics/Statistics';
import Tags from './screens/tags/Tags';
import Tenants from './screens/tenants/Tenants';
import TransactionChart from './screens/transactions/chart/TransactionChart';
import TransactionDetails from './screens/transactions/details/TransactionDetails';
import TransactionsHistory from './screens/transactions/history/TransactionsHistory';
import TransactionsInProgress from './screens/transactions/in-progress/TransactionsInProgress';
import Users from './screens/users/list/Users';
import BaseProps from './types/BaseProps';
import SecuredStorage from './utils/SecuredStorage';
import Utils from './utils/Utils';
import { CheckVersionResponse } from 'react-native-check-version';
import AppUpdateDialog from './components/modal/app-update/AppUpdateDialog';
import AddCar from './screens/cars/AddCar';
import ChargingStationQrCode from './screens/home/ChargingStationQrCode';
import ThemeManager from './custom-theme/ThemeManager';
import TenantQrCode from './screens/tenants/TenantQrCode';
import computeStyleSheet from './AppStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Settings from './screens/settings/Settings';
import {hide} from 'react-native-bootsplash';
import {ThemeType} from './types/Theme';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import {AuthContext} from './context/AuthContext';
import Loading from './screens/loading/Loading';
import {Notification} from './types/UserNotifications';
import Configuration from './config/Configuration';
import {RootSiblingParent} from 'react-native-root-siblings';

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

function createAuthNavigator(props: BaseProps) {
  return (
    <AuthStack.Navigator initialRouteName={'Login'} screenOptions={{ headerShown: false }}>
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
    <StatsStack.Navigator initialRouteName="Statistics" screenOptions={{ headerShown: false }}>
      <StatsStack.Screen name="Statistics" component={Statistics} initialParams={props?.route?.params?.params} />
    </StatsStack.Navigator>
  );
}

function createReportErrorNavigator(props: BaseProps) {
  return (
    <ReportErrorStack.Navigator initialRouteName="ReportError" screenOptions={{ headerShown: false }}>
      <ReportErrorStack.Screen name="ReportError" component={ReportError} initialParams={props?.route?.params?.params} />
    </ReportErrorStack.Navigator>
  );
}

function getTabStyle(): any {
  const commonColor = Utils.getCurrentCommonColor();
  return {
    backgroundColor: commonColor.containerBgColor,
    borderTopWidth: 0.5,
    borderTopColor: commonColor.disabledDark,
    paddingTop: 0,
    marginTop: 0
  };
}

function createChargingStationDetailsTabsNavigator(props: BaseProps) {
  const commonColor = Utils.getCurrentCommonColor();
  const barStyle = getTabStyle();
  const style = computeStyleSheet();
  return (
    <ChargingStationDetailsTabs.Navigator
      initialRouteName="ChargingStationActions"
      activeColor={commonColor.textColor}
      inactiveColor={commonColor.disabledDark}
      barStyle={barStyle}
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
  const barStyle = getTabStyle();
  const style = computeStyleSheet();
  return (
    <ChargingStationConnectorDetailsTabs.Navigator
      initialRouteName="ChargingStationConnectorDetails"
      activeColor={commonColor.textColor}
      inactiveColor={commonColor.disabledDark}
      barStyle={barStyle}
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
  const barStyle = getTabStyle();
  const style = computeStyleSheet();
  return (
    <TransactionDetailsTabs.Navigator
      initialRouteName="TransactionDetails"
      activeColor={commonColor.textColor}
      inactiveColor={commonColor.disabledDark}
      barStyle={barStyle}
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
    <SitesStack.Navigator initialRouteName="Sites" screenOptions={{ headerShown: false }}>
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

function ChargingStationsNavigator(props: BaseProps) {
  return (
    <ChargingStationsStack.Navigator initialRouteName="ChargingStations" screenOptions={{ headerShown: false, gestureEnabled: false }}>
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

function TransactionHistoryNavigator(props: BaseProps) {
  return (
    <TransactionHistoryStack.Navigator initialRouteName="TransactionsHistory" screenOptions={{ headerShown: false }}>
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

function TransactionInProgressNavigator(props: BaseProps) {
  return (
    <TransactionInProgressStack.Navigator initialRouteName="TransactionsInProgress" screenOptions={{ headerShown: false }}>
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
    <UsersStack.Navigator initialRouteName="Users" screenOptions={{ headerShown: false }}>
      <UsersStack.Screen name="Users" component={Users} initialParams={props?.route?.params?.params} />
    </UsersStack.Navigator>
  );
}

function createTagsNavigator(props: BaseProps) {
  return (
    <TagsStack.Navigator initialRouteName="Tags" screenOptions={{ headerShown: false }}>
      <TagsStack.Screen name="Tags" component={Tags} initialParams={props?.route?.params?.params} />
    </TagsStack.Navigator>
  );
}

function createCarsNavigator(props: BaseProps) {
  return (
    <CarsStack.Navigator initialRouteName="Cars" screenOptions={{ headerShown: false }}>
      <CarsStack.Screen name="Cars" component={Cars} initialParams={props?.route?.params?.params} />
      <CarsStack.Screen name={'AddCar'} component={AddCar} initialParams={props?.route?.params?.params} />
    </CarsStack.Navigator>
  );
}

function InvoicesNavigator(props: BaseProps) {
  return (
    <InvoicesStack.Navigator initialRouteName="Invoices" screenOptions={{ headerShown: false }}>
      <InvoicesStack.Screen name="Invoices" component={Invoices} initialParams={props?.route?.params?.params} />
    </InvoicesStack.Navigator>
  );
}

function createPaymentMethodsNavigator(props: BaseProps) {
  return (
    <PaymentMethodsStack.Navigator initialRouteName="PaymentMethods" screenOptions={{ headerShown: false }}>
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
    <SettingsStack.Navigator initialRouteName="Settings" screenOptions={{ headerShown: false }}>
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
      backBehavior={'initialRoute'}
      drawerPosition="left"
      drawerContent={(drawerProps) => <Sidebar {...drawerProps} />}>
      <AppDrawer.Screen name="ChargingStationsNavigator" component={ChargingStationsNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="QRCodeScanner" component={ChargingStationQrCode} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="SitesNavigator" children={createSitesNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="StatisticsNavigator" children={createStatsNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="ReportErrorNavigator" children={createReportErrorNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="TransactionHistoryNavigator" component={TransactionHistoryNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="TransactionInProgressNavigator" component={TransactionInProgressNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="UsersNavigator" children={createUsersNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="TagsNavigator" children={createTagsNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="CarsNavigator" children={createCarsNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="InvoicesNavigator" component={InvoicesNavigator} initialParams={props?.route?.params?.params} />
      <AppDrawer.Screen name="PaymentMethodsNavigator" children={createPaymentMethodsNavigator} initialParams={props?.route?.params?.params}/>
      <AppDrawer.Screen name="SettingsNavigator" children={createSettingsNavigator} initialParams={props?.route?.params?.params}/>
    </AppDrawer.Navigator>
  );
}

export interface Props {}
interface State {
  navigationState?: InitialState;
  showAppUpdateDialog?: boolean;
  isSignedIn?: boolean;
  theme?: ColorSchemeName;
}

export default class App extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public centralServerProvider: CentralServerProvider;
  public deepLinkingManager: DeepLinkingManager;
  private appVersion: CheckVersionResponse;
  private location: LocationManager;
  private themeSubscription: NativeEventSubscription;
  private readonly navigationRef: React.RefObject<NavigationContainerRef<ReactNavigation.RootParamList>>;
  private readonly appContext;
  private initialUrl: string;

  public constructor(props: Props) {
    super(props);
    this.navigationRef = React.createRef();
    this.appContext = {
      handleSignIn: () => this.setState({isSignedIn: true}),
      handleSignOut: () => this.setState({isSignedIn: false})
    };
    this.state = {
      navigationState: null,
      showAppUpdateDialog: false,
      isSignedIn: undefined
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };


  public async componentDidMount() {
    // Set up theme
    const themeManager = ThemeManager.getInstance();
    themeManager.setThemeType(Appearance.getColorScheme() as ThemeType);
    // Listen for theme changes
    this.themeSubscription = Appearance.addChangeListener(({ colorScheme }) => {
      themeManager.setThemeType(Appearance.getColorScheme() as ThemeType);
      this.setState({theme: colorScheme});
    });

    // Get the central server
    this.centralServerProvider = await ProviderFactory.getProvider();

    // Set up location
    this.location = await LocationManager.getInstance();
    this.location.startListening();

    // Perform local data migration
    const migrationManager = MigrationManager.getInstance();
    await migrationManager.migrate();

    // Setup notifications
    await Notifications.initialize();

    // Store initial url through which app was launched (if any)
    const initialNotification = await messaging().getInitialNotification() as Notification;
    const canHandleNotification = await Notifications.canHandleNotification(initialNotification);
    let tenantSubdomain: string;
    if (canHandleNotification) {
      tenantSubdomain = initialNotification.data.tenantSubdomain;
      // Store the initial url because second call returns null
      this.initialUrl = initialNotification.data.deepLink;
    }

    // Set authentication state
    let isSignedIn = false;
    try {
      const userCredentials = await SecuredStorage.getUserCredentials(tenantSubdomain);
      if (userCredentials?.password && userCredentials?.email && userCredentials?.tenantSubDomain) {
        await this.centralServerProvider.login(userCredentials.email, userCredentials.password, true, userCredentials.tenantSubDomain);
        isSignedIn = true;
      } else {
        this.initialUrl = `${Configuration.AWS_REST_ENDPOINT_PROD}/login?tenantSubDomain=${userCredentials?.tenantSubDomain}`;
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }

    // Check for app updates
    this.appVersion = await Utils.checkForUpdate();
    // Set
    this.setState({
      showAppUpdateDialog: !!this.appVersion?.needsUpdate,
      isSignedIn
    });
  }

  public componentWillUnmount() {
    this.themeSubscription?.remove();
    this.deepLinkingManager?.stopListening();
    this.location?.stopListening();
  }

  public render() {
    const { showAppUpdateDialog, isSignedIn } = this.state;
    return (
      <NativeBaseProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootSiblingParent>
            {showAppUpdateDialog && (
              <AppUpdateDialog appVersion={this.appVersion} close={() => this.setState({ showAppUpdateDialog: false })} />
            )}
            <StatusBar barStyle={ThemeManager.getInstance()?.isThemeTypeIsDark() ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
            {isSignedIn == null ?
              <Loading/>
              :
              this.createRootNavigator()
            }
          </RootSiblingParent>
        </GestureHandlerRootView>
      </NativeBaseProvider>
    );
  }

  private buildLinking(): LinkingOptions<ReactNavigation.RootParamList> {
    return (
      {
        prefixes: DeepLinkingManager.getAuthorizedURLs(),
        getInitialURL: () => this.initialUrl,
        subscribe: (listener) => {
          // Listen for background notifications when the app is running,
          const removeBackgroundNotificationListener = messaging().onNotificationOpenedApp(async (remoteMessage: Notification) => {
            const canHandleNotification = await Notifications.canHandleNotificationOpenedApp(remoteMessage);
            if (canHandleNotification) {
              this.setState({isSignedIn: true}, () => listener(remoteMessage.data.deepLink));
            }
          });
          // Listen for FCM token refresh event
          const removeTokenRefreshEventListener = messaging().onTokenRefresh((token) => {
            void Notifications.onTokenRefresh(token);
          });
          return () => {
            removeBackgroundNotificationListener();
            removeTokenRefreshEventListener();
          };
        },
        config: {
          screens: {
            AuthNavigator: {
              screens: {
                Login: 'login'
              }
            },
            AppDrawerNavigator: {
              initialRouteName: 'ChargingStationsNavigator',
              screens: {
                ChargingStationsNavigator: {
                  initialRouteName: 'ChargingStations',
                  screens: {
                    ChargingStations: 'charging-stations/all'
                  }
                },
                InvoicesNavigator: 'invoices',
                TransactionInProgressNavigator: {
                  screens: {
                    TransactionsInProgress: 'transactions/inprogress'
                  }
                },
                TransactionHistoryNavigator: {
                  screens: {
                    TransactionsHistory: 'transactions/history'
                  }
                }
              }
            }
          }
        },
        getStateFromPath:  (url, options) => {
          const path = url.split('/')?.[1].split('#')?.[0].split('?')?.[0];
          const query = url.split('?')?.[1]?.split('#')?.[0];
          const fragment = url.split('#')?.[1];
          const newURL = path + (fragment ? '/' + fragment : '') + (query ? '?' + query : '');
          return getStateFromPath(newURL, options);
        }
      }
    );
  }

  private createRootNavigator() {
    const { isSignedIn } = this.state;
    return (
      <AuthContext.Provider value={this.appContext}>
        <SafeAreaProvider>
          <NavigationContainer
            onReady={() => this.onReady()}
            linking={this.buildLinking()}
            ref={this.navigationRef}
            onStateChange={(newState) => this.setState({navigationState: newState})}
            initialState={this.state.navigationState}
          >
            <rootStack.Navigator initialRouteName="AuthNavigator" screenOptions={{ headerShown: false }}>
              {isSignedIn ?
                <rootStack.Screen name="AppDrawerNavigator">
                  {createAppDrawerNavigator}
                </rootStack.Screen>
                :
                <rootStack.Screen options={{animationTypeForReplace: 'pop'}} name="AuthNavigator" children={createAuthNavigator} />
              }
            </rootStack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthContext.Provider>
    );
  }

  private onReady(): void {
    void hide({ fade: true });
    // Set up deep linking
    this.deepLinkingManager = DeepLinkingManager.getInstance();
    this.deepLinkingManager?.initialize(this.navigationRef?.current, this.centralServerProvider);
    // Activate Deep links
    this.deepLinkingManager.startListening();
  }
}
