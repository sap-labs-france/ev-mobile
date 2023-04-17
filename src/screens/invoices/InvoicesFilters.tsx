import React from 'react';
import ScreenFilters, { ScreenFiltersProps, ScreenFiltersState } from '../../components/search/filter/screen/ScreenFilters';
import FilterVisibleContainerComponent from '../../components/search/filter/containers/FilterVisibleContainerComponent';
import User from '../../types/User';
import FilterModalContainerComponent from '../../components/search/filter/containers/FilterModalContainerComponent';
import UserFilterComponent from '../../components/search/filter/controls/user/UserFilterComponent';

interface State extends ScreenFiltersState<InvoicesFiltersDef> {
  filters: InvoicesFiltersDef;
}

export interface InvoicesFiltersDef {
  users?: User[];
}

export default class InvoicesFilters extends ScreenFilters<InvoicesFiltersDef> {
  public state: State;
  public props: ScreenFiltersProps<InvoicesFiltersDef>;

  public render() {
    const { filters } = this.state;
    return (
      <FilterModalContainerComponent
        onFilterChanged={(newFilters) => this.onFiltersChanged(null, newFilters, true)}
        ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
          this.setFilterModalContainerComponent(filterVisibleContainerComponent)
        }>
        {this.securityProvider?.canListUsers() && (
          <UserFilterComponent
            filterID={'users'}
            initialValue={filters.users}
            ref={(userFilterControlComponent: UserFilterComponent) => this.addModalFilter(userFilterControlComponent)}
          />
        )}
      </FilterModalContainerComponent>
    );
  }
}
