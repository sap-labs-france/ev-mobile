export default interface UserToken {
  id?: string;
  role?: string;
  name?: string;
  firstName?: string;
  locale?: string;
  currency?: string;
  language?: string;
  tagIDs?: string[];
  tenantID: string;
  tenantName?: string;
  userHashID?: string;
  tenantHashID?: string;
  scopes?: string[];
  companies?: string[];
  sites?: string[];
  sitesAdmin?: string[];
  activeComponents?: string[];
  exp: number;
}
