export default {
  // Toast
  TOAST_DURATION_MILLIS: 3000,
  TOAST_DEFAULT_STYLE: {
    color: "white",
    textAlign: "center"
  },
  TOAST_FONT_SIZE: 13,

  // Auto Refresh
  AUTO_REFRESH_PERIOD_MILLIS: 10000,

  // Roles
  ROLE_SUPER_ADMIN: "S",
  ROLE_ADMIN: "A",
  ROLE_BASIC: "B",
  ROLE_DEMO: "D",

  // Keystore
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

  CONN_STATUS_AVAILABLE: "Available",
  CONN_STATUS_OCCUPIED: "Occupied",
  CONN_STATUS_CHARGING: "Charging",
  CONN_STATUS_FAULTED: "Faulted",
  CONN_STATUS_RESERVED: "Reserved",
  CONN_STATUS_FINISHING: "Finishing",
  CONN_STATUS_PREPARING: "Preparing",
  CONN_STATUS_SUSPENDED_EVSE: "SuspendedEVSE",
  CONN_STATUS_SUSPENDED_EV:  "SuspendedEV",
  CONN_STATUS_UNAVAILABLE: "Unavailable"
};
