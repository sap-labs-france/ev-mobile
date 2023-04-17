import React from 'react';

import BaseProps from '../../types/BaseProps';
import User, { UserStatus } from '../../types/User';
import Utils from '../../utils/Utils';
import computeChipStyleSheet from '../chip/ChipStyle';
import UserAvatar from './avatar/UserAvatar';
import computeStyleSheet from './UserComponentStyle';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import { ViewStyle, Text, View } from 'react-native';

export interface Props extends BaseProps {
  user: User;
  selected?: boolean;
  containerStyle?: ViewStyle[];
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
    const listItemCommonStyle = computeListItemCommonStyle();
    const chipStyle = computeChipStyleSheet();
    const { user, navigation, selected, containerStyle } = this.props;
    const userFullName = Utils.buildUserName(user);
    const userRole = user ? user.role : '';
    const userStatus = user ? user.status : '';
    const statusStyle = this.computeStatusStyle(userStatus, chipStyle);
    return (
      <View style={[listItemCommonStyle.container, ...(containerStyle || [])]}>
        <View style={style.userContent}>
          <View style={style.avatarContainer}>
            {selected ? <UserAvatar isSelected={true} navigation={navigation} /> : <UserAvatar user={user} navigation={navigation} />}
          </View>
          <View style={style.userContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.fullName]}>
              {userFullName}
            </Text>
            {user?.email && (
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.text}>
                {user.email}
              </Text>
            )}
            <View style={style.bottomLine}>
              {user?.role && (
                <View style={[style.roleContainer, user?.status && style.roleContainerWithBorderRight]}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.text}>
                    {Utils.translateUserRole(userRole)}
                  </Text>
                </View>
              )}
              {user?.status && (
                <Text style={[style.text, statusStyle]}>{Utils.translateUserStatus(userStatus)}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  private computeStatusStyle(status: string, style: any) {
    switch (status) {
      case UserStatus.ACTIVE:
        return style.success;
      case UserStatus.PENDING:
        return style.warning;
      case UserStatus.BLOCKED:
      case UserStatus.INACTIVE:
      case UserStatus.LOCKED:
        return style.danger;
    }
  }
}
