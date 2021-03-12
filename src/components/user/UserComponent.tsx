import {Text, View} from 'native-base';
import React from 'react';
import BaseProps from '../../types/BaseProps';
import User from '../../types/User';
import UserAvatar from './avatar/UserAvatar';
import computeStyleSheet from './UserComponentStyle';

export interface Props extends BaseProps{
  user: User;
  selected?: boolean;
}

interface State {
}

export default class UserComponent extends React.Component<Props, State>{
  public props: Props;
  public state: State;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { user, selected, navigation } = this.props;
    const userName = user.name ? (user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()) : '';
    const userFirstName = user.firstName ? user.firstName : '';
    return (
      <View style={style.userContent}>
        <View style={style.left}>
          <UserAvatar user={user} selected={selected} navigation={navigation}/>
        </View>
        <View style={selected ?  [style.columnContainer, style.selected] : style.columnContainer }>
          <View style={style.rowContainer}>
            <View style={style.firstName}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.labelValue, style.info]}>{userFirstName}</Text>
            </View>
            <View style={style.name}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.labelValue, style.info]}>{userName}</Text>
            </View>
          </View>
          <View style={style.email}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.labelValue, style.info]}>{user.email}</Text>
          </View>
        </View>
      </View>)
  }
}
