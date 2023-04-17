import React from 'react';
import ScreenFilters from '../../components/search/filter/screen/ScreenFilters';
import FilterModalContainerComponent
  from '../../components/search/filter/containers/FilterModalContainerComponent';
import UserFilterComponent from '../../components/search/filter/controls/user/UserFilterComponent';
import User from '../../types/User';
import { View } from 'react-native';

export interface TagsFiltersDef {
  users: User[]
}

export default class TagsFilters extends ScreenFilters<TagsFiltersDef> {

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    this.onFiltersChanged(null, null, true);
  }

  public render = () => {
    const { filters } = this.state;
    return (
      <View>
        <FilterModalContainerComponent
          onFilterChanged={(modalFilters) => this.onFiltersChanged(null, modalFilters, true)}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          {this.securityProvider?.canListUsers() && (
            <UserFilterComponent
              filterID={'users'}
              initialValue={filters.users}
              ref={async (userFilterControlComponent: UserFilterComponent) => this.addModalFilter(userFilterControlComponent)}
            />
          )}
        </FilterModalContainerComponent>
      </View>
    );
  };
}
