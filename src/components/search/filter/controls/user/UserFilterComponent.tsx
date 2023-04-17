import { Icon } from 'native-base';
import React from 'react';

import FilterControlComponent, {
  FilterControlComponentProps,
  FilterControlComponentState
} from '../FilterControlComponent';
import computeStyleSheet from './UserFilterComponentStyles';
import computeListItemCommonStyles from './UserFilterComponentStyles';
import ModalSelect from '../../../../modal/ModalSelect';
import User, { UserRole, UserStatus } from '../../../../../types/User';
import UserComponent from '../../../../user/UserComponent';
import { ItemSelectionMode } from '../../../../list/ItemsList';
import Users from '../../../../../screens/users/list/Users';
import { TouchableOpacity, Text, View } from 'react-native';
import I18n from 'i18n-js';
import Utils from '../../../../../utils/Utils';
import { withBadge } from 'react-native-elements';
import ListItem from '../../../../../types/ListItem';
import { scale } from 'react-native-size-matters';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface Props extends FilterControlComponentProps<string> {}

export default class UserFilterComponent extends FilterControlComponent<User[]> {
  public state: FilterControlComponentState<User[]>;
  public props: FilterControlComponentProps<User[]>;
  private userModalRef = React.createRef<ModalSelect<User>>();
  private currentUser: User;

  public canBeSaved() {
    return false;
  }

  public async componentDidMount() {
    await super.componentDidMount();
    const userInfo = this.centralServerProvider.getUserInfo();
    this.currentUser = {
      firstName: userInfo.firstName,
      name: userInfo.name,
      status: UserStatus.ACTIVE,
      role: userInfo.role as UserRole,
      email: userInfo.email,
      id: userInfo.id
    } as User;
  }


  public clearValue(callback?: () => unknown) {
    super.clearValue();
    this.userModalRef?.current.resetInput();
  }

  public render = () => {
    const style = computeStyleSheet();
    return (
      <View style={style.container}>
        <View style={style.modalContainer}>
          <ModalSelect<User>
            ref={this.userModalRef}
            onItemsSelected={(users) => this.onValueChanged(users)}
            renderItemPlaceholder={this.renderUserPlaceholder.bind(this)}
            renderItems={(users) => this.renderItems(users)}
            navigation={null}
            defaultItems={this.state.value}
            selectionMode={ItemSelectionMode.MULTI}
            openable={true}
          >
            <Users filters={{issuer: null}} navigation={null} />
          </ModalSelect>
        </View>
        <View style={style.buttonsContainer}>
          <TouchableOpacity style={style.buttonContainer} onPress={() => this.userModalRef?.current?.resetInput()}>
            <Icon size={scale(25)} style={style.buttonIcon} as={EvilIcons} name={'close'} />
          </TouchableOpacity>
          <View style={style.buttonsSeparator}></View>
          <TouchableOpacity style={style.buttonContainer} onPress={() => this.userModalRef?.current?.resetInput(false, this.currentUser ? [this.currentUser] : [])}>
            <Icon size={scale(25)} style={style.buttonIcon} as={Ionicons} name={'person-circle'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  private renderUserPlaceholder() {
    const listItemCommonStyles = computeListItemCommonStyles();
    const style = computeStyleSheet();
    return (
      <View style={[listItemCommonStyles.container, style.userFilterPlaceholder]}>
        <Icon marginX={scale(7)} size={scale(40)} style={style.userFilterPlaceholderIcon} as={Ionicons} name={'people'} />
        <Text numberOfLines={2} ellipsizeMode={'tail'} style={style.userFilterPlaceholderText} >{I18n.t('users.selectOneOrSeveralUsers')}</Text>
      </View>
    )
  }

  private renderItems(users: User[] = []) {
    const style = computeStyleSheet();
    if (users.length === 1) {
      return (
        <UserComponent user={users[0]} navigation={null} />
      );
    }
    const Badged = withBadge(this.renderMultiSelectBadge(users), {badgeStyle: style.badge, right: scale(3), top: -scale(4)})(UserComponent);
    return (<Badged user={users[0]} navigation={null} />);
  }

  private renderMultiSelectBadge(items: ListItem[] = []) {
    const style = computeStyleSheet();
    if (items.length > 1) {
      return (
          <Text style={style.badgeText}>+{items.length -1}</Text>
      );
    }
    return <></>;
  }

  private async onValueChanged (users: User[] = []): Promise<void> {
    const value = Utils.isEmptyArray(users) ? null : users;
    this.setState({value}, () => this.props.onFilterChanged?.(this.getID(), value));
  };
}
