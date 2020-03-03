import I18n from 'i18n-js';
import moment from 'moment';
import React from 'react';
import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
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
}

interface State extends ScreenFiltersState {
  filters?: TransactionsHistoryFiltersDef;
}

export default class TransactionsHistoryFilters extends ScreenFilters {
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

  public onFilterChanged = (newFilters: TransactionsHistoryFiltersDef) => {
    const { onFilterChanged } = this.props;
    // User ID has been changed: Clear Start/End Date
    if ((this.state.filters.userID || newFilters.userID) && this.state.filters.userID !== newFilters.userID) {
      delete newFilters.startDateTime;
      delete newFilters.endDateTime;
    }
    if (newFilters.startDateTime) {
      newFilters.startDateTime = moment(newFilters.startDateTime).startOf('day').toDate();
    }
    if (newFilters.endDateTime) {
      newFilters.endDateTime = moment(newFilters.endDateTime).endOf('day').toDate();
    }
    this.setState({
      filters: { ...this.state.filters, ...newFilters }
    }, () => onFilterChanged(newFilters));
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    console.log('====================================');
    console.log(filters);
    console.log('====================================');
    return (
      <FilterModalContainerComponent
        onFilterChanged={this.onFilterChanged}
        ref={(filterModalContainerComponent: FilterModalContainerComponent) => {
          if (filterModalContainerComponent) {
            this.setFilterModalContainerComponent(filterModalContainerComponent);
          }
        }}
      >
        {(isAdmin || hasSiteAdmin) &&
          <MyUserSwitchFilterControlComponent
            filterID={'userID'}
            internalFilterID={GlobalFilters.MY_USER_FILTER}
            initialValue={filters.hasOwnProperty('userID') ? filters.userID : initialFilters.userID}
            label={I18n.t('general.onlyMyTransactions')}
            onFilterChanged={(id: string, value: string) => {
              this.getFilterModalContainerComponent().setFilter(id, value);
              this.getFilterModalContainerComponent().notifyFilterChanged();
            }}
            ref={(myUserSwitchFilterControlComponent: MyUserSwitchFilterControlComponent) => {
              const filterContainerComponent = this.getFilterModalContainerComponent();
              if (filterContainerComponent && myUserSwitchFilterControlComponent) {
                filterContainerComponent.addFilter(myUserSwitchFilterControlComponent);
              }
            }}
          />
        }
        <DateFilterControlComponent
          filterID={'startDateTime'}
          internalFilterID={GlobalFilters.STATISTICS_START_DATE_FILTER}
          label={I18n.t('general.startDate')}
          onFilterChanged={(id: string, value: Date) => {
            this.getFilterModalContainerComponent().setFilter(id, value);
            this.getFilterModalContainerComponent().notifyFilterChanged();
          }}
          ref={(dateFilterControlComponent: DateFilterControlComponent) => {
            const filterContainerComponent = this.getFilterModalContainerComponent();
            if (filterContainerComponent && dateFilterControlComponent) {
              filterContainerComponent.addFilter(dateFilterControlComponent);
            }
          }}
          locale={this.state.locale}
          minimumDate={initialFilters.startDateTime}
          defaultDate={filters.startDateTime ? filters.startDateTime : initialFilters.startDateTime}
          maximumDate={filters.endDateTime ? filters.endDateTime : initialFilters.endDateTime}
        />
        <DateFilterControlComponent
          filterID={'endDateTime'}
          internalFilterID={GlobalFilters.STATISTICS_END_DATE_FILTER}
          label={I18n.t('general.endDate')}
          onFilterChanged={(id: string, value: Date) => {
            this.getFilterModalContainerComponent().setFilter(id, value);
            this.getFilterModalContainerComponent().notifyFilterChanged();
          }}
          ref={(dateFilterControlComponent: DateFilterControlComponent) => {
            const filterContainerComponent = this.getFilterModalContainerComponent();
            if (filterContainerComponent && dateFilterControlComponent) {
              filterContainerComponent.addFilter(dateFilterControlComponent);
            }
          }}
          locale={this.state.locale}
          minimumDate={filters.startDateTime ? filters.startDateTime : initialFilters.startDateTime}
          defaultDate={filters.endDateTime ? filters.endDateTime : initialFilters.endDateTime}
          maximumDate={initialFilters.endDateTime}
        />
      </FilterModalContainerComponent>
    );
  };
}
