import { DatePicker, Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';

import I18nManager from '../../../../../I18n/I18nManager';
import FilterControlComponent, { FilterControlComponentProps } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<Date> {
  defaultDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
}

interface State {
}

export default class DateFilterControlComponent extends FilterControlComponent<Date> {

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public static defaultProps = {
    style: {},
    defaultDate: new Date()
  };
  public state: State;
  public props: Props;

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  private onValueChanged = async (newValue: Date) => {
    const { onFilterChanged } = this.props;
    // Set Filter
    if (onFilterChanged) {
      if (newValue) {
        this.setValue(newValue);
        onFilterChanged(this.getID(), newValue);
      } else {
        this.clearValue();
        onFilterChanged(this.getID(), null);
      }
    }
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { label, style, defaultDate, minimumDate, maximumDate, locale } = this.props;
    return (
      <View style={StyleSheet.compose(internalStyle.rowFilterContainer, style)}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <DatePicker
          defaultDate={defaultDate}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'spinner'}
          textStyle={internalStyle.filterValue}
          placeHolderTextStyle={internalStyle.filterValue}
          onDateChange={this.onValueChanged}
          disabled={false}
          formatChosenDate={(date) => I18nManager.formatDateTime(date, 'LL')}
        />
      </View>
    );
  }
}
