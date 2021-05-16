import React from 'react';
import Users from '../../screens/users/list/Users';
import BaseProps from '../../types/BaseProps';
import User from '../../types/User';
import Utils from '../../utils/Utils';
import { ItemSelectionMode } from '../list/ItemsList';
import ModalSelect from './ModalSelect';

export interface Props extends BaseProps {
  onUsersSelected: (items: User[]) => void;
  defaultUser?: User;
  selectionMode: ItemSelectionMode;
}

interface State {}

export default class UserModalSelect extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const { navigation, selectionMode, defaultUser } = this.props;
    return (
      <ModalSelect<User>
        defaultItem={defaultUser}
        buildItemName={Utils.buildUserName}
        navigation={navigation}
        selectionMode={ItemSelectionMode.MULTI}>
        <Users navigation={navigation} />
      </ModalSelect>
    );
  }
}
