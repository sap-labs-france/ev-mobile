import React from 'react';
import {Text, View} from 'react-native';
import BaseProps from '../../types/BaseProps';
import Tag from '../../types/Tag';
import computeStyleSheet from './TagComponentStyle';

interface State{

}

export interface Props extends BaseProps{
  tag: Tag;
  selected?: boolean;
}

export default class TagComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render(){
    const style = computeStyleSheet();
    const {tag} = this.props;
    return (
      <View style={style.tagContent}>
        <Text>{tag.id}</Text>
        <Text>{tag.user?.firstName}</Text>
        <Text>{tag.user?.name}</Text>
      </View>
    )
  }

}
