import moment from 'moment';
import { View } from 'native-base';
import React from 'react';
import ScreenFilters, { ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';

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

  public onFilterChanged = (newFilters: TransactionsHistoryFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (closed) {
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
        filters: newFilters
      }, () => onFilterChanged(newFilters));
    }
  }

  public render = () => {
    // const { initialFilters } = this.props;
    // const { filters, isAdmin, hasSiteAdmin } = this.state;
    return (
      <View/>
      // <FilterModalContainerComponent
      //   onFilterChanged={this.onFilterChanged}
      //   ref={(filterContainerComponent: FilterModalContainerComponent) => {
      //     this.setFilterContainerComponent(filterContainerComponent);
      //   }}
      // >
      //   {(isAdmin || hasSiteAdmin) &&
      //     <MyUserSwitchFilterControlComponent
      //       filterID={'userID'}
      //       internalFilterID={GlobalFilters.MY_USER_FILTER}
      //       initialValue={filters.hasOwnProperty('userID') ? filters.userID : initialFilters.userID}
      //       label={I18n.t('general.onlyMyTransactions')}
      //       ref={async (myUserSwitchFilterComponent: MyUserSwitchFilterControlComponent) => {
      //         if (myUserSwitchFilterComponent && this.getFilterContainerComponent()) {
      //           await myUserSwitchFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
      //         }
      //       }}
      //     />
      //   }
      //   <DateFilterControlComponent
      //     filterID={'startDateTime'}
      //     internalFilterID={GlobalFilters.STATISTICS_START_DATE_FILTER}
      //     label={I18n.t('general.startDate')}
      //     ref={async (dateFilterComponent: DateFilterControlComponent) => {
      //       if (dateFilterComponent && this.getFilterContainerComponent()) {
      //         await dateFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
      //       }
      //     }}
      //     locale={this.state.locale}
      //     minimumDate={initialFilters.startDateTime}
      //     defaultDate={filters.startDateTime ? filters.startDateTime : initialFilters.startDateTime}
      //     maximumDate={filters.endDateTime ? filters.endDateTime : initialFilters.endDateTime}
      //   />
      //   <DateFilterControlComponent
      //     filterID={'endDateTime'}
      //     internalFilterID={GlobalFilters.STATISTICS_END_DATE_FILTER}
      //     label={I18n.t('general.endDate')}
      //     ref={async (dateFilterComponent: DateFilterControlComponent) => {
      //       if (dateFilterComponent && this.getFilterContainerComponent()) {
      //         await dateFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
      //       }
      //     }}
      //     locale={this.state.locale}
      //     minimumDate={filters.startDateTime ? filters.startDateTime : initialFilters.startDateTime}
      //     defaultDate={filters.endDateTime ? filters.endDateTime : initialFilters.endDateTime}
      //     maximumDate={initialFilters.endDateTime}
      //   />
      // </FilterModalContainerComponent>
    );
  };
}
