import { DatePicker, Text, View } from 'native-base';
import React from 'react';
import I18nManager from '../../../../../I18n/I18nManager';
import BaseFilterControlComponent, { BaseFilterControlProps } from '../BaseFilterControlComponent';
import computeStyleSheet from '../BaseFilterControlComponentStyles';

export interface Props extends BaseFilterControlProps {
  defaultDate?: Date;
  minimumDate?: Date;
  maximumDate?: Date;
}

interface State {
}

export default class DateFilterControlComponent extends BaseFilterControlComponent {
  public state: State;
  public props: Props;
  public static defaultProps = {
    defaultDate: new Date()
  };

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render = () => {
    const style = computeStyleSheet();
    const { filterID, label, defaultDate, minimumDate, maximumDate, locale } = this.props;
    let currentFilterValue: string = defaultDate ? defaultDate.toISOString() : new Date().toISOString();
    if (this.getFilterContainerComponent()) {
      currentFilterValue = this.getFilterContainerComponent().getFilterValue(filterID);
    }
    return (
      <View style={style.rowFilter}>
        <Text style={style.textFilter}>{label}</Text>
        <DatePicker
          defaultDate={new Date(currentFilterValue)}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          locale={locale}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'spinner'}
          textStyle={style.filterValue}
          placeHolderTextStyle={style.filterValue}
          onDateChange={(newDate: Date) => this.getFilterContainerComponent().setFilterValue(this.getID(), newDate.toISOString())}
          disabled={false}
          formatChosenDate={(date) => I18nManager.formatDateTime(date, 'LL')}
        />
      </View>
    );
  }
}
