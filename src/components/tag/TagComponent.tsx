import React from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import BaseProps from '../../types/BaseProps';
import Tag from '../../types/Tag';
import computeStyleSheet from './TagComponentStyle';

interface State{

}

export interface Props extends BaseProps{
  tag: Tag;
  selected?: boolean;
  isAdmin?: boolean
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
    const {tag, isAdmin, selected} = this.props;
    return (

      <View style={selected ? [style.container, style.selected] : [style.container]}>
        <View style={style.header}>
          <Text style={style.text}>{tag.id}</Text>
        </View>
        <View style={style.tagContent}>
          {isAdmin ?
            <View style={style.column}>
              <Icon iconStyle={style.icon} name={'person'}/>
              {tag.user ?
                <View style={style.user}>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}
                        style={style.text}>{tag.user.firstName}</Text>
                  <Text numberOfLines={1} ellipsizeMode={'tail'}
                        style={style.text}>{tag.user.name}</Text>
                </View>
                :
                <Text style={style.text}>-</Text>
              }
            </View>
            :
            null
          }
          <View style={style.column}>
            <Text style={[style.text, style.description]}>{tag.description}</Text>
          </View>
        </View>
      </View>
    )
  }
}
