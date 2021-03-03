import {Text, View} from 'native-base';
import React from 'react';
import {Avatar} from 'react-native-elements';
import BaseProps from '../../types/BaseProps';
import User from '../../types/User';
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
    const {user, selected} = this.props;
    const uri = user.image;
    const userName = user.name ? (user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()) : '';
    const userFirstName = user.firstName ? user.firstName : '';
    return(
      <View  style={style.container}>
        <View style={style.userContent}>
          <View style={style.left}>
            {uri ?
              <Avatar size='large'
                      rounded={true}
                      source={{uri}}
                      titleStyle={style.avatarTitle}
                      overlayContainerStyle={[style.avatar, selected ? style.avatarSelected : null]}>
                {selected ? <Avatar.Accessory name={'done'} size={40} {...style.accessory}/> : null}
              </Avatar>
                    :
              <Avatar size='large'
                      rounded={true}
                      title={userFirstName.charAt(0) + userName.charAt(0)}
                      titleStyle={style.avatarTitle}
                      overlayContainerStyle={[style.avatar, selected ? style.avatarSelected : null]}>
                {selected ? <Avatar.Accessory name={'done'} size={40} {...style.accessory}/> : null}
              </Avatar>
            }
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
        </View>
      </View>
    )
  }
}
