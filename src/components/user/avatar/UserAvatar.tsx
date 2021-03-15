import {View} from 'native-base';
import React from 'react';
import {Avatar, Badge} from 'react-native-elements';

import BaseProps from '../../../types/BaseProps';
import User, {UserStatus} from '../../../types/User';
import computeStyleSheet from './UserAvatarStyle';

interface State {
}

export interface Props extends BaseProps {
  user: User;
  selected: boolean;
}

export default class UserAvatar extends React.Component<Props, State> {

  public constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const { user, selected } = this.props;
    const style = computeStyleSheet();
    const userName = user.name ? (user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()) : '';
    const userFirstName = user.firstName ? user.firstName : '';
    const userImageURI = user.image;
    return (
      <View>
        {userImageURI ?
          <Avatar size={style.avatar.fontSize}
                  rounded={true}
                  source={{uri: userImageURI}}
                  titleStyle={style.avatarTitle}
                  overlayContainerStyle={[style.avatarContainer, selected ? style.avatarSelected : null]}>
            {selected ? <Avatar.Accessory name={'done'} size={style.accessory.fontSize} color={style.accessory.color}/> : null}
          </Avatar>
          :
          <Avatar size={style.avatar.fontSize}
                  rounded={true}
                  title={userFirstName.charAt(0) + userName.charAt(0)}
                  titleStyle={style.avatarTitle}
                  overlayContainerStyle={[style.avatarContainer, selected ? style.avatarSelected : null]}>
            {selected ? <Avatar.Accessory name={'done'} size={style.accessory.fontSize} color={style.accessory.color}/> : null}
          </Avatar>
        }
        </View>
    )
  }
}

