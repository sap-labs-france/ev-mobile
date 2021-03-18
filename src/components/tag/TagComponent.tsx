import I18n from 'i18n-js';
import React from 'react';
import {Text, View} from 'react-native';
import { Chip } from 'react-native-paper';
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
    const { tag, isAdmin, selected } = this.props;
    const active = tag?.active;
    return (
      <View style={selected ? [style.container, style.selected] : [style.container]}>
        <View style={style.header}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.id]}>{tag.id}</Text>
          {isAdmin && tag.user ?
            <View style={style.user}>
              <Text numberOfLines={1} ellipsizeMode={'tail'}
                    style={[style.text, style.name]}>{tag.user.firstName} {tag.user.name}</Text>
            </View>
            :
            null
          }
        </View>
        <View style={style.tagContent}>
          <View style={style.label}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.description]}>{tag.description}</Text>
          </View>
          <View style={style.status}>
            <Chip mode={'outlined'} style={[style.tag, active ? style.tagActive : style.tagInactive]} textStyle={[style.tagText, active ? style.tagActive : style.tagInactive]}>{I18n.t(active ? 'tags.active' : 'tags.inactive')}</Chip>
          </View>
      </View>
    </View>
    )
  }
}
