import React from 'react';
import ScreenFilters, { ScreenFiltersState } from '../../components/search/filter/screen/ScreenFilters';
import FilterVisibleContainerComponent
  from '../../components/search/filter/containers/FilterVisibleContainerComponent';
import SwitchFilterComponent
  from '../../components/search/filter/controls/switch/SwitchFilterComponent';
import { GlobalFilters } from '../../types/Filter';
import I18n from 'i18n-js';
import { View } from 'react-native';

interface State extends ScreenFiltersState {
  filters: CarsFiltersDef;
}

export interface CarsFiltersDef {
  currentUser?: boolean;
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
    const { isAdmin, hasSiteAdmin } = this.state;
    return (
      <View>
        {(isAdmin || hasSiteAdmin) && (
          <FilterVisibleContainerComponent
            onFilterChanged={(filters, applyFilters) => onFilterChanged(filters)}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
            }>
            <SwitchFilterComponent
              filterID={'currentUser'}
              internalFilterID={GlobalFilters.CARS_CURRENT_USER}
              initialValue={initialFilters?.currentUser}
              label={I18n.t('general.onlyMyCars')}
              onFilterChanged={async (id: string, value: boolean) => this.getFilterVisibleContainerComponent().notifyFilterChanged()}
              ref={async (myUserSwitchFilterControlComponent: SwitchFilterComponent) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)
              }
            />
          </FilterVisibleContainerComponent>
        )}
      </View>
    );
  }
}
