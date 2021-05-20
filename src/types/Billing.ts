import ListItem from './ListItem';

export interface BillingPaymentMethod extends ListItem {
  brand: string;
  expiringOn: Date;
  last4: string;
  type: string;
  createdOn: Date;
  isDefault: boolean;
}

export enum BillingPaymentMethodStatus {
  EXPIRED = 'expired',
  EXPIRING_SOON = 'expiringSoon',
  VALID = 'valid'
}

export enum StripePaymentMethodBrands {
  AMEX = 'amex',
  CB = 'cartes_bancaires',
  DINERS_CLUB = 'diners_club',
  DISCOVER = 'discover',
  JCB = 'jcb',
  MASTERCARD = 'mastercard',
  VISA = 'visa',
  UNION_PAY = 'unionpay'
}
