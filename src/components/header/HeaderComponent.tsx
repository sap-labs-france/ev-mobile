import { Icon } from 'native-base';
import React from 'react';
import { View, TouchableOpacity, Text, BackHandler } from 'react-native';

import FilterModalContainerComponent from '../../components/search/filter/containers/FilterModalContainerComponent';
import BaseProps from '../../types/BaseProps';
import { IconType } from '../../types/Icon';
import computeStyleSheet from './HeaderComponentStyles';
import { DrawerActions } from '@react-navigation/native';

export interface Props extends BaseProps {
  title: string;
  subTitle?: string;
  actions?: HeaderAction[];
  modalized?: boolean;
  backArrow?: boolean;
  backAction?: () => void;
  sideBar?: boolean;
}

interface State {
  hasFilter?: boolean;
}

export interface HeaderAction {
  onPress?: () => void;
  renderIcon?: () => React.ReactElement;
}

export default class HeaderComponent extends React.Component<Props, State> {
  public static defaultProps = {
    leftActionIconType: 'MaterialIcons',
    rightActionIconType: 'MaterialIcons',
    displayTenantLogo: true,
    backArrow: true,
    sideBar: false
  };
  public state: State;
  public props: Props;
  private filterModalContainerComponent: FilterModalContainerComponent;

  public constructor(props: Props) {
    super(props);
    this.state = {
      hasFilter: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public getFilterModalContainerComponent(): FilterModalContainerComponent {
    return this.filterModalContainerComponent;
  }

  public setFilterModalContainerComponent(filterModalContainerComponent: FilterModalContainerComponent) {
    this.filterModalContainerComponent = filterModalContainerComponent;
    this.setState({
      hasFilter: true
    });
  }

  public render = () => {
    const style = computeStyleSheet();
    const { title, subTitle, navigation, modalized, actions, backArrow, sideBar, backAction } = this.props;
    return (
      <View style={[style.header, modalized && style.modalHeader]}>
        <View style={style.leftHeader}>
          {sideBar ? (
            <TouchableOpacity
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
                return true;
              }}>
              <Icon style={style.icon} type={'Feather'} name={'menu'} />
            </TouchableOpacity>
          ) : (
            backArrow && (
              <TouchableOpacity onPress={backAction ?? (() => navigation.goBack())}>
                <Icon style={style.icon} type={'Feather'} name={'arrow-left'} />
              </TouchableOpacity>
            )
          )}
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={style.title}>
            {title} {subTitle}
          </Text>
        </View>
        <View style={style.actionsContainer}>
          {actions?.map((action, index) => (
            <TouchableOpacity style={style.action} key={index} onPress={action.onPress}>
              {action.renderIcon?.()}
            </TouchableOpacity>
          ))}
          {this.filterModalContainerComponent && (
            <TouchableOpacity
              onPress={() => {
                this.filterModalContainerComponent.setVisible(true);
                return true;
              }}>
              <Icon
                type={'MaterialCommunityIcons'}
                name={this.filterModalContainerComponent.getNumberOfFilters() > 0 ? 'filter' : 'filter-outline'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };
}
