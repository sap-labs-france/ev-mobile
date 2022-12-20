export enum UserNotificationType {
  SESSION_STARTED = 'SessionStarted',
  OPTIMAL_CHARGE_REACHED = 'OptimalChargeReached',
  END_OF_CHARGE = 'EndOfCharge',
  END_OF_SESSION = 'EndOfSession',
  USER_ACCOUNT_STATUS_CHANGED = 'UserAccountStatusChanged',
  UNKNOWN_USER_BADGED = 'UnknownUserBadged',
  CHARGING_STATION_STATUS_ERROR = 'ChargingStationStatusError',
  CHARGING_STATION_REGISTERED = 'ChargingStationRegistered',
  OCPI_PATCH_STATUS_ERROR = 'OcpiPatchStatusError',
  SMTP_AUTH_ERROR = 'SmtpAuthError',
  PREPARING_SESSION_NOT_STARTED = 'PreparingSessionNotStarted',
  USER_ACCOUNT_INACTIVITY = 'UserAccountInactivity',
  OFFLINE_CHARGING_STATION = 'OfflineChargingStation',
  BILLING_USER_SYNCHRONIZATION_FAILED = 'BillingUserSynchronizationFailed',
  SESSION_NOT_STARTED_AFTER_AUTHORIZE = 'SessionNotStartedAfterAuthorize',
  END_USER_ERROR = 'EndUserErrorNotification'
}

export interface NotificationData {
  [p: string]: string;
  tenantID: string;
  tenantSubdomain: string;
  notificationType: UserNotificationType;
  deepLink?: string;
}

export interface Notification {
  [p: string]: any;
  data: NotificationData;
  notification: any;
}
