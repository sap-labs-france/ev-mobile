import { View } from 'native-base';
import React from 'react';

import ScreenFilters, { ScreenFiltersProps, ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import computeStyleSheet from '../../../components/search/filter/controls/FilterControlComponentStyles';
import FilterModalContainerComponent
  from '../../../components/search/filter/containers/FilterModalContainerComponent';
import UserFilterComponent
  from '../../../components/search/filter/controls/user/UserFilterComponent';
import User from '../../../types/User';

export interface TransactionsInProgressFiltersDef {
  userID?: User[];
}

export default class TransactionsInProgressFilters extends ScreenFilters<TransactionsInProgressFiltersDef> {

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    this.onFiltersChanged(null, null, true);
  }

  public setState<K extends keyof ScreenFiltersState<TransactionsInProgressFiltersDef>>(state: ((prevState: Readonly<ScreenFiltersState<TransactionsInProgressFiltersDef>>, props: Readonly<ScreenFiltersProps<TransactionsInProgressFiltersDef>>) => (Pick<ScreenFiltersState<TransactionsInProgressFiltersDef>, K> | ScreenFiltersState<TransactionsInProgressFiltersDef> | null)) | Pick<ScreenFiltersState<TransactionsInProgressFiltersDef>, K> | ScreenFiltersState<TransactionsInProgressFiltersDef> | null, callback?: () => void) {
    super.setState(state, callback);
  }

  public render = () => {
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    const style = computeStyleSheet();
    return (
      <View>
        {(isAdmin || hasSiteAdmin) && (
          <FilterModalContainerComponent
            onFilterChanged={(newFilters) => this.onFiltersChanged(null, newFilters, true)}
            ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
              this.setFilterModalContainerComponent(filterModalContainerComponent)
            }>
            <UserFilterComponent
              filterID={'userID'}
              initialValue={filters.userID}
              ref={async (userFilterControlComponent: UserFilterComponent) => this.addModalFilter(userFilterControlComponent)}
              />
          </FilterModalContainerComponent>
        )}
      </View>
    );
  };
}
