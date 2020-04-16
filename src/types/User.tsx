import Address from './Address';
import CreatedUpdatedProps from './CreatedUpdatedProps';

export default interface User extends CreatedUpdatedProps {
  id: string;
  email: string;
  phone?: string;
  mobile: string;
  role: string;
  status: string;
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
