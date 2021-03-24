import I18n from 'i18n-js';
import moment from 'moment';
import { View } from 'native-base';
import React from 'react';

import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
import FilterVisibleContainerComponent from '../../../components/search/filter/containers/FilterVisibleContainerComponent';
import DateFilterControlComponent from '../../../components/search/filter/controls/date/DateFilterControlComponent';
import MyUserSwitchFilterControlComponent from '../../../components/search/filter/controls/my-user-switch/MyUserSwitchFilterControlComponent';
import ScreenFilters, { ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: TransactionsHistoryFiltersDef) => void;
  initialFilters?: TransactionsHistoryFiltersDef;
}

export interface TransactionsHistoryFiltersDef {
  startDateTime?: Date;
  endDateTime?: Date;
  userID?: string;
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

interface State extends ScreenFiltersState {
  filters?: TransactionsHistoryFiltersDef;
}

export default class TransactionsHistoryFilters extends ScreenFilters {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {filters : props.initialFilters};
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  public onFilterChanged = (newFilters: TransactionsHistoryFiltersDef, applyFilters: boolean) => {
    const { onFilterChanged } = this.props;
    // User ID has been changed: Clear Start/End Date
    if (applyFilters && newFilters.hasOwnProperty('userID') && this.state.filters.userID !== newFilters.userID) {
      this.getFilterModalContainerComponent().clearFilters();
      newFilters.startDateTime = null;
      newFilters.endDateTime = null;
    }
    if (newFilters.startDateTime) {
      newFilters.startDateTime = moment(newFilters.startDateTime).startOf('day').toDate();
    }
    if (newFilters.endDateTime) {
      newFilters.endDateTime = moment(newFilters.endDateTime).endOf('day').toDate();
    }
    if (applyFilters) {
      this.setState({
        filters: { ...this.state.filters, ...newFilters }
      }, () => {
        onFilterChanged(this.state.filters);
      });
    } else {
      this.setState({
        filters: { ...this.state.filters, ...newFilters }
      });
    }
  };

  public render = () => {
    const { initialFilters } = this.props;
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    const maxTransactionDate = initialFilters.maxTransactionDate;
    const minTransactionDate = initialFilters.minTransactionDate;
    let startDateTime = filters.startDateTime ? filters.startDateTime : minTransactionDate ;
    let endDateTime = filters.endDateTime ? filters.endDateTime : maxTransactionDate;
    // Check the dates interval and fix it if needed
    if (startDateTime < minTransactionDate) {
      startDateTime = minTransactionDate;
      if (endDateTime < minTransactionDate) {
        endDateTime = minTransactionDate;
      }
    }
    if (endDateTime > maxTransactionDate) {
      endDateTime = maxTransactionDate;
      if (startDateTime > maxTransactionDate) {
        startDateTime = maxTransactionDate;
      }
    }
    return (
      <View>
        {(isAdmin || hasSiteAdmin) &&
          <FilterVisibleContainerComponent
            onFilterChanged={this.onFilterChanged}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)}
          >
            <MyUserSwitchFilterControlComponent
              filterID={'userID'}
              internalFilterID={GlobalFilters.MY_USER_FILTER}
              initialValue={filters.hasOwnProperty('userID') ? filters.userID : initialFilters.userID}
              label={I18n.t('general.onlyMyTransactions')}
              onFilterChanged={async (id: string, value: string) =>
                this.getFilterVisibleContainerComponent().setFilter(id, value)}
              ref={async (myUserSwitchFilterControlComponent: MyUserSwitchFilterControlComponent) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)}
            />
          </FilterVisibleContainerComponent>
        }
        <FilterModalContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)}
        >
          <DateFilterControlComponent
            filterID={'startDateTime'}
            internalFilterID={GlobalFilters.TRANSACTIONS_START_DATE_FILTER}
            label={I18n.t('general.startDate')}
            onFilterChanged={async (id: string, value: Date) =>
              this.getFilterModalContainerComponent().setFilter(id, value)}
            ref={async (dateFilterControlComponent: DateFilterControlComponent) =>
              this.addModalFilter(dateFilterControlComponent)}
            locale={this.state.locale}
            minimumDate={minTransactionDate}
            defaultDate={startDateTime}
            maximumDate={endDateTime}
          />
          <DateFilterControlComponent
            filterID={'endDateTime'}
            internalFilterID={GlobalFilters.TRANSACTIONS_END_DATE_FILTER}
            label={I18n.t('general.endDate')}
            onFilterChanged={async (id: string, value: Date) =>
              this.getFilterModalContainerComponent().setFilter(id, value)}
            ref={async (dateFilterControlComponent: DateFilterControlComponent) =>
              this.addModalFilter(dateFilterControlComponent)}
            locale={this.state.locale}
            minimumDate={startDateTime}
            defaultDate={endDateTime}
            maximumDate={maxTransactionDate}
          />
        </FilterModalContainerComponent>
      </View>
    );
  };
}
