import I18n from 'i18n-js';
import React from 'react';
import BaseScreenFilters, { BaseScreenFiltersState } from '../../../components/search/complex/BaseScreenFilters';
import DateFilterControlComponent from '../../../components/search/complex/filter/date/DateFilterControlComponent';
import MyUserSwitchFilterControlComponent from '../../../components/search/complex/filter/my-user-switch/MyUserSwitchFilterControlComponent';
import FilterContainerComponent from '../../../components/search/complex/FilterContainerComponent';
import { FilterGlobalInternalIDs } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: TransactionsFiltersDef) => void;
  initialFilters?: TransactionsFiltersDef;
}

export interface TransactionsFiltersDef {
  'StartDateTime'?: string;
  'EndDateTime'?: string;
  'UserID'?: string;
}

interface State extends BaseScreenFiltersState {
  filters?: TransactionsFiltersDef;
}

export default class TransactionsHistoryFilters extends BaseScreenFilters {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {}
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public onFilterChanged = (filters: TransactionsFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (closed) {
      this.setState({
        filters
      });
      onFilterChanged(filters);
    }
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters } = this.state;
    return (
      <FilterContainerComponent
        onFilterChanged={this.onFilterChanged}
        ref={(filterContainerComponent: FilterContainerComponent) => {
          this.setFilterContainerComponent(filterContainerComponent);
        }}
      >
        {this.state.isAdmin &&
          <MyUserSwitchFilterControlComponent
            filterID={'UserID'}
            internalFilterID={FilterGlobalInternalIDs.MY_USER_FILTER}
            initialValue={filters.UserID ? filters.UserID : initialFilters.UserID}
            label={I18n.t('general.onlyMyTransactions')}
            ref={async (myUserSwitchFilterComponent: MyUserSwitchFilterControlComponent) => {
              if (myUserSwitchFilterComponent && this.getFilterContainerComponent()) {
                await myUserSwitchFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
              }
            }}
          />
        }
        <DateFilterControlComponent
          filterID={'StartDateTime'}
          internalFilterID={FilterGlobalInternalIDs.STATISTICS_START_DATE_FILTER}
          label={I18n.t('general.startDate')}
          ref={async (dateFilterComponent: DateFilterControlComponent) => {
            if (dateFilterComponent && this.getFilterContainerComponent()) {
              await dateFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
            }
          }}
          locale={this.state.locale}
          minimumDate={new Date(initialFilters.StartDateTime)}
          defaultDate={filters.StartDateTime ? new Date(filters.StartDateTime) : new Date(initialFilters.StartDateTime)}
          maximumDate={filters.EndDateTime ? new Date(filters.EndDateTime) : new Date(initialFilters.EndDateTime)}
        />
        <DateFilterControlComponent
          filterID={'EndDateTime'}
          internalFilterID={FilterGlobalInternalIDs.STATISTICS_END_DATE_FILTER}
          label={I18n.t('general.endDate')}
          ref={async (dateFilterComponent: DateFilterControlComponent) => {
            if (dateFilterComponent && this.getFilterContainerComponent()) {
              await dateFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
            }
          }}
          locale={this.state.locale}
          minimumDate={filters.StartDateTime ? new Date(filters.StartDateTime) : new Date(initialFilters.StartDateTime)}
          defaultDate={filters.EndDateTime ? new Date(filters.EndDateTime) : new Date(initialFilters.EndDateTime)}
          maximumDate={new Date(initialFilters.EndDateTime)}
        />
      </FilterContainerComponent>
    );
  };
}
