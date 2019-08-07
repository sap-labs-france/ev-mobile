export default {
  // Auto Refresh
  AUTO_REFRESH_SHORT_PERIOD_MILLIS: 5 * 1000,
  AUTO_REFRESH_MEDIUM_PERIOD_MILLIS: 10 * 1000,

  SEARCH_CHECK_PERIOD_MILLIS: 50,
  ANIMATION_PERIOD_MILLIS: 5 * 1000,
  ANIMATION_SHOW_HIDE_MILLIS: 500,
  ANIMATION_ROTATION_MILLIS: 500,

  // Roles
  ROLE_SUPER_ADMIN: "S",
  ROLE_ADMIN: "A",
  ROLE_BASIC: "B",
  ROLE_DEMO: "D",

  ENTITY_SITE: "Site",
  ENTITY_SITES: "Sites",
  ENTITY_SITE_AREA: "SiteArea",
  ENTITY_SITE_AREAS: "SiteAreas",
  ENTITY_COMPANY: "Company",
  ENTITY_COMPANIES: "Companies",
  ENTITY_CHARGING_STATION: "ChargingStation",
  ENTITY_CHARGING_STATIONS: "ChargingStations",
  ENTITY_TENANT: "Tenant",
  ENTITY_TENANTS: "Tenants",
  ENTITY_TRANSACTION: "Transaction",
  ENTITY_TRANSACTIONS: "Transactions",
  ENTITY_TRANSACTION_METER_VALUES: "MeterValues",
  ENTITY_TRANSACTION_STOP: "Stop",
  ENTITY_USER: "User",
  ENTITY_USERS: "Users",
  ENTITY_VEHICLE_MANUFACTURER: "VehicleManufacturer",
  ENTITY_VEHICLE_MANUFACTURERS: "VehicleManufacturers",
  ENTITY_VEHICLES: "Vehicles",
  ENTITY_VEHICLE: "Vehicle",
  ENTITY_LOGGINGS: "Loggings",
  ENTITY_LOGGING: "Logging",
  ENTITY_PRICING: "Pricing",

  ACTION_READ: "Read",
  ACTION_CREATE: "Create",
  ACTION_UPDATE: "Update",
  ACTION_DELETE: "Delete",
  ACTION_LOGOUT: "Logout",
  ACTION_LIST: "List",
  ACTION_RESET: "Reset",
  ACTION_AUTHORIZE: "Authorize",
  ACTION_CLEAR_CACHE: "ClearCache",
  ACTION_STOP_TRANSACTION: "StopTransaction",
  ACTION_START_TRANSACTION: "StartTransaction",
  ACTION_REFUND_TRANSACTION: "RefundTransaction",
  ACTION_UNLOCK_CONNECTOR: "UnlockConnector",
  ACTION_GET_CONFIGURATION: "GetConfiguration",

  // Keystore
  SHARED_PREFERENCES_NAME: "eMobilityPreferences",
  KEYCHAIN_SERVICE: "eMobilityKeyChain",

  KEY_CREDENTIALS: "credentials",
  KEY_EMAIL: "email",
  KEY_PASSWORD: "password",
  KEY_TOKEN: "token",
  KEY_TENANT: "tenant",

  // Paging
  DEFAULT_PAGING: {
    limit: 10,
    skip: 0
  },
  PAGING_SIZE: 10,
  DEFAULT_ORDERING: [],

  CSS_HEADER_BG: "#d9d9d9",

  CONN_STATUS_AVAILABLE: "Available",
  CONN_STATUS_OCCUPIED: "Occupied",
  CONN_STATUS_CHARGING: "Charging",
  CONN_STATUS_FAULTED: "Faulted",
  CONN_STATUS_RESERVED: "Reserved",
  CONN_STATUS_FINISHING: "Finishing",
  CONN_STATUS_PREPARING: "Preparing",
  CONN_STATUS_SUSPENDED_EVSE: "SuspendedEVSE",
  CONN_STATUS_SUSPENDED_EV: "SuspendedEV",
  CONN_STATUS_UNAVAILABLE: "Unavailable",

  CONN_TYPE_2: "T2",
  CONN_TYPE_COMBO_CCS: "CCS",
  CONN_TYPE_CHADEMO: "C",

  // Components
  COMPONENTS: {
    OCPI: "ocpi",
    REFUND: "refund",
    PRICING: "pricing",
    ORGANIZATION: "organization",
    ANALYTICS: "analytics"
  }
};
