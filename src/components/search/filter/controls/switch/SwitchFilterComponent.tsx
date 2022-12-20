import { Switch } from 'native-base';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';
import Utils from '../../../../../utils/Utils';

export interface Props<T> extends FilterControlComponentProps<T> {
  enabledValue?: T;
}

export default class SwitchFilterComponent<T> extends FilterControlComponent<T> {
  public state: FilterControlComponentState<T>;
  public props: Props<T>;

  public constructor(props: Props<T>) {
    super(props);
    this.state = {
      value: props.initialValue
    };
  }

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
        <Text numberOfLines={2} ellipsizeMode={'tail'} style={internalStyle.textFilter}>{label}</Text>
        <Switch
          trackColor={{ true: commonColors.primary, false: commonColors.disabledDark }}
          thumbColor={commonColors.disabled}
          style={internalStyle.switchFilter}
          value={!!value}
          onToggle={(newValue) => this.onValueChanged(newValue)} />
      </View>
    );
  };

  private onValueChanged = (switchValue: boolean) => {
    const { onFilterChanged, enabledValue } = this.props;
    const newValue = switchValue ? enabledValue: null;
    // Set Filter
    this.setState({ value: newValue }, () => onFilterChanged?.(this.getID(), newValue));
  };
}
