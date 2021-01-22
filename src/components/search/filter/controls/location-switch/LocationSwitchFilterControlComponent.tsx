import { Switch, Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import FilterControlComponent, { FilterControlComponentProps } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<boolean> {
}

interface State {
  switchValue?: boolean;
}

export default class LocationSwitchFilterControlComponent extends FilterControlComponent<boolean> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      switchValue: !!this.getValue()
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public canBeSaved() {
    return true;
  }

  private onValueChanged = async (newValue: boolean) => {
    const { onFilterChanged } = this.props;
    // Set Filter
    if (onFilterChanged) {
      this.setValue(newValue);
      onFilterChanged(this.getID(), newValue);
    }
    // Update
    this.setState({ switchValue: newValue });
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { label, style } = this.props;
    const { switchValue } = this.state;
    return (
      <View style={StyleSheet.compose(internalStyle.rowFilterContainer, style)}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <Switch
          style={internalStyle.switchFilter}
          value={switchValue}
          onValueChange={this.onValueChanged}
        />
      </View>
    );
  }
}
