import ListItem from './ListItem';
// import { OCPIToken } from './OCPIToken';
import User from './User';

export default interface Tag extends ListItem {
  description?: string;
  issuer: boolean;
  active: boolean;
  userID?: string;
  transactionsCount?: number;
  // ocpiToken?: OCPIToken;
  user?: User;
  default?: boolean;
  deleted?: boolean;
}
