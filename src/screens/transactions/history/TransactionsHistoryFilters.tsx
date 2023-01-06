import I18n from 'i18n-js';
import React from 'react';

import computeStyleSheet from './TransactionHistoryFiltersStyles';
import FilterModalContainerComponent
  from '../../../components/search/filter/containers/FilterModalContainerComponent';
import DateFilterControlComponent
  from '../../../components/search/filter/controls/date/DateFilterControlComponent';
import ScreenFilters, { ScreenFiltersProps, } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';
import SecuredStorage from '../../../utils/SecuredStorage';
import UserFilterComponent
  from '../../../components/search/filter/controls/user/UserFilterComponent';
import User from '../../../types/User';
import SwitchFilterComponent
  from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import { View } from 'react-native';

export interface Props extends ScreenFiltersProps<TransactionsHistoryFiltersDef>{
  maxTransactionDate?: Date;
  minTransactionDate?: Date;
}

export interface TransactionsHistoryFiltersDef {
  startDateTime?: Date;
  endDateTime?: Date;
  users?: User[];
  issuer?: boolean;
}

export default class TransactionsHistoryFilters extends ScreenFilters<TransactionsHistoryFiltersDef, Props> {


  protected async getInitialFilters(): Promise<{visibleFilters: TransactionsHistoryFiltersDef, modalFilters: TransactionsHistoryFiltersDef}> {
    const startDateTimeString = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.TRANSACTIONS_START_DATE_FILTER);
    const endDateTimeString = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.TRANSACTIONS_END_DATE_FILTER);
    const issuer = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ROAMING);
    const startDateTime = startDateTimeString ? new Date(startDateTimeString as string) : null;
    const endDateTime = endDateTimeString ? new Date(endDateTimeString as string) : null;
    const initialFilters = {
      startDateTime,
      endDateTime,
      issuer: !!issuer
    };
    return { visibleFilters: null, modalFilters: initialFilters };

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
          {this.securityProvider?.isComponentOrganizationActive() && (
            <SwitchFilterComponent<boolean>
              filterID={'issuer'}
              internalFilterID={GlobalFilters.ROAMING}
              enabledValue={true}
              style={style.switchFilterControlComponentContainer}
              label={I18n.t('filters.transactionsRoamingFilterLabel')}
              initialValue={filters?.issuer}
              ref={(roamingFilterControlComponent: SwitchFilterComponent<boolean>
              ) => this.addModalFilter(roamingFilterControlComponent)}
            />
          )}
          {(isAdmin || hasSiteAdmin) && (
            <View>
              {this.securityProvider?.canListUsers() && (
                <UserFilterComponent
                  filterID={'users'}
                  initialValue={filters.users}
                  ref={(userFilterControlComponent: UserFilterComponent) => this.addModalFilter(userFilterControlComponent)}
                />
              )}
            </View>
          )}
          <View style={style.dateFiltersContainer}>
            <DateFilterControlComponent
              filterID={'startDateTime'}
              style={style.dateFilterComponentContainer}
              internalFilterID={GlobalFilters.TRANSACTIONS_START_DATE_FILTER}
              label={I18n.t('general.startDate')}
              onFilterChanged={(id: string, newStartDateTime: Date) => this.onFiltersChanged(null, {startDateTime: newStartDateTime})}
              ref={(dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
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
              onFilterChanged={(id: string, newEndDateTime: Date) => this.onFiltersChanged(null, {endDateTime: newEndDateTime})}
              ref={(dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
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

