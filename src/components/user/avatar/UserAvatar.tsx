import { View } from 'native-base';
import React from 'react';
import { Avatar } from 'react-native-elements';
import noPhoto from '../../../../assets/no-photo.png';
import BaseProps from '../../../types/BaseProps';
import User from '../../../types/User';
import Constants from '../../../utils/Constants';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './UserAvatarStyle';

interface State {}

export interface Props extends BaseProps {
  user?: User;
  selected?: boolean;
  small?: boolean;
}

export default class UserAvatar extends React.Component<Props, State> {
  public static defaultProps = {
    selected: false
  };

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
    const { user, selected, small } = this.props;
    const style = computeStyleSheet();
    const userInitials = Utils.buildUserInitials(user);
    const userName = Utils.buildUserName(user);
    const isAnonymized = userName === Constants.ANONYMIZED_VALUE;
    const userImageURI = user ? (isAnonymized ? noPhoto : user.image) : noPhoto;
    return (
      <View>
        {userImageURI ? (
          <Avatar
            size={small ? style.smallAvatar.fontSize : style.avatar.fontSize}
            rounded={true}
            source={userImageURI === noPhoto ? noPhoto : { uri: userImageURI }}
            titleStyle={style.avatarTitle}
            overlayContainerStyle={[style.avatarContainer, selected ? style.avatarSelected : null]}>
            {selected && <Avatar.Accessory name={'done'} size={style.accessory.fontSize} color={style.accessory.color} />}
          </Avatar>
        ) : (
          <Avatar
            size={small ? style.smallAvatar.fontSize : style.avatar.fontSize}
            rounded={true}
            title={userInitials}
            titleStyle={style.avatarTitle}
            overlayContainerStyle={[style.avatarContainer, selected ? style.avatarSelected : null]}>
            {selected && <Avatar.Accessory name={'done'} size={style.accessory.fontSize} color={style.accessory.color} />}
          </Avatar>
        )}
      </View>
    );
  }
}
