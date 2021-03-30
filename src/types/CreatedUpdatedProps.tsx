import { UserMin } from '../types/User';

export default interface CreatedUpdatedProps {
  createdBy: UserMin;
  createdOn: Date;
  lastChangedBy?: UserMin;
  lastChangedOn?: Date;
}
