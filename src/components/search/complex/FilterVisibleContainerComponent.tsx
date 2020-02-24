import { View } from 'native-base';
import React from 'react';
import BaseFilterContainerComponent, { BaseFilterContainerComponentProps } from './BaseFilterContainerComponent';
import computeStyleSheet from './FilterContainerComponentStyles';

export interface Props extends BaseFilterContainerComponentProps {
  children?: React.ReactNode;
}

interface State {
}

export default class FilterVisibleContainerComponent extends BaseFilterContainerComponent<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render = () => {
    const style = computeStyleSheet();
    return (
      <View style={style.contentVisibleFilter}>
        {this.props.children}
      </View>
    );
  }
}
