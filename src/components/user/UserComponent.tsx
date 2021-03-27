import { Text, View } from 'native-base';
import React from 'react';
import { Chip } from 'react-native-paper';

import CentralServerProvider from '../../provider/CentralServerProvider';
import ProviderFactory from '../../provider/ProviderFactory';
import BaseProps from '../../types/BaseProps';
import User, { UserStatus } from '../../types/User';
import Utils from '../../utils/Utils';
import UserAvatar from './avatar/UserAvatar';
import computeStyleSheet from './UserComponentStyle';

export interface Props extends BaseProps {
  user: User;
  selected?: boolean;
}

interface State {
  user?: User;
}

export default class UserComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;
  private centralServerProvider: CentralServerProvider;

  public constructor(props: Props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  public async componentDidMount(): Promise<void> {
    this.centralServerProvider = await ProviderFactory.getProvider();
    const { user } = this.props;
    if (user) {
      user.image = await this.getUserImage(user.id as string);
    }
    this.setState({user});
  }

  public render() {
    const style = computeStyleSheet();
    const { selected, navigation } = this.props;
    const { user } = this.state;
    const userFullName = Utils.buildUserName(user);
    const userRole =  user ?  user.role : '';
    const userStatus = user ? user.status : '';
    const statusStyle = this.computeStatusStyle(userStatus, style);
    return (
      <View style={style.container}>
        <View style={style.avatarContainer}>
          <UserAvatar user={user} selected={selected} navigation={navigation}/>
        </View>
        <View style={selected ? [style.userContainer, style.selected] : style.userContainer }>
          <View style={style.userFullnameStatusContainer}>
            <View style={style.fullNameContainer}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.fullName}>{userFullName}</Text>
            </View>
            <View style={style.statusContainer}>
              <Chip style={[style.status, statusStyle]} textStyle={[style.statusText, statusStyle]}>
                {Utils.translateUserStatus(userStatus)}
              </Chip>
            </View>
          </View>
          <View style={style.emailRoleContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.email}>{user.email}</Text>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.role}>{Utils.translateUserRole(userRole)}</Text>
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
      case UserStatus.BLOCKED:
      case UserStatus.INACTIVE:
      case UserStatus.LOCKED:
        return style.inactive;
    }
  }

  private async getUserImage(id: string) {
    try {
      return await this.centralServerProvider.getUserImage({ID: id});
    } catch (error) {
      // Check if HTTP?
      if (!error.request) {
        Utils.handleHttpUnexpectedError(this.centralServerProvider, error,
          'users.userUnexpectedError', this.props.navigation);
      }
    }
    return null;
  }
}
