import I18n from 'i18n-js';
import moment from 'moment';
import { View } from 'native-base';
import React from 'react';

import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
import FilterVisibleContainerComponent from '../../../components/search/filter/containers/FilterVisibleContainerComponent';
import DateFilterControlComponent from '../../../components/search/filter/controls/date/DateFilterControlComponent';
import SwitchFilterComponent from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import ScreenFilters, {
  ScreenFiltersProps,
  ScreenFiltersState
} from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: TransactionsHistoryFiltersDef) => void;
  initialFilters?: TransactionsHistoryFiltersDef;
}

export interface TransactionsHistoryFiltersDef {
  startDateTime?: Date;
  endDateTime?: Date;
  currentUser?: boolean;
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

interface State extends ScreenFiltersState {
  filters?: TransactionsHistoryFiltersDef;
}

export default class TransactionsHistoryFilters extends ScreenFilters {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      filters: null
    };
  }

  public componentDidUpdate(prevProps: Readonly<ScreenFiltersProps>, prevState: Readonly<ScreenFiltersState>, snapshot?: any) {
    const { filters } = this.state;
    const { initialFilters } = this.props;
    const newFilters = filters ?? initialFilters;
    //
    if((newFilters.endDateTime?.getTime() !== filters?.endDateTime?.getTime())
      || (newFilters.startDateTime?.getTime() !== filters?.startDateTime?.getTime())
      || (newFilters.currentUser !== filters?.currentUser))
    {
      this.setState({filters: newFilters});
    }
    // If initial filters
    if ((initialFilters.startDateTime || initialFilters.endDateTime) && !filters) {
      this.getFilterModalContainerComponent().setFiltersActive(true);
    }
    // If filters changed
    if (filters?.startDateTime || filters?.endDateTime) {
      this.getFilterModalContainerComponent().setFiltersActive(true);
    }
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public onFilterChanged = (newFilters: TransactionsHistoryFiltersDef, applyFilters: boolean) => {
    const { onFilterChanged } = this.props;
    // User ID has been changed: Clear Start/End Date
    if (applyFilters && newFilters.hasOwnProperty('currentUser') && this.state.filters.currentUser !== newFilters.currentUser) {
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
      this.setState(
        {
          filters: { ...this.state.filters, ...newFilters }
        },
        () => {
          onFilterChanged(this.state.filters);
        }
      );
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
    let startDateTime = filters?.startDateTime;
    let endDateTime = filters?.endDateTime;
    // Check the saved dates interval and fix it according to the current max and min dates if needed
    if ((!startDateTime || !endDateTime) && (!initialFilters.startDateTime || !initialFilters.endDateTime)) {
      startDateTime = minTransactionDate;
      endDateTime = maxTransactionDate;
    }
    if (startDateTime && startDateTime < minTransactionDate) {
      startDateTime = minTransactionDate;
      if (endDateTime < minTransactionDate) {
        endDateTime = minTransactionDate;
      }
    }
    if (endDateTime && endDateTime > maxTransactionDate) {
      endDateTime = maxTransactionDate;
      if (startDateTime > maxTransactionDate) {
        startDateTime = maxTransactionDate;
      }
    }
    return (
      <View>
        {(isAdmin || hasSiteAdmin) && (
          <FilterVisibleContainerComponent
            onFilterChanged={this.onFilterChanged}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
            }>
            <SwitchFilterComponent
              filterID={'currentUser'}
              internalFilterID={GlobalFilters.MY_USER_FILTER}
              initialValue={filters?.currentUser}
              label={I18n.t('general.onlyMyTransactions')}
              onFilterChanged={async (id: string, value: boolean) => this.getFilterVisibleContainerComponent().notifyFilterChanged()}
              ref={async (myUserSwitchFilterControlComponent: SwitchFilterComponent) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)
              }
            />
          </FilterVisibleContainerComponent>
        )}
        <FilterModalContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          <DateFilterControlComponent
            filterID={'startDateTime'}
            internalFilterID={GlobalFilters.TRANSACTIONS_START_DATE_FILTER}
            label={I18n.t('general.startDate')}
            onFilterChanged={async (id: string, value: Date) => this.getFilterVisibleContainerComponent().notifyFilterChanged()}
            ref={async (dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
            locale={this.state.locale}
            minimumDate={minTransactionDate}
            defaultDate={startDateTime}
            maximumDate={endDateTime}
          />
          <DateFilterControlComponent
            filterID={'endDateTime'}
            internalFilterID={GlobalFilters.TRANSACTIONS_END_DATE_FILTER}
            label={I18n.t('general.endDate')}
            onFilterChanged={async (id: string, value: Date) => this.getFilterVisibleContainerComponent().notifyFilterChanged()}
            ref={async (dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
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
