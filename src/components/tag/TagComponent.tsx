import I18n from 'i18n-js';
import React from 'react';
import { Text, View } from 'react-native';

import BaseProps from '../../types/BaseProps';
import Tag from '../../types/Tag';
import Utils from '../../utils/Utils';
import Chip from '../chip/Chip';
import computeStyleSheet from './TagComponentStyle';
import computeChipStyleSheet from '../chip/ChipStyle';

interface State {}

export interface Props extends BaseProps {
  tag: Tag;
  selected?: boolean;
  isAdmin?: boolean;
}

export default class TagComponent extends React.Component<Props, State> {
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
    const chipStyle = computeChipStyleSheet();
    const { tag, isAdmin, selected, navigation } = this.props;
    const userFullName = Utils.buildUserName(tag?.user);
    const statusStyle = tag?.active ? chipStyle.active : chipStyle.inactive;
    return (
      <View style={selected ? [style.container, style.selected] : [style.container]}>
        <View style={style.header}>
          <View style={style.tagIdConstainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.tagId]}>
              {tag?.id}
            </Text>
          </View>
          {isAdmin && tag.user && (
            <View style={style.userConstainer}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.fullName]}>
                {userFullName}
              </Text>
            </View>
          )}
        </View>
        <View style={style.tagContainer}>
          <View style={style.labelContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.description]}>
              {tag?.description}
            </Text>
          </View>
          <View style={style.statusContainer}>
            <Chip statusStyle={statusStyle} text={I18n.t(tag?.active ? 'tags.active' : 'tags.inactive')} navigation={navigation} />
          </View>
        </View>
      </View>
    );
  }
}
