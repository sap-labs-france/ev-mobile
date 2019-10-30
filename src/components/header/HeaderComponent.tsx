
import { Body, Button, Header, Icon, Left, Right, Subtitle, Title } from "native-base";
import React from "react";
import { BackHandler, Image } from "react-native";
import logo from "../../../assets/logo-low.png";
import SimpleSearchComponent from "../../components/search/simple/SimpleSearchComponent";
import BaseProps from "../../types/BaseProps";
import { IconType } from "../../types/Icon";
import ComplexFilterComponent from "../search/complex/ComplexSearchComponent";
import computeStyleSheet from "./HeaderComponentStyles";


export interface Props extends BaseProps {
  title: string;
  subTitle?: string;
  leftAction?: () => void;
  leftActionIcon?: string;
  leftActionIconType?: IconType;
  rightAction?: () => void;
  rightActionIcon?: string;
  rightActionIconType?: IconType;
}

interface State {
  complexSearchComponentRef?: ComplexFilterComponent
}

export default class HeaderComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private searchIsVisible: boolean;

  public static defaultProps = {
    leftActionIconType: "MaterialIcons",
    rightActionIconType: "MaterialIcons",
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      complexSearchComponentRef: null
    }
    // Default values
    this.searchIsVisible = false;
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setSearchComplexComponentRef(complexSearchComponentRef: ComplexFilterComponent) {
    this.setState({
      complexSearchComponentRef
    });
  }

  public setSearchSimpleComponentRef(simpleSearchComponentRef: SimpleSearchComponent) {
    this.setState({
      simpleSearchComponentRef
    });
  }

  public componentDidMount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.addEventListener("hardwareBackPress", leftAction);
    }
  }

  public componentWillUnmount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.removeEventListener("hardwareBackPress", leftAction);
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { complexSearchComponentRef } = this.state;
    const { title, subTitle, leftAction, leftActionIcon, leftActionIconType,
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
          {(complexSearchComponentRef) && (
            <Button
              transparent={true}
              style={style.rightSearchButtonHeader}
              onPress={() => {
                this.searchIsVisible = !this.searchIsVisible;
                // Show Complex Search
                if (complexSearchComponentRef) {
                  complexSearchComponentRef.setVisible(this.searchIsVisible);
                }
              }}>
              <Icon type={"AntDesign"} name={"filter"} style={style.iconHeader} />
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
