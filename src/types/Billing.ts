import ListItem from './ListItem';
import User from './User';

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

export interface BillingInvoice extends ListItem {
  createdOn?: Date;
  invoiceID: string;
  userID?: string;
  user?: User;
  // eslint-disable-next-line id-blacklist
  number: string;
  status: BillingInvoiceStatus;
  amount?: number;
  currency: string;
  downloadable: boolean;
  sessions: BillingSessionData[];
}

export enum BillingInvoiceStatus {
  PAID = 'paid',
  OPEN = 'open',
  DRAFT = 'draft',
  UNCOLLECTIBLE = 'uncollectible',
  DELETED = 'deleted',
  VOID = 'void'
}

export interface BillingSessionData {
  transactionID: number;
  description: string;
  pricingData: any;
}
