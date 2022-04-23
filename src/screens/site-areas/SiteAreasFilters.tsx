import React from 'react';

import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import FilterModalContainerComponent
  from '../../components/search/filter/containers/FilterModalContainerComponent';

export interface SiteAreasFiltersDef {
}

export default class SiteAreasFilters extends ScreenFilters<SiteAreasFiltersDef> {

  public render() {
    return (
      <FilterModalContainerComponent
        onFilterChanged={(modalFilters) => this.onFiltersChanged(null, modalFilters, true)}
        ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
          this.setFilterModalContainerComponent(filterModalContainerComponent)
        }>
      </FilterModalContainerComponent>
    );
  }
}
