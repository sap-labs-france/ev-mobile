import React from 'react';
import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import SecuredStorage from '../../utils/SecuredStorage';
import { GlobalFilters } from '../../types/Filter';
import FilterModalContainerComponent
  from '../../components/search/filter/containers/FilterModalContainerComponent';
import SwitchFilterComponent
  from '../../components/search/filter/controls/switch/SwitchFilterComponent';
import I18n from 'i18n-js';
import computeSitesFiltersStyles from './SitesFiltersStyles';

export interface SitesFiltersDef {
  issuer?: boolean;
}

export default class SitesFilters extends ScreenFilters<SitesFiltersDef> {

  protected async getInitialFilters(): Promise<{visibleFilters: SitesFiltersDef, modalFilters: SitesFiltersDef}> {
    const issuer = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ROAMING);
    const initialFilters = { issuer: !!issuer };
    return {visibleFilters: null, modalFilters: initialFilters};
  }

  public render() {
    const filtersStyles = computeSitesFiltersStyles();
    const { filters } = this.state;
    return (
      <FilterModalContainerComponent
        onFilterChanged={(modalFilters) => this.onFiltersChanged(null, modalFilters, true)}
        ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
          this.setFilterModalContainerComponent(filterModalContainerComponent)
        }>
        {this.securityProvider?.isComponentOrganizationActive() && (
          <SwitchFilterComponent<boolean>
            filterID={'issuer'}
            internalFilterID={GlobalFilters.ROAMING}
            enabledValue={true}
            style={filtersStyles.switchFilterControlComponentContainer}
            label={I18n.t('filters.sitesRoamingFilterLabel')}
            initialValue={filters?.issuer}
            ref={async (
              roamingFilterControlComponent : SwitchFilterComponent<boolean>
            ) => this.addModalFilter(roamingFilterControlComponent)}
          />
        )}
      </FilterModalContainerComponent>
    );
  }
}
