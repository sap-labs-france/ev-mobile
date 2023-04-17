import I18n from 'i18n-js';
import React from 'react';
import { Image, ImageStyle, Text, View, ViewStyle } from 'react-native';

import BaseProps from '../../types/BaseProps';
import Tag from '../../types/Tag';
import Utils from '../../utils/Utils';
import computeChipStyleSheet from '../chip/ChipStyle';
import computeStyleSheet from './TagComponentStyle';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import ChargeCard from '../../../assets/charge-card/charge-card.png';

interface State {}

export interface Props extends BaseProps {
  tag: Tag;
  selected?: boolean;
  canReadUser?: boolean;
  containerStyle?: ViewStyle[];
}

export default class TagComponent extends React.Component<Props, State> {
  public static defaultProps = {
    outlinedInactive: false
  };
  public state: State;
  public props: Props;
  private exampleImageUri = Image.resolveAssetSource(ChargeCard).uri;

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
    const { tag, canReadUser, containerStyle } = this.props;
    const listItemCommonStyle = computeListItemCommonStyle();
    const userFullName = Utils.buildUserName(tag?.user);
    const statusStyle = tag?.active ? chipStyle.success : chipStyle.danger;
    return (
      <View
        style={[listItemCommonStyle.container, style.tagContainer, ...(containerStyle || [])]}>
        <View style={style.leftContainer}>
          <Image style={style.icon as ImageStyle} source={{ uri: this.exampleImageUri }} />
        </View>
        <View style={style.middleContainer}>
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.tagDescription]}>
            {tag?.description}
          </Text>
          {canReadUser && tag?.user && (
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.fullName]}>
              {userFullName}
            </Text>
          )}
          <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.tagVisualID]}>
            {I18n.t('tags.visualID')}: {tag?.visualID}
          </Text>
          <View style={style.bottomLine}>
            <View style={[style.statusContainer, tag?.default && style.statusContainerWithRightBorder]}>
              <Text style={[style.text, statusStyle]}>{tag?.active ? I18n.t('tags.active') : I18n.t('tags.inactive')}</Text>
            </View>
            {tag?.default && (
              <View style={style.defaultContainer}>
                <Text style={[style.defaultText]}>{I18n.t('general.default')}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}
