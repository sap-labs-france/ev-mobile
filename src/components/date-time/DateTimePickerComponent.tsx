import React from 'react';
import { Icon } from 'native-base';

import I18n from 'i18n-js';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import I18nManager from '../../I18n/I18nManager';
import computeStyleSheet from './DateTimePickerComponentStyles';
import Utils from '../../utils/Utils';
import { scale } from 'react-native-size-matters';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Message from '../../utils/Message';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export interface Props {
  title: string;
  initialValue?: Date;
  lowerBound?: Date;
  upperBound?: Date;
  mode?: 'date' | 'time' | 'datetime';
  locale?: string;
  is24Hour?: boolean;
  containerStyle?: ViewStyle[];
  onDateTimeChanged: (newDateTime: Date) => Promise<void> | void;
}

interface State {
  value: Date;
  openDateTimePicker: boolean;
  isValid: boolean;
}

export default class DateTimePickerComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.onConfirm.bind(this);
    this.state = {
      value: null,
      openDateTimePicker: false,
      isValid: false
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

  public render() {
    const style = computeStyleSheet();
    const { title, mode, initialValue, lowerBound, upperBound, locale, is24Hour, containerStyle } = this.props;
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={[...(containerStyle || [])]}>
        <TouchableOpacity style={[this.determineRequiredHeight(mode, style)]} onPress={() => this.setState({ openDateTimePicker: true })}>
          <View style={style.calendarIconContainer}>
            <Icon
              size={scale(28)}
              style={[this.determineIconStyle(style)]}
              as={MaterialCommunityIcons}
              name={this.selectIconByMode(mode)}
            />
          </View>
          <View style={style.contentContainer}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={[style.text, style.title]}>
              {I18n.t(title)}
            </Text>
            {['date', 'datetime'].includes(mode) && (
              <Text numberOfLines={1} style={style.text}>
                {I18nManager.formatDateTime(initialValue, { dateStyle: 'medium' })}
              </Text>
            )}
            {['time', 'datetime'].includes(mode) && (
              <Text numberOfLines={1} style={style.text}>
                {I18nManager.formatDateTime(initialValue, { timeStyle: 'medium' })}
              </Text>
            )}
          </View>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.openDateTimePicker}
          mode={mode}
          locale={locale}
          is24Hour={is24Hour}
          cancelTextIOS={I18n.t('general.cancel')}
          confirmTextIOS={I18n.t('general.confirm')}
          buttonTextColorIOS={commonColors.textColor}
          minimumDate={lowerBound}
          maximumDate={upperBound}
          date={initialValue}
          minuteInterval={5}
          onConfirm={(newDateTime: Date) => this.onConfirm(newDateTime)}
          onCancel={() => this.setState({ openDateTimePicker: false })}
        />
      </View>
    );
  }

  private onConfirm(newValue: Date) {
    const { onDateTimeChanged } = this.props;
    // Workaround to fix the bug from react-native-modal-datetime-picker
    newValue = this.validateValue(newValue);
    this.setState({ openDateTimePicker: false, value: newValue }, () => onDateTimeChanged?.(newValue));
  }

  private fitDateBetweenMinAndMax(date: Date, granularity: moment.unitOfTime.StartOf = 'date'): Date {
    const { upperBound, lowerBound } = this.props;
    const parsedInput = moment(date);
    const parsedMinimum = moment(lowerBound);
    const parsedMaximum = moment(upperBound);
    if (date && parsedInput.isValid()) {
      if (parsedInput.isBefore(parsedMinimum, granularity)) {
        Message.showError(I18n.t('reservations.dateBeforeMinimum'));
        this.setState({ isValid: false });
        return lowerBound;
      } else if (parsedInput.isAfter(parsedMaximum, granularity)) {
        Message.showError(I18n.t('reservations.dateAfterMaximum', { duration: parsedInput.diff(parsedMaximum, 'h') }));
        this.setState({ isValid: false });
        return upperBound;
      }
      this.setState({ isValid: true });
    } else {
      Message.showError(I18n.t('reservations.invalidDate'));
      this.setState({ isValid: false });
    }
    return date;
  }

  private selectIconByMode(mode: 'date' | 'datetime' | 'time') {
    switch (mode) {
      case 'date':
        return 'calendar';
      case 'datetime':
        return 'calendar-clock';
      case 'time':
        return 'clock';
    }
  }

  private determineIconStyle(style: any) {
    if (!this.state.value) {
      return style.defaultDateIcon;
    }
    return this.state.isValid ? style.validDateIcon : style.invalidDateIcon;
  }

  private determineRequiredHeight(mode: 'date' | 'datetime' | 'time', style: any) {
    switch (mode) {
      case 'date':
        return style.dateContainer;
      case 'time':
        return style.timeContainer;
      case 'datetime':
        return style.dateTimeContainer;
    }
  }

  private fitTimeBetweenMinAndMax(time: Date) {
    return this.fitDateBetweenMinAndMax(this.fitDateBetweenMinAndMax(time,'h'),'m');
  }

  private validateValue(value: Date) {
    const { mode } = this.props;
    return mode === 'time' ? this.fitTimeBetweenMinAndMax(value) : this.fitDateBetweenMinAndMax(value);
  }
}
