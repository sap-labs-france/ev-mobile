import Address from './Address';
import Car from './Car';
import CreatedUpdatedProps from './CreatedUpdatedProps';
import ListItem from './ListItem';
import Tag from './Tag';
import { StartTransactionErrorCode } from './Transaction';

export default interface User extends CreatedUpdatedProps, ListItem {
  email: string;
  phone?: string;
  mobile: string;
  role: UserRole;
  status: UserStatus;
  locale: string;
  plateID?: string;
  address?: Address;
  image?: string;
  notificationsActive?: boolean;
  iNumber?: string;
  costCenter?: string;
  deleted: boolean;
  eulaAcceptedHash: string;
  eulaAcceptedVersion: number;
  eulaAcceptedOn: Date;
  name: string;
  firstName: string;
  password: string;
  passwordResetHash: string;
  passwordWrongNbrTrials: number;
  passwordBlockedUntil: Date;
  verificationToken?: string;
  verifiedAt?: Date;
  errorCode?: string;
  tagIDs?: string[];
}

export interface UserCredentials {
  email: string;
  password: string;
  tenantSubDomain: string;
  token?: string;
  locale?: string;
  currency?: string;
}

export interface UserMin {
  id: string;
  name: string;
  firstName: string;
}

export interface UserSite {
  user: User;
  siteID: string;
  siteAdmin: boolean;
}

export enum UserStatus {
  PENDING = 'P',
  ACTIVE = 'A',
  INACTIVE = 'I',
  BLOCKED = 'B',
  LOCKED = 'L'
}

export enum UserRole {
  SUPER_ADMIN = 'S',
  ADMIN = 'A',
  BASIC = 'B',
  DEMO = 'D'
}

export interface UserDefaultTagCar {
  car: Car;
  tag: Tag;
  errorCodes?: StartTransactionErrorCode[];
}

export interface UserMobileData {
  mobileOS: 'ios' | 'android' | 'windows' | 'macos' | 'web';
  mobileToken: string;
  mobileBundleID: string;
  mobileAppName: string;
  mobileVersion: string;
  mobileLastChangedOn?: Date;
}
