import I18n from 'i18n-js';
import React from 'react';

import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../types/Filter';
import SecuredStorage from '../../utils/SecuredStorage';
import computeSitesFiltersStyles from './SiteAreasFiltersStyles';
import FilterModalContainerComponent
  from '../../components/search/filter/containers/FilterModalContainerComponent';
import SwitchFilterComponent
  from '../../components/search/filter/controls/switch/SwitchFilterComponent';

export interface SiteAreasFiltersDef {
  issuer?: boolean;
}

export default class SiteAreasFilters extends ScreenFilters<SiteAreasFiltersDef> {

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.loadInitialFilters();
  }

  private async loadInitialFilters() {
    const issuer = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ROAMING);
    const initialFilters = { issuer: !!issuer };
    this.onFiltersChanged(null, initialFilters, true);
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
            label={I18n.t('filters.siteAreasRoamingFilterLabel')}
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
