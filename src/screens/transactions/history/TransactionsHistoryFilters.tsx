import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import computeStyleSheet from './TransactionHistoryFiltersStyles';
import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
import DateFilterControlComponent from '../../../components/search/filter/controls/date/DateFilterControlComponent';
import SwitchFilterComponent from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import ScreenFilters, {
  ScreenFiltersProps,
  ScreenFiltersState
} from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';
import SecuredStorage from '../../../utils/SecuredStorage';

export interface Props extends ScreenFiltersProps<TransactionsHistoryFiltersDef>{
  initialFilters?: TransactionsHistoryFiltersDef;
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

export interface TransactionsHistoryFiltersDef {
  startDateTime?: Date;
  endDateTime?: Date;
  currentUser?: boolean;
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

export default class TransactionsHistoryFilters extends ScreenFilters<TransactionsHistoryFiltersDef, Props> {
  public state: ScreenFiltersState<TransactionsHistoryFiltersDef>;
  public props: Props;

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<ScreenFiltersState<TransactionsHistoryFiltersDef>>, snapshot?: any) {
    const { minTransactionDate, maxTransactionDate } = this.props;
    if (minTransactionDate?.getTime() !== prevProps.minTransactionDate?.getTime()
      || maxTransactionDate?.getTime() !== prevProps.maxTransactionDate?.getTime()) {
      const correctedDates = this.computeCorrectedDates(maxTransactionDate, minTransactionDate);
      this.onFiltersChanged(null, correctedDates);
    }
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.loadInitialFilters();
  }

  private computeCorrectedDates(maxTransactionDate: Date, minTransactionDate: Date): TransactionsHistoryFiltersDef {
    let { startDateTime, endDateTime } = this.state.filters;
    if (startDateTime) {
      if (startDateTime < minTransactionDate) {
        startDateTime = minTransactionDate;
      }
      if (startDateTime > maxTransactionDate) {
        startDateTime = maxTransactionDate
      }
    }
    if(endDateTime) {
      if (endDateTime < minTransactionDate) {
        endDateTime = minTransactionDate;
      }
      if (endDateTime > maxTransactionDate) {
        endDateTime = maxTransactionDate
      }
    }
    return {startDateTime, endDateTime};
  }

  private async loadInitialFilters() {
    const userID = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.MY_USER_FILTER);
    const startDateTimeString = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.TRANSACTIONS_START_DATE_FILTER);
    const endDateTimeString = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.TRANSACTIONS_END_DATE_FILTER);
    const startDateTime = startDateTimeString ? new Date(startDateTimeString as string) : null;
    const endDateTime = endDateTimeString ? new Date(endDateTimeString as string) : null;
    const initialFilters = {
      currentUser: !!userID,
      startDateTime,
      endDateTime
    };
    this.onFiltersChanged(null, initialFilters);

  }

  public render = () => {
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    const { maxTransactionDate, minTransactionDate } = this.props;
    let startDateTime = filters?.startDateTime;
    let endDateTime = filters?.endDateTime;
    const style = computeStyleSheet();
    return (
      <View>
        <FilterModalContainerComponent
          onFilterChanged={(newFilters) => this.onFiltersChanged(null, newFilters, true)}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          {isAdmin || hasSiteAdmin && (
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
          )}
          <View style={style.dateFiltersContainer}>
            <DateFilterControlComponent
              filterID={'startDateTime'}
              style={style.dateFilterComponentContainer}
              internalFilterID={GlobalFilters.TRANSACTIONS_START_DATE_FILTER}
              label={I18n.t('general.startDate')}
              onFilterChanged={async (id: string, startDateTime: Date) => this.onFiltersChanged(null, {startDateTime})}
              ref={async (dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
              locale={this.state.locale}
              minimumDate={minTransactionDate}
              date={startDateTime ?? minTransactionDate}
              maximumDate={endDateTime ?? maxTransactionDate}
            />
            <DateFilterControlComponent
              filterID={'endDateTime'}
              internalFilterID={GlobalFilters.TRANSACTIONS_END_DATE_FILTER}
              style={style.dateFilterComponentContainer}
              label={I18n.t('general.endDate')}
              onFilterChanged={async (id: string, endDateTime: Date) => this.onFiltersChanged(null, {endDateTime})}
              ref={async (dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
              locale={this.state.locale}
              minimumDate={startDateTime ?? minTransactionDate}
              date={endDateTime ?? maxTransactionDate}
              maximumDate={maxTransactionDate}
            />
          </View>
        </FilterModalContainerComponent>
      </View>
    );
  };
}
