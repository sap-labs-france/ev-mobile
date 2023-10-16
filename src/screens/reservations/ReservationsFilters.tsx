import React from 'react';

import ScreenFilters, { ScreenFiltersProps } from '../../components/search/filter/screen/ScreenFilters';
import FilterModalContainerComponent from '../../components/search/filter/containers/FilterModalContainerComponent';
import User from '../../types/User';
import SecuredStorage from '../../utils/SecuredStorage';
import { GlobalFilters } from '../../types/Filter';
import UserFilterComponent from '../../components/search/filter/controls/user/UserFilterComponent';
import DateFilterControlComponent from '../../components/search/filter/controls/date/DateFilterControlComponent';
import I18n from 'i18n-js';
import { View } from 'react-native';
import computeStyleSheet from './ReservationsFiltersStyles';
import SwitchFilterComponent from '../../components/search/filter/controls/switch/SwitchFilterComponent';

export interface Props extends ScreenFiltersProps<ReservationsFiltersDef> {
  reservationMinFromDate?: Date;
  reservationMaxToDate?: Date;
}

export interface ReservationsFiltersDef {
  fromDateTime?: Date;
  toDateTime?: Date;
  expiryDateTime?: Date;
  users?: User[];
  onlyActiveReservations?: boolean;
}

export default class ReservationsFilters extends ScreenFilters<ReservationsFiltersDef, Props> {
  public render() {
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    const { reservationMinFromDate, reservationMaxToDate } = this.props;
    const fromDateTime = filters?.fromDateTime;
    const toDateTime = filters?.toDateTime;
    const style = computeStyleSheet();
    return (
      <View>
        <FilterModalContainerComponent
          onFilterChanged={(newFilters) => this.onFiltersChanged(null, newFilters, true)}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          <SwitchFilterComponent<boolean>
            filterID={'onlyActiveReservations'}
            internalFilterID={GlobalFilters.ONLY_ACTIVE_RESERVATIONS}
            enabledValue={true}
            style={style.switchFilterControlComponentContainer}
            label={I18n.t('filters.activeReservationsFilterLabel')}
            initialValue={filters?.onlyActiveReservations}
            ref={(activeReservationsFilterControlComponent: SwitchFilterComponent<boolean>) =>
              this.addModalFilter(activeReservationsFilterControlComponent)
            }
          />
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
              filterID={'fromDateTime'}
              internalFilterID={GlobalFilters.RESERVATIONS_FROM_DATE_FILTER}
              dateMode={'datetime'}
              style={style.dateFilterComponentContainer}
              label={I18n.t('reservations.fromDate')}
              onFilterChanged={(id: string, newFromDateTime: Date) => this.onFiltersChanged(null, { fromDateTime: newFromDateTime })}
              ref={(dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
              locale={this.state.locale}
              minimumDate={fromDateTime ?? reservationMinFromDate}
              initialValue={fromDateTime}
              defaultValue={reservationMinFromDate}
              maximumDate={toDateTime ?? reservationMaxToDate}
            />
            <DateFilterControlComponent
              filterID={'toDateTime'}
              internalFilterID={GlobalFilters.RESERVATIONS_TO_DATE_FILTER}
              dateMode={'datetime'}
              style={style.dateFilterComponentContainer}
              label={I18n.t('reservations.toDate')}
              onFilterChanged={(id: string, newToDateTime: Date) => this.onFiltersChanged(null, { toDateTime: newToDateTime })}
              ref={(dateFilterControlComponent: DateFilterControlComponent) => this.addModalFilter(dateFilterControlComponent)}
              locale={this.state.locale}
              minimumDate={toDateTime ?? reservationMinFromDate}
              initialValue={toDateTime}
              defaultValue={reservationMaxToDate}
              maximumDate={reservationMaxToDate}
            />
          </View>
        </FilterModalContainerComponent>
      </View>
    );
  }

  protected async getInitialFilters(): Promise<{ visibleFilters: ReservationsFiltersDef; modalFilters: ReservationsFiltersDef }> {
    const fromDateTimeString = await SecuredStorage.loadFilterValue(
      this.centralServerProvider.getUserInfo(),
      GlobalFilters.RESERVATIONS_FROM_DATE_FILTER
    );
    const toDateTimeString = await SecuredStorage.loadFilterValue(
      this.centralServerProvider.getUserInfo(),
      GlobalFilters.RESERVATIONS_TO_DATE_FILTER
    );
    const activeReservations = await SecuredStorage.loadFilterValue(
      this.centralServerProvider.getUserInfo(),
      GlobalFilters.ONLY_ACTIVE_RESERVATIONS
    );
    const fromDateTime = fromDateTimeString ? new Date(fromDateTimeString as string) : null;
    const toDateTime = toDateTimeString ? new Date(toDateTimeString as string) : null;
    const initialFilters = {
      fromDateTime,
      toDateTime,
      onlyActiveReservations: !!activeReservations
    };
    return { visibleFilters: null, modalFilters: initialFilters };
  }
}
