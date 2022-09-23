import { Spinner } from 'native-base';
import React from 'react';

import BaseProps from '../../../types/BaseProps';
import computeStyleSheet from './ListFooterComponentStyles';
import { View } from 'react-native';

export interface Props extends BaseProps {
  skip: number;
  limit: number;
  count: number;
}

interface State {}

export default class ListFooterComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

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
    const { skip, limit, count } = this.props;
    if (skip + limit < count || count === -1) {
      return (
        <View style={style.spinnerContainer}>
          <Spinner color="grey" />
        </View>
      );
    }
    return null;
  }
}
