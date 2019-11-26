import PagingParams from "../types/PagingParams";

export default class Constants {
  public static readonly SUPPORTED_LOCALES = ['en_US', 'fr_FR'];
  public static readonly SUPPORTED_LANGUAGES = ['en', 'fr', 'de'];
  public static readonly DEFAULT_LOCALE = 'en_US';
  public static readonly DEFAULT_LANGUAGE = 'en';

  public static readonly DEFAULT_DURATION = "00:00";
  public static readonly DEFAULT_DURATION_WITH_SECS = "00:00:00";

  // Auto Refresh
  public static readonly AUTO_REFRESH_DUPS_INTERVAL = 2 * 1000;
  public static readonly AUTO_REFRESH_ON_ERROR_PERIOD_MILLIS = 2 * 1000;
  public static readonly AUTO_REFRESH_SHORT_PERIOD_MILLIS = 3 * 1000;
  public static readonly AUTO_REFRESH_MEDIUM_PERIOD_MILLIS = 10 * 1000;
  public static readonly AUTO_REFRESH_LONG_PERIOD_MILLIS = 30 * 1000;

  public static readonly SEARCH_CHECK_PERIOD_MILLIS = 50;
  public static readonly ANIMATION_PERIOD_MILLIS = 5 * 1000;
  public static readonly ANIMATION_SHOW_HIDE_MILLIS = 500;
  public static readonly ANIMATION_ROTATION_MILLIS = 500;

  // Roles
  public static readonly ROLE_SUPER_ADMIN = "S";
  public static readonly ROLE_ADMIN = "A";
  public static readonly ROLE_BASIC = "B";
  public static readonly ROLE_DEMO = "D";

  public static readonly ENTITY_VEHICLE_MANUFACTURER = "VehicleManufacturer";
  public static readonly ENTITY_VEHICLE_MANUFACTURERS = "VehicleManufacturers";
  public static readonly ENTITY_VEHICLE = "Vehicle";
  public static readonly ENTITY_VEHICLES = "Vehicles";
  public static readonly ENTITY_USER = "User";
  public static readonly ENTITY_USERS = "Users";
  public static readonly ENTITY_TENANT = "Tenant";
  public static readonly ENTITY_TENANTS = "Tenants";
  public static readonly ENTITY_COMPANY = "Company";
  public static readonly ENTITY_COMPANIES = "Companies";
  public static readonly ENTITY_SETTING = "Setting";
  public static readonly ENTITY_SETTINGS = "Settings";
  public static readonly ENTITY_SITE = "Site";
  public static readonly ENTITY_SITES = "Sites";
  public static readonly ENTITY_SITE_AREA = "SiteArea";
  public static readonly ENTITY_SITE_AREAS = "SiteAreas";
  public static readonly ENTITY_TRANSACTION = "Transaction";
  public static readonly ENTITY_TRANSACTIONS = "Transactions";
  public static readonly ENTITY_CHARGING_STATION = "ChargingStation";
  public static readonly ENTITY_CHARGING_STATIONS = "ChargingStations";
  public static readonly ENTITY_LOGGING = "Logging";
  public static readonly ENTITY_LOGGINGS = "Loggings";

  public static readonly ACTION_CREATE = "Create";
  public static readonly ACTION_READ = "Read";
  public static readonly ACTION_UPDATE = "Update";
  public static readonly ACTION_DELETE = "Delete";
  public static readonly ACTION_LOGOUT = "Logout";
  public static readonly ACTION_LIST = "List";
  public static readonly ACTION_RESET = "Reset";
  public static readonly ACTION_CLEAR_CACHE = "ClearCache";
  public static readonly ACTION_REMOTE_START_TRANSACTION = "RemoteStartTransaction";
  public static readonly ACTION_REMOTE_STOP_TRANSACTION = "RemoteStopTransaction";
  public static readonly ACTION_REFUND_TRANSACTION = "RefundTransaction";
  public static readonly ACTION_UNLOCK_CONNECTOR = "UnlockConnector";
  public static readonly ACTION_GET_CONFIGURATION = "GetConfiguration";

  // Keystore
  public static readonly SHARED_PREFERENCES_NAME = "eMobilityPreferences";
  public static readonly KEYCHAIN_SERVICE = "eMobilityKeyChain";

  public static readonly KEY_CREDENTIALS = "credentials";
  public static readonly KEY_NAVIGATION_STATE = "navigation-state";

  // Paging
  public static readonly DEFAULT_PAGING: PagingParams = {
    limit: 10,
    skip: 0,
  };
  public static readonly ONLY_ONE_PAGING: PagingParams = {
    limit: 1,
    skip: 0,
  };
  public static readonly ONLY_RECORD_COUNT_PAGING: PagingParams = {
    limit: 10,
    skip: 0,
    onlyRecordCount: true
  };
  public static readonly PAGING_SIZE = 10;

  public static readonly CONN_STATUS_AVAILABLE = "Available";
  public static readonly CONN_STATUS_OCCUPIED = "Occupied";
  public static readonly CONN_STATUS_CHARGING = "Charging";
  public static readonly CONN_STATUS_FAULTED = "Faulted";
  public static readonly CONN_STATUS_RESERVED = "Reserved";
  public static readonly CONN_STATUS_FINISHING = "Finishing";
  public static readonly CONN_STATUS_PREPARING = "Preparing";
  public static readonly CONN_STATUS_SUSPENDED_EVSE = "SuspendedEVSE";
  public static readonly CONN_STATUS_SUSPENDED_EV = "SuspendedEV";
  public static readonly CONN_STATUS_UNAVAILABLE = "Unavailable";

  public static readonly CONN_TYPE_2 = "T2";
  public static readonly CONN_TYPE_COMBO_CCS = "CCS";
  public static readonly CONN_TYPE_CHADEMO = "C";
  public static readonly CONN_TYPE_DOMESTIC = "D";

  // Components
  public static readonly COMPONENTS = {
    ANALYTICS: "analytics",
    OCPI: "ocpi",
    ORGANIZATION: "organization",
    PRICING: "pricing",
    REFUND: "refund",
  };
}
