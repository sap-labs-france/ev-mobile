import { Icon, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import computeStyleSheet from './FilterContainerComponentStyles';
import { Text } from 'react-native';
import I18n from 'i18n-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface Props extends FilterContainerComponentProps {
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}

interface State extends FilterContainerComponentState {
  expanded: boolean;
}

export default class FilterVisibleContainerComponent extends FilterContainerComponent {
  public static defaultProps = {
    visible: false,
    showExpandControl: false,
    expanded: false
  };
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      expanded: props.expanded ? props.expanded : false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render = () => {
    const style = computeStyleSheet();
    const { onExpand } = this.props;
    const { expanded } = this.state;
    return (
      <View style={style.visibleContainer}>
        {this.props.children}
        {onExpand && (
          <TouchableOpacity style={style.visibleExpandedContainer} onPress={this.toggleExpanded}>
            {expanded ? (
              <View style={style.filterButtonContainer}>
                <Text style={style.filterButtonText}>{I18n.t('general.showLess')}</Text>
                <Icon style={style.filterButtonIcon} as={MaterialIcons} name={'keyboard-arrow-up'} />
              </View>
            ) : (
              <View style={style.filterButtonContainer}>
                <Text style={style.filterButtonText}>{I18n.t('general.showMore')}</Text>
                <Icon style={style.filterButtonIcon} as={MaterialIcons} name={'keyboard-arrow-down'} />
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  };

  private toggleExpanded = () => {
    const { onExpand } = this.props;
    this.setState(
      {
        expanded: !this.state.expanded
      },
      () => {
        if (onExpand) {
          onExpand(this.state.expanded);
        }
      }
    );
  };
}
