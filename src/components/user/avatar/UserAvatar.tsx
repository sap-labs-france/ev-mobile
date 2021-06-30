import { View } from 'native-base';
import React from 'react';
import { Avatar } from 'react-native-elements';
import { scale } from 'react-native-size-matters';

import CentralServerProvider from '../../../provider/CentralServerProvider';
import ProviderFactory from '../../../provider/ProviderFactory';
import BaseProps from '../../../types/BaseProps';
import User from '../../../types/User';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './UserAvatarStyle';

interface State {
}

export interface Props extends BaseProps {
  user?: User;
  accessoryIcon?: string;
  selected?: boolean;
  size?: number;
}

export default class UserAvatar extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private centralServerProvider: CentralServerProvider;

  public constructor(props: Props) {
    super(props);
    this.state = {
      user: this.props.user
    };
  }

  public async componentDidMount(): Promise<void> {
    this.centralServerProvider = await ProviderFactory.getProvider();
  }

  public async componentDidUpdate() {
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const { selected, size, accessoryIcon, user } = this.props;
    const style = computeStyleSheet();
    const userInitials = Utils.buildUserInitials(user);
    // const userImageURI = user ? user.image : null;
    const userImageURI = null; // Keep the nbr of requests low (only load visible images)
    return (
      <View>
        {userImageURI ? (
          <Avatar
            size={size ? scale(size) : style.avatar.fontSize}
            rounded={true}
            source={{ uri: userImageURI }}
            titleStyle={style.avatarTitle}
            overlayContainerStyle={style.avatarContainer}>
            {accessoryIcon && <Avatar.Accessory name={accessoryIcon} size={style.accessory.fontSize} color={style.accessory.color} />}
          </Avatar>
        ) : (
          <Avatar
            size={size ? scale(size) : style.avatar.fontSize}
            rounded={true}
            title={userInitials}
            titleStyle={style.avatarTitle}
            overlayContainerStyle={[style.avatarContainer, style.titleAvatarContainer]}>
            {accessoryIcon && <Avatar.Accessory name={accessoryIcon} size={style.accessory.fontSize} color={style.accessory.color} />}
          </Avatar>
        )}
      </View>
    );
  }

  private async getUserImage(id: string) {
    try {
      return await this.centralServerProvider?.getUserImage({ ID: id });
    } catch (error) {
      // Check if HTTP?
      if (!error.request) {
        await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'users.userUnexpectedError', this.props.navigation);
      }
    }
    return null;
  }
}
