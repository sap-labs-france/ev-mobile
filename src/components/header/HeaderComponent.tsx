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
}

interface State {
  hasFilter?: boolean;
}

export default class HeaderComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private searchIsVisible: boolean;
  private filterModalContainerComponent: FilterModalContainerComponent;

  public static defaultProps = {
    leftActionIconType: 'MaterialIcons',
    rightActionIconType: 'MaterialIcons',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasFilter: false
    }
    // Default values
    this.searchIsVisible = false;
  }

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

  private getNumberOfFilters(): number {
    const { filters } = this.props;
    let numberOfFilters = 0;
    for (const filter in filters) {
      if (filters[filter]) {
        numberOfFilters++;
      }
    }
    return numberOfFilters;
  }

  public render = () => {
    const style = computeStyleSheet();
    const { hasFilter } = this.state;
    const { title, subTitle, leftAction, leftActionIcon, leftActionIconType,
      rightAction, rightActionIcon, rightActionIconType, navigation } = this.props;
    return (
      <Header style={style.header}>
        <Left style={style.leftHeader}>
          {leftAction ? (
            <View style={style.buttonRow}>
              <Button transparent={true} style={style.leftButtonHeader} onPress={() => leftAction()}>
                <Icon type={leftActionIconType} name={leftActionIcon} style={[style.iconHeader, style.leftIconHeader]} />
              </Button>
              <Button transparent={true} style={style.leftButtonHeader}
                  onPress={() => { navigation.navigate({ routeName: 'HomeNavigator' });}}>
                <Icon type='MaterialIcons' name='home' style={[style.iconHeader, style.leftIconHeader]} />
              </Button>
            </View>
          ) : (
            <Image source={logo} style={style.logoHeader} />
          )}
        </Left>
        <Body style={style.bodyHeader}>
          <Title style={subTitle ? [style.titleHeader, style.titleHeaderWithSubTitle] : style.titleHeader}>{title}</Title>
          {subTitle && <Subtitle style={style.subTitleHeader}>{subTitle}</Subtitle>}
        </Body>
        <Right style={style.rightHeader}>
          {hasFilter && (
            <Button
              transparent={true}
              style={style.rightFilterButtonHeader}
              onPress={() => {
                this.searchIsVisible = !this.searchIsVisible;
                // Show Filter Search
                if (this.filterModalContainerComponent) {
                  this.filterModalContainerComponent.setVisible(this.searchIsVisible);
                }
              }}>
              <Icon type={'MaterialCommunityIcons'} name={this.getNumberOfFilters() > 0 ? 'filter' : 'filter-outline'} style={style.iconHeader} />
            </Button>
          )}
          {rightAction ? (
            <Button transparent={true} style={style.rightButtonHeader} onPress={() => rightAction()}>
              <Icon type={rightActionIconType} name={rightActionIcon} style={style.iconHeader} />
            </Button>
          ) : (
            <Image source={logo} style={style.logoHeader} />
          )}
        </Right>
      </Header>
    );
  }
}
