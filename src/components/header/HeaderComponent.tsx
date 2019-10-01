import SearchHeaderComponent from 'components/search-header/SearchHeaderComponent';
import { Body, Button, Header, Icon, Left, Right, Subtitle, Title } from 'native-base';
import React from 'react';
import { BackHandler, Image } from 'react-native';
import BaseProps from '../../types/BaseProps';
import { IconType } from '../../types/Icon';
import computeStyleSheet from './HeaderComponentStyles';

const logo = require('../../../assets/logo-low.png');

export interface Props extends BaseProps {
  title: string;
  subTitle?: string;
  leftAction?: () => void;
  leftActionIcon?: string;
  leftActionIconType?: IconType;
  rightAction?: () => void;
  rightActionIcon?: string;
  rightActionIconType?: IconType;
  showSearchAction?: boolean;
  searchRef?: SearchHeaderComponent;
}

interface State {
}

export default class HeaderComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private searchIsVisible: boolean;
  public static defaultProps = {
    leftActionIconType: 'MaterialIcons',
    rightActionIconType: 'MaterialIcons',
    showSearchAction: false
  };

  constructor(props: Props) {
    super(props);
    // Default values
    this.searchIsVisible = false;
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
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

  public render() {
    const style = computeStyleSheet();
    const { title, subTitle, searchRef, showSearchAction, leftAction, leftActionIcon, leftActionIconType,
      rightAction, rightActionIcon, rightActionIconType } = this.props;
    return (
      <Header style={style.header}>
        <Left style={style.leftHeader}>
          {leftAction ? (
            <Button transparent={true} style={style.leftButtonHeader} onPress={() => leftAction()}>
              <Icon type={leftActionIconType} name={leftActionIcon} style={[style.iconHeader, style.leftIconHeader]} />
            </Button>
          ) : (
            <Image source={logo} style={style.logoHeader} />
          )}
        </Left>
        <Body style={style.bodyHeader}>
          <Title style={subTitle ? [style.titleHeader, style.titleHeaderWithSubTitle] : style.titleHeader}>{title}</Title>
          {subTitle && <Subtitle style={style.subTitleHeader}>{subTitle}</Subtitle>}
        </Body>
        <Right style={style.rightHeader}>
          {showSearchAction && (
            <Button
              transparent={true}
              style={style.rightButtonHeader}
              onPress={() => {
                // Invert
                this.searchIsVisible = !this.searchIsVisible;
                // Set?
                if (searchRef) {
                  searchRef.setVisible(this.searchIsVisible);
                }
              }}>
              <Icon type={'MaterialIcons'} name={'search'} style={style.iconHeader} />
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
