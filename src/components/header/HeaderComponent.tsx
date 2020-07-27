import { Body, Button, Header, Icon, Left, Right, Subtitle, Title, View } from 'native-base';
import React from 'react';
import { BackHandler, Image } from 'react-native';

import logo from '../../../assets/logo-low.png';
import FilterModalContainerComponent from '../../components/search/filter/containers/FilterModalContainerComponent';
import BaseProps from '../../types/BaseProps';
import { IconType } from '../../types/Icon';
import computeStyleSheet from './HeaderComponentStyles';

export interface Props extends BaseProps {
  title: string;
  subTitle?: string;
  leftAction?: () => void;
  leftActionIcon?: string;
  leftActionIconType?: IconType;
  rightAction?: () => void;
  rightActionIcon?: string;
  rightActionIconType?: IconType;
  filters?: any;
  diplayMap?: boolean;
  mapIsDisplayed?: boolean;
  diplayMapAction?: () => void;
}

interface State {
  hasFilter?: boolean;
}

export default class HeaderComponent extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      hasFilter: false,
    }
    // Default values
    this.searchIsVisible = false;
  }

  public static defaultProps = {
    leftActionIconType: 'MaterialIcons',
    rightActionIconType: 'MaterialIcons',
  };
  public state: State;
  public props: Props;
  private searchIsVisible: boolean;
  private filterModalContainerComponent: FilterModalContainerComponent;

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public getFilterModalContainerComponent(): FilterModalContainerComponent {
    return this.filterModalContainerComponent;
  }

  public setFilterModalContainerComponent(filterModalContainerComponent: FilterModalContainerComponent) {
    this.filterModalContainerComponent = filterModalContainerComponent;
    this.setState({
      hasFilter: true
    });
  }

  public componentDidMount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.addEventListener('hardwareBackPress', leftAction);
    }
  }

  public componentWillUnmount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.removeEventListener('hardwareBackPress', leftAction);
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { hasFilter } = this.state;
    const { title, subTitle, leftAction, leftActionIcon, leftActionIconType,
      rightAction, rightActionIcon, rightActionIconType,
      diplayMap, diplayMapAction, mapIsDisplayed, navigation } = this.props;
    return (
      <Header style={style.header}>
        {leftAction ?
          <Left style={style.leftHeader}>
            <Icon type={leftActionIconType} name={leftActionIcon}
              style={style.iconLeftHeader} onPress={() => leftAction()}/>
            <Icon type='MaterialCommunityIcons' name='home'
              style={style.iconLeftHeader} onPress={() => navigation.navigate({ routeName: 'HomeNavigator' })} />
          </Left>
        :
          <Left style={style.leftHeader}>
            <Image source={logo} style={style.logoHeader} />
          </Left>
        }
        <Body style={style.bodyHeader}>
          <Title style={subTitle ? [style.titleHeader, style.titleHeaderWithSubTitle] : style.titleHeader}>{title}</Title>
          {subTitle && <Subtitle style={style.subTitleHeader}>{subTitle}</Subtitle>}
        </Body>
        <Right style={style.rightHeader}>
          {hasFilter && (
            <Icon type={'MaterialCommunityIcons'} name={this.filterModalContainerComponent &&
              this.filterModalContainerComponent.getNumberOfFilters() > 0 ? 'filter' : 'filter-outline'}
              onPress={() => {
                this.searchIsVisible = !this.searchIsVisible;
                // Show Filter Search
                if (this.filterModalContainerComponent) {
                  this.filterModalContainerComponent.setVisible(this.searchIsVisible);
                }
              }}
              style={style.iconRightHeader} />
          )}
          {diplayMap && (
            <Icon type='MaterialCommunityIcons' name={mapIsDisplayed ? 'format-list-text' : 'earth'}
              style={style.iconRightHeader} onPress={() => diplayMapAction()}/>
          )}
          {rightAction ? (
            <Icon type={rightActionIconType} name={rightActionIcon}
              style={style.iconRightHeader} onPress={() => rightAction()}/>
          ) : (
            <Image source={logo} style={style.logoHeader} />
          )}
        </Right>
      </Header>
    );
  }
}
