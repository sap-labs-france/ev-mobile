import { View } from 'native-base';
import React from 'react';
import FilterContainerComponent, { FilterContainerComponentProps } from './FilterContainerComponent';
import computeStyleSheet from './FilterContainerComponentStyles';

export interface Props extends FilterContainerComponentProps {
}

interface State {
}

export default class FilterVisibleContainerComponent extends FilterContainerComponent {
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

  public setVisible(visible: boolean): void {
    // Do nothing, always visible
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
