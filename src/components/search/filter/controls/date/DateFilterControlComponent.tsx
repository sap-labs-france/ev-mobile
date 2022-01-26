import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Constants from '../../../../../utils/Constants';
import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from './DateFilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<Date> {
  minimumDate: Date;
  maximumDate: Date;
  defaultValue : Date;
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
      openDatePicker: false
    };
  }

  public componentDidUpdate(prevProps: Readonly<FilterControlComponentProps<Date>>, prevState: Readonly<FilterControlComponentState<Date>>, snapshot?: any) {
    const { initialValue } = this.props;
    // If filter is not aware of initialValue change, set new initialValue to state
    if ( initialValue?.getTime() !== prevProps.initialValue?.getTime() && this.state.value?.getTime() !== initialValue?.getTime() ) {
      this.setState({value: initialValue });
    }
  }

  public componentDidMount() {
    let { value } = this.state;
    const correctedDate = this.fitDateWithinMinAndMax(value);
    if (correctedDate?.getTime() !== value?.getTime()) {
      this.setState({value: correctedDate});
      this.props.onFilterChanged?.(this.getID(), correctedDate);
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
    const { label, minimumDate, maximumDate, locale, style, initialValue, defaultValue } = this.props;
    let { value } = this.state;
    value = value ?? initialValue ?? defaultValue ;
    return (
      <View style={[internalStyle.container, style]}>
        <Text style={internalStyle.label}>{label}</Text>
        {value ? (
          <View>
            <TouchableOpacity style={internalStyle.inputContainer} onPress={() => this.setState({openDatePicker: true})}>
              <Text numberOfLines={1} style={internalStyle.dateText}>{value.toDateString()}</Text>
              <Icon style={internalStyle.dateIcon} type={'Foundation'} name={'calendar'} />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={this.state.openDatePicker}
              date={value}
              mode={'date'}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              locale={locale}
              onCancel={() => {
                this.setState({openDatePicker: false});
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
    // Workaround to fix the bug from react-native-modal-datetime-picker
    newValue = this.fitDateWithinMinAndMax(newValue);
    this.setState({ openDatePicker: false, value: newValue }, () => onFilterChanged?.(this.getID(), newValue))
  }

  private fitDateWithinMinAndMax(date: Date): Date {
    const { maximumDate, minimumDate } = this.props;
    if (date < minimumDate) {
      return minimumDate
    } else if (date > maximumDate) {
      return maximumDate
    }
    return date;
  }
}
