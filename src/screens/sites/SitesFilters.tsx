import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import FilterVisibleContainerComponent from '../../components/search/filter/containers/FilterVisibleContainerComponent';
import LocationSwitchFilterControlComponent from '../../components/search/filter/controls/location-switch/LocationSwitchFilterControlComponent';
import ScreenFilters, { ScreenFiltersState } from '../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: SitesFiltersDef) => void;
  initialFilters?: SitesFiltersDef;
  locationEnabled?: boolean;
}

interface State extends ScreenFiltersState {
  filters?: SitesFiltersDef;
}

export interface SitesFiltersDef {
  location?: boolean;
}

export default class SitesFilters extends ScreenFilters {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {}
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public onFilterChanged = (newFilters: SitesFiltersDef) => {
    const { onFilterChanged } = this.props;
    this.setState(
      {
        filters: { ...this.state.filters, ...newFilters }
      },
      () => onFilterChanged(newFilters)
    );
  };

  public render = () => {
    const { initialFilters, locationEnabled } = this.props;
    const { filters } = this.state;
    return (
      <View>
        <FilterVisibleContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
            this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
          }>
          {locationEnabled && (
            <LocationSwitchFilterControlComponent
              filterID={'location'}
              internalFilterID={GlobalFilters.LOCATION}
              initialValue={filters.hasOwnProperty('location') ? filters.location : initialFilters.location}
              label={I18n.t('general.location')}
              onFilterChanged={async (id: string, value: boolean) => this.getFilterVisibleContainerComponent().setFilter(id, value)}
              ref={async (locationSwitchFilterControlComponent: LocationSwitchFilterControlComponent) =>
                this.addVisibleFilter(locationSwitchFilterControlComponent)
              }
            />
          )}
        </FilterVisibleContainerComponent>
      </View>
    );
  };
}
