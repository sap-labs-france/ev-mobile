import React from 'react';
import { Text, View } from 'react-native';

import BaseProps from '../../types/BaseProps';
import computeStyleSheet from './ChipStyle';

export interface Props extends BaseProps {
  statusStyle: any;
  text: string;
}

interface State {}

export default class Chip extends React.Component<Props, State> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { statusStyle, text } = this.props;
    return (
      <View style={[style.status, statusStyle]}>
        <Text style={[style.statusText, statusStyle]}>{text}</Text>
      </View>
    );
  }
}
