import React from 'react';
import ScreenFilters, { ScreenFiltersState } from '../../components/search/filter/screen/ScreenFilters';
import FilterVisibleContainerComponent
  from '../../components/search/filter/containers/FilterVisibleContainerComponent';
import MyUserSwitchFilterControlComponent
  from '../../components/search/filter/controls/my-user-switch/MyUserSwitchFilterControlComponent';
import { GlobalFilters } from '../../types/Filter';
import I18n from 'i18n-js';
import { View } from 'react-native';

interface State extends ScreenFiltersState {
  filters: CarsFiltersDef;
}

export interface CarsFiltersDef {
  userID?: string;
}

export interface Props {
  onFilterChanged?: (filters: CarsFiltersDef) => void;
  initialFilters?: CarsFiltersDef;
}

export default class CarsFilters extends ScreenFilters {
  public state: State;
  public props: Props;

  public render() {
    const { onFilterChanged, initialFilters } = this.props;
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    return (
      <View>
        {(isAdmin || hasSiteAdmin) && (
          <FilterVisibleContainerComponent
            onFilterChanged={onFilterChanged}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
            }>
            <MyUserSwitchFilterControlComponent
              filterID={'userID'}
              internalFilterID={GlobalFilters.CARS_USER_ID}
              initialValue={filters?.hasOwnProperty('userID') ? filters?.userID : initialFilters?.userID}
              label={I18n.t('general.onlyMyCars')}
              onFilterChanged={async (id: string, value: string) => this.getFilterVisibleContainerComponent().setFilter(id, value)}
              ref={async (myUserSwitchFilterControlComponent: MyUserSwitchFilterControlComponent) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)
              }
            />
          </FilterVisibleContainerComponent>
        )}
      </View>
    );
  }
}
