import { Switch, Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';
import Utils from '../../../../../utils/Utils';

export interface Props extends FilterControlComponentProps<boolean> {}

interface State extends FilterControlComponentState<boolean> {
}

export default class SwitchFilterComponent extends FilterControlComponent<boolean> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      value: props.initialValue
    }
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public canBeSaved() {
    return true;
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { label, style } = this.props;
    const { value } = this.state;
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={StyleSheet.compose(internalStyle.rowFilterContainer, style)}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <Switch trackColor={{ true: commonColors.primary, false: commonColors.disabledDark }} thumbColor={commonColors.disabled} style={internalStyle.switchFilter} value={!!value} onValueChange={this.onValueChanged} />
      </View>
    );
  };

  private onValueChanged = (newValue: boolean) => {
    const { onFilterChanged } = this.props;
    // Set Filter
    if (onFilterChanged) {
      onFilterChanged(this.getID(), newValue || null);
    }
    this.setState({ value: newValue });
  };
}
