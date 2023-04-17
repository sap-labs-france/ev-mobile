import { Icon  } from 'native-base';
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

import Constants from '../../../../../utils/Constants';
import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from './DateFilterControlComponentStyles';
import I18nManager from '../../../../../I18n/I18nManager';
import { scale } from 'react-native-size-matters';
import Foundation from 'react-native-vector-icons/Foundation';
import I18n from 'i18n-js';

export interface Props extends FilterControlComponentProps<Date> {
  minimumDate: Date;
  maximumDate: Date;
  defaultValue: Date;
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
    this.state.openDatePicker = false;
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    const { initialValue } = this.props;
    // If filter is not aware of initialValue change, put new initialValue to state
    if ( (initialValue?.getTime() !== prevProps.initialValue?.getTime()) && (this.state.value?.getTime() !== initialValue?.getTime()) ) {
      this.setState({value: initialValue });
    }
  }

  public async componentDidMount() {
    const { value } = this.state;
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
    const { label, minimumDate, maximumDate, locale, style, defaultValue } = this.props;
    let { value } = this.state;
    value = value ?? defaultValue ;
    return (
      <View style={[internalStyle.container, style]}>
        <Text style={internalStyle.label}>{label}</Text>
        {value ? (
          <View>
            <TouchableOpacity style={internalStyle.inputContainer} onPress={() => this.setState({openDatePicker: true})}>
              <Text numberOfLines={1} style={internalStyle.dateText}>{I18nManager.formatDateTime(value, {dateStyle: 'medium'})}</Text>
              <Icon padding={0} size={scale(28)} style={internalStyle.dateIcon} as={Foundation} name={'calendar'} />
            </TouchableOpacity>
            <DateTimePickerModal
              confirmTextIOS={I18n.t('general.ok')}
              cancelTextIOS={I18n.t('general.cancel')}
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
    this.setState({ openDatePicker: false, value: newValue }, () => onFilterChanged?.(this.getID(), newValue));
  }

  private fitDateWithinMinAndMax(date: Date): Date {
    const { maximumDate, minimumDate } = this.props;
    if (date) {
      if (date < minimumDate) {
        return minimumDate;
      } else if (date > maximumDate) {
        return maximumDate;
      }
    }
    return date;
  }
}
