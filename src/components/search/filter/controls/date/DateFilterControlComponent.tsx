import { Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Constants from '../../../../../utils/Constants';
import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<Date> {
  // Date used when date prop is null
  date: Date;
  minimumDate: Date;
  maximumDate: Date;
}

interface State extends FilterControlComponentState<Date> {
  openDatePicker: boolean;
}

export default class DateFilterControlComponent extends FilterControlComponent<Date> {
  public static defaultProps = {
    style: {}
  };
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      openDatePicker: false,
      value: this.props.date
    };
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
    const { label, style, minimumDate, maximumDate, locale, date } = this.props;
    let { value } = this.state;
    value = value ?? date;
    return (
      <View style={[internalStyle.rowFilterContainer, style]}>
        <Text style={[internalStyle.textFilter, internalStyle.label]}>{label}</Text>
        {value ? (
          <View>
            <TouchableOpacity onPress={() => this.openDatePicker(true)}>
              <Text style={internalStyle.textFilter}>{value.toDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={this.state.openDatePicker}
              date={value}
              mode={'date'}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              locale={locale}
              onCancel={() => {
                this.openDatePicker(false);
              }}
              onConfirm={(date) => {
                this.onConfirm(date);
              }}
            />
          </View>
        ) : (
          <Text>{Constants.HYPHEN}</Text>
        )}
      </View>
    );
  };

  private onConfirm(newValue: Date) {
    const { onFilterChanged } = this.props;
    // Set Filter
    if (onFilterChanged) {
      if (newValue) {
        this.setState(
          {
            openDatePicker: false,
            value: newValue
          },
          () => {
            onFilterChanged(this.getID(), newValue);
          }
        );
      } else {
        this.clearValue(() => {
          onFilterChanged(this.getID(), null);
        });
      }
    }
  }

  private openDatePicker(openDatePicker: boolean) {
    this.setState({ openDatePicker });
  }
}
