import I18n from 'i18n-js';
import React from 'react';
import BaseFilters, { BaseFiltersState } from '../../components/search/complex/BaseFilters';
import ComplexSearchComponent from '../../components/search/complex/ComplexSearchComponent';
import DateFilterComponent from '../../components/search/complex/filter/date/DateFilterComponent';
import MyUserSwitchFilterComponent from '../../components/search/complex/filter/my-user-switch/MyUserSwitchFilterComponent';
import { FilterGlobalInternalIDs } from '../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: StatisticsFiltersDef) => void;
  initialFilters?: StatisticsFiltersDef;
}

export interface StatisticsFiltersDef {
  'StartDateTime'?: string;
  'EndDateTime'?: string;
  'UserID'?: string;
}

interface State extends BaseFiltersState {
  filters?: StatisticsFiltersDef;
}

export default class StatisticsFilters extends BaseFilters {
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

  public onFilterChanged = (filters: StatisticsFiltersDef, closed: boolean) => {
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
      <ComplexSearchComponent
        onFilterChanged={this.onFilterChanged}
        ref={(complexSearchComponent: ComplexSearchComponent) => {
          this.setComplexSearchComponent(complexSearchComponent);
        }}
      >
        {this.state.isAdmin &&
          <MyUserSwitchFilterComponent
            filterID={'UserID'}
            internalFilterID={FilterGlobalInternalIDs.MY_USER_FILTER}
            initialValue={filters.UserID ? filters.UserID : initialFilters.UserID}
            label={I18n.t('general.onlyMyTransactions')}
            ref={async (myUserSwitchFilterComponent: MyUserSwitchFilterComponent) => {
              if (myUserSwitchFilterComponent && this.getComplexSearchComponent()) {
                await myUserSwitchFilterComponent.setComplexSearchComponent(this.getComplexSearchComponent());
              }
            }}
          />
        }
        <DateFilterComponent
          filterID={'StartDateTime'}
          internalFilterID={FilterGlobalInternalIDs.STATISTICS_START_DATE_FILTER}
          label={I18n.t('general.startDate')}
          ref={async (dateFilterComponent: DateFilterComponent) => {
            if (dateFilterComponent && this.getComplexSearchComponent()) {
              await dateFilterComponent.setComplexSearchComponent(this.getComplexSearchComponent());
            }
          }}
          locale={this.state.locale}
          minimumDate={new Date(initialFilters.StartDateTime)}
          defaultDate={filters.StartDateTime ? new Date(filters.StartDateTime) : new Date(initialFilters.StartDateTime)}
          maximumDate={filters.EndDateTime ? new Date(filters.EndDateTime) : new Date(initialFilters.EndDateTime)}
        />
        <DateFilterComponent
          filterID={'EndDateTime'}
          internalFilterID={FilterGlobalInternalIDs.STATISTICS_END_DATE_FILTER}
          label={I18n.t('general.endDate')}
          ref={async (dateFilterComponent: DateFilterComponent) => {
            if (dateFilterComponent && this.getComplexSearchComponent()) {
              await dateFilterComponent.setComplexSearchComponent(this.getComplexSearchComponent());
            }
          }}
          locale={this.state.locale}
          minimumDate={filters.StartDateTime ? new Date(filters.StartDateTime) : new Date(initialFilters.StartDateTime)}
          defaultDate={filters.EndDateTime ? new Date(filters.EndDateTime) : new Date(initialFilters.EndDateTime)}
          maximumDate={new Date(initialFilters.EndDateTime)}
        />
      </ComplexSearchComponent>
    );
  };
}
