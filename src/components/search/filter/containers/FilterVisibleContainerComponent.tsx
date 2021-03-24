import { Icon, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import computeStyleSheet from './FilterContainerComponentStyles';

export interface Props extends FilterContainerComponentProps {
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}

interface State extends FilterContainerComponentState {
  expanded: boolean;
}

export default class FilterVisibleContainerComponent extends FilterContainerComponent {

  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: props.expanded ? props.expanded : false
    };
  }

  public static defaultProps = {
    visible: false,
    showExpandControl: false,
    expanded: false
  };
  public state: State;
  public props: Props;

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  private toggleExpanded = () => {
    const { onExpand } = this.props;
    this.setState({
      expanded: !this.state.expanded
    }, () => {
      if (onExpand) {
        onExpand(this.state.expanded);
      }
    });
  };

  public render = () => {
    const style = computeStyleSheet();
    const { onExpand } = this.props;
    const { expanded } = this.state;
    return (
      <View style={style.visibleContainer}>
        {this.props.children}
        {onExpand &&
          <TouchableOpacity style={style.visibleExpandedContainer} onPress={this.toggleExpanded}>
            {expanded ?
              <Icon style={style.visibleExpandedIcon} type='MaterialIcons' name='keyboard-arrow-up' />
              :
              <Icon style={style.visibleExpandedIcon} type='MaterialIcons' name='keyboard-arrow-down' />
            }
          </TouchableOpacity>
        }
      </View>
    );
  };
}
