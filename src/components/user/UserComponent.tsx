import { Text, View } from 'native-base';
import React from 'react';

import I18n from 'i18n-js';
import { Badge } from 'react-native-elements';
import BaseProps from '../../types/BaseProps';
import User, { UserRole, UserStatus } from '../../types/User';
import computeStyleSheet from './UserComponentStyle';
import UserAvatar from './avatar/UserAvatar';

export interface Props extends BaseProps {
  user: User;
  selected?: boolean;
}

interface State {
}

export default class UserComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  private computeStatusStyle(status: UserStatus, style: any) {
    if (status) {
      switch (status) {
        case UserStatus.A: return style.active; break;
        case UserStatus.P: return style.pending; break;
        default: return style.inactive;
      }
    }
    return null;
  }

  public render() {
    const style = computeStyleSheet();
    const { user, selected, navigation } = this.props;
    const userName = user.name ? (user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()) : '';
    const userFirstName = user.firstName ? user.firstName : '';
    const userRole =  user ?  UserRole[user.role] : '';
    const userStatus = user ? UserStatus[user.status] : '';
    const statusStyle = this.computeStatusStyle(userStatus, style);
    return (
      <View style={style.userContent}>
        <View style={style.left}>
          <UserAvatar user={user} selected={selected} navigation={navigation}/>
        </View>
        <View style={selected ?  [style.columnContainer, style.selected] : style.columnContainer }>
          <View style={style.rowContainer}>
            <View style={style.firstName}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.text}>{userFirstName}</Text>
            </View>
            <View style={style.name}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.text}>{userName}</Text>
            </View>
            <View style={style.statusContainer}>
              <Badge badgeStyle={[style.status, statusStyle]} textStyle={[style.statusText, statusStyle]} value={I18n.t(`userStatuses.${userStatus?.toLowerCase()}`)}/>
            </View>
          </View>
          <View style={style.email}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.text}>{user.email}</Text>
          </View>
          <View style={style.roleContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.role]}>{I18n.t(`userRoles.${userRole?.toLowerCase()}`)}</Text>
          </View>
        </View>
      </View>);
  }
}
