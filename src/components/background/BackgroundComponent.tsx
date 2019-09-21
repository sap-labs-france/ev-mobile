import { View } from "native-base";
import React from "react";
import { ImageBackground } from "react-native";
import BaseProps from "../../types/BaseProps";
import computeStyleSheet from "./BackgroundComponentStyles";

// const defaultBackground = require("../../../assets/bg.png");
const defaultBackground = require("../../../assets/sidebar-transparent.png");

export interface Props extends BaseProps {
  active?: boolean;
  background?: object;
  style?: object;
}

interface State {
}

export default class BackgroundComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  public static defaultProps = {
    active: true,
    style: {}
  };

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { active, background } = this.props;
    return active ? (
      <ImageBackground
        source={background || defaultBackground}
        style={[style.background, this.props.style]}
        imageStyle={style.imageBackground}>
        {this.props.children}
      </ImageBackground>
    ) : (
      <View style={style.background}>{this.props.children}</View>
    );
  }
}
