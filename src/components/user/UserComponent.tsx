import { Text, View } from 'native-base';
import React from 'react';

import BaseProps from '../../types/BaseProps';
import User, { UserStatus } from '../../types/User';
import Utils from '../../utils/Utils';
import Chip from '../chip/Chip';
import computeChipStyleSheet from '../chip/ChipStyle';
import UserAvatar from './avatar/UserAvatar';
import computeStyleSheet from './UserComponentStyle';

export interface Props extends BaseProps {
  user: User;
  selected?: boolean;
}

interface State {}

export default class UserComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const chipStyle = computeChipStyleSheet();
    const { user, selected, navigation } = this.props;
    const userFullName = Utils.buildUserName(user);
    const userRole = user ? user.role : '';
    const userStatus = user ? user.status : '';
    const statusStyle = this.computeStatusStyle(userStatus, chipStyle);
    return (
      <View style={style.container}>
        <View style={style.avatarContainer}>
          <UserAvatar user={user} selected={selected} navigation={navigation} />
        </View>
        <View style={selected ? [style.userContainer, style.selected] : style.userContainer}>
          <View style={style.userFullnameStatusContainer}>
            <View style={style.fullNameContainer}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.fullName}>
                {userFullName}
              </Text>
            </View>
            <Chip statusStyle={statusStyle} text={Utils.translateUserStatus(userStatus)} navigation={navigation} />
          </View>
          <View style={style.emailRoleContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.email}>
              {user.email}
            </Text>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.role}>
              {Utils.translateUserRole(userRole)}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  private computeStatusStyle(status: string, style: any) {
    switch (status) {
      case UserStatus.ACTIVE:
        return style.active;
      case UserStatus.PENDING:
        return style.pending;
      case UserStatus.SUSPENDED:
      case UserStatus.INACTIVE:
      case UserStatus.LOCKED:
        return style.inactive;
    }
  }
}
