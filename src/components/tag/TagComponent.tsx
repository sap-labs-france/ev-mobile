import I18n from 'i18n-js';
import React from 'react';
import { Text, View } from 'react-native';
import { Chip } from 'react-native-paper';

import BaseProps from '../../types/BaseProps';
import Tag from '../../types/Tag';
import Utils from '../../utils/Utils';
import computeStyleSheet from './TagComponentStyle';

interface State {
}

export interface Props extends BaseProps {
  tag: Tag;
  selected?: boolean;
  isAdmin?: boolean;
}

export default class TagComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { tag, isAdmin, selected } = this.props;
    const userFullName = Utils.buildUserName(tag?.user);
    const statusStyle = tag?.active ? style.active : style.inactive;
    return (
      <View style={selected ? [style.container, style.selected] : [style.container]}>
        <View style={style.header}>
          <View style={style.tagIdConstainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.tagId]}>
              {tag?.id}
            </Text>
          </View>
          {isAdmin && tag.user &&
            <View style={style.userConstainer}>
              <Text numberOfLines={1} ellipsizeMode={'tail'}
                style={[style.text, style.fullName]}>{userFullName}</Text>
            </View>
          }
        </View>
        <View style={style.tagContainer}>
          <View style={style.labelContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.description]}>{tag?.description}</Text>
          </View>
          <View style={style.statusContainer}>
            <Chip style={[style.status, statusStyle]} textStyle={[style.statusText, statusStyle]}>
              {I18n.t(tag?.active ? 'tags.active' : 'tags.inactive')}
            </Chip>
          </View>
        </View>
      </View>
    );
  }
}
