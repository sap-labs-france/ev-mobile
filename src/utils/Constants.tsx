import PagingParams from "../types/PagingParams";

export default class Constants {
  public static DEFAULT_DURATION = "00:00";
  public static DEFAULT_DURATION_WITH_SECS = "00:00:00";

  // Auto Refresh
  public static AUTO_REFRESH_ON_ERROR_PERIOD_MILLIS = 2 * 1000;
  public static AUTO_REFRESH_SHORT_PERIOD_MILLIS = 4 * 1000;
  public static AUTO_REFRESH_MEDIUM_PERIOD_MILLIS = 8 * 1000;
  public static AUTO_REFRESH_LONG_PERIOD_MILLIS = 16 * 1000;

  public static SEARCH_CHECK_PERIOD_MILLIS = 50;
  public static ANIMATION_PERIOD_MILLIS = 5 * 1000;
  public static ANIMATION_SHOW_HIDE_MILLIS = 500;
  public static ANIMATION_ROTATION_MILLIS = 500;

  // Roles
  public static ROLE_SUPER_ADMIN = "S";
  public static ROLE_ADMIN = "A";
  public static ROLE_BASIC = "B";
  public static ROLE_DEMO = "D";

  public static ENTITY_VEHICLE_MANUFACTURER = "VehicleManufacturer";
  public static ENTITY_VEHICLE_MANUFACTURERS = "VehicleManufacturers";
  public static ENTITY_VEHICLE = "Vehicle";
  public static ENTITY_VEHICLES = "Vehicles";
  public static ENTITY_USER = "User";
  public static ENTITY_USERS = "Users";
  public static ENTITY_TENANT = "Tenant";
  public static ENTITY_TENANTS = "Tenants";
  public static ENTITY_COMPANY = "Company";
  public static ENTITY_COMPANIES = "Companies";
  public static ENTITY_SETTING = "Setting";
  public static ENTITY_SETTINGS = "Settings";
  public static ENTITY_SITE = "Site";
  public static ENTITY_SITES = "Sites";
  public static ENTITY_SITE_AREA = "SiteArea";
  public static ENTITY_SITE_AREAS = "SiteAreas";
  public static ENTITY_TRANSACTION = "Transaction";
  public static ENTITY_TRANSACTIONS = "Transactions";
  public static ENTITY_CHARGING_STATION = "ChargingStation";
  public static ENTITY_CHARGING_STATIONS = "ChargingStations";
  public static ENTITY_LOGGING = "Logging";
  public static ENTITY_LOGGINGS = "Loggings";

  public static ACTION_CREATE = "Create";
  public static ACTION_READ = "Read";
  public static ACTION_UPDATE = "Update";
  public static ACTION_DELETE = "Delete";
  public static ACTION_LOGOUT = "Logout";
  public static ACTION_LIST = "List";
  public static ACTION_RESET = "Reset";
  public static ACTION_CLEAR_CACHE = "ClearCache";
  public static ACTION_REMOTE_START_TRANSACTION = "RemoteStartTransaction";
  public static ACTION_REMOTE_STOP_TRANSACTION = "RemoteStopTransaction";
  public static ACTION_REFUND_TRANSACTION = "RefundTransaction";
  public static ACTION_UNLOCK_CONNECTOR = "UnlockConnector";
  public static ACTION_GET_CONFIGURATION = "GetConfiguration";

  // Keystore
  public static SHARED_PREFERENCES_NAME = "eMobilityPreferences";
  public static KEYCHAIN_SERVICE = "eMobilityKeyChain";

  public static KEY_CREDENTIALS = "credentials";
  public static KEY_NAVIGATION_STATE = "navigation-state";

  // Paging
  public static DEFAULT_PAGING: PagingParams = {
    limit: 10,
    skip: 0,
  };
  public static PAGING_SIZE = 10;

  public static CONN_STATUS_AVAILABLE = "Available";
  public static CONN_STATUS_OCCUPIED = "Occupied";
  public static CONN_STATUS_CHARGING = "Charging";
  public static CONN_STATUS_FAULTED = "Faulted";
  public static CONN_STATUS_RESERVED = "Reserved";
  public static CONN_STATUS_FINISHING = "Finishing";
  public static CONN_STATUS_PREPARING = "Preparing";
  public static CONN_STATUS_SUSPENDED_EVSE = "SuspendedEVSE";
  public static CONN_STATUS_SUSPENDED_EV = "SuspendedEV";
  public static CONN_STATUS_UNAVAILABLE = "Unavailable";

  public static CONN_TYPE_2 = "T2";
  public static CONN_TYPE_COMBO_CCS = "CCS";
  public static CONN_TYPE_CHADEMO = "C";
  public static CONN_TYPE_DOMESTIC = "D";

  // Components
  public static COMPONENTS = {
    ANALYTICS: "analytics",
    OCPI: "ocpi",
    ORGANIZATION: "organization",
    PRICING: "pricing",
    REFUND: "refund",
  };
}
