import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<Date> {
  defaultDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
}

interface State extends FilterControlComponentState<Date> {
  openDatePicker: boolean;
}

export default class DateFilterControlComponent extends FilterControlComponent<Date> {

  constructor(props: Props) {
    super(props);
    this.state = {
      openDatePicker: false,
      value: this.props.defaultDate
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
  };

  public canBeSaved() {
    return true;
  }

  private onConfirm (newValue: Date) {
    const { onFilterChanged } = this.props;
    // Set Filter
    if (onFilterChanged) {
      if (newValue) {
        this.setState({
          openDatePicker: false
        }, () => {
          onFilterChanged(this.getID(), newValue);
        });
      } else {
        this.clearValue( () => {
          onFilterChanged(this.getID(), null);
        });
      }
    }
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { label, style, minimumDate, maximumDate, locale } = this.props;
    return (
      <View style={StyleSheet.compose(internalStyle.rowFilterContainer, style)}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <Text style={internalStyle.textFilter} onPress={() => this.openDatePicker(true)}>{this.getValue()?.toDateString()}</Text>
        <DateTimePickerModal
          isVisible={this.state.openDatePicker}
          date={this.getValue()}
          mode={'date'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          locale={locale}
          onCancel={() => {
            this.openDatePicker(false);
          }}
          onConfirm={(date) => {
            this.onConfirm(date);
          }
          }/>
      </View>
    );
  };
  private openDatePicker(openDatePicker: boolean) {
    this.setState({ openDatePicker });
  }
}
