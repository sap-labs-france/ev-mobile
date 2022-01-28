import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import computeStyleSheet from './TransactionHistoryFiltersStyles';
import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
import DateFilterControlComponent from '../../../components/search/filter/controls/date/DateFilterControlComponent';
import SwitchFilterComponent from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import ScreenFilters, { ScreenFiltersProps, } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';
import SecuredStorage from '../../../utils/SecuredStorage';

export interface Props extends ScreenFiltersProps<TransactionsHistoryFiltersDef>{
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

export interface TransactionsHistoryFiltersDef {
  startDateTime?: Date;
  endDateTime?: Date;
  userID?: string;
}

export default class TransactionsHistoryFilters extends ScreenFilters<TransactionsHistoryFiltersDef, Props> {
  private currentUserID: string;

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.loadInitialFilters();
    this.currentUserID = this.centralServerProvider.getUserInfo()?.id;
  }

  private async loadInitialFilters() {
    const userID = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.MY_USER_FILTER);
    const startDateTimeString = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.TRANSACTIONS_START_DATE_FILTER);
    const endDateTimeString = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.TRANSACTIONS_END_DATE_FILTER);
    const startDateTime = startDateTimeString ? new Date(startDateTimeString as string) : null;
    const endDateTime = endDateTimeString ? new Date(endDateTimeString as string) : null;
    const initialFilters = {
      userID: userID as string,
      startDateTime,
      endDateTime
    };
    this.onFiltersChanged(null, initialFilters, true);

  }

  public render = () => {
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    const { maxTransactionDate, minTransactionDate } = this.props;
    const startDateTime = filters?.startDateTime;
    const endDateTime = filters?.endDateTime;
    const style = computeStyleSheet();
    return (
      <View>
        <FilterModalContainerComponent
          onFilterChanged={(newFilters) => this.onFiltersChanged(null, newFilters, true)}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          {(isAdmin || hasSiteAdmin) && (
            <SwitchFilterComponent<string>
              filterID={'userID'}
              internalFilterID={GlobalFilters.MY_USER_FILTER}
              style={style.switchFilterComponentContainer}
              initialValue={filters?.userID}
              enabledValue={this.currentUserID}
              label={I18n.t('general.onlyMyTransactions')}
              ref={async (myUserSwitchFilterControlComponent: SwitchFilterComponent<string>) =>
                this.addModalFilter(myUserSwitchFilterControlComponent)
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
              initialValue={startDateTime}
              defaultValue={minTransactionDate}
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
              initialValue={endDateTime}
              defaultValue={maxTransactionDate}
              maximumDate={maxTransactionDate}
            />
          </View>
        </FilterModalContainerComponent>
      </View>
    );
  };
}
