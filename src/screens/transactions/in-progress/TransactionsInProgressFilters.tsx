import React from 'react';

import ScreenFilters, { ScreenFiltersProps, ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import FilterModalContainerComponent
  from '../../../components/search/filter/containers/FilterModalContainerComponent';
import UserFilterComponent
  from '../../../components/search/filter/controls/user/UserFilterComponent';
import User from '../../../types/User';
import SwitchFilterComponent
  from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import { GlobalFilters } from '../../../types/Filter';
import I18n from 'i18n-js';
import computeStyleSheet from './TransactionsInProgressFiltersStyles';
import SecuredStorage from '../../../utils/SecuredStorage';
import { View } from 'react-native';

export interface TransactionsInProgressFiltersDef {
  users?: User[];
  issuer?: boolean;
}

export default class TransactionsInProgressFilters extends ScreenFilters<TransactionsInProgressFiltersDef> {

  protected async getInitialFilters(): Promise<{visibleFilters: TransactionsInProgressFiltersDef, modalFilters: TransactionsInProgressFiltersDef}> {
    const issuer = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ROAMING);
    const initialFilters = { issuer: !!issuer };
    return {visibleFilters: null, modalFilters: initialFilters};
  }

  public setState<K extends keyof ScreenFiltersState<TransactionsInProgressFiltersDef>>(state: ((prevState: Readonly<ScreenFiltersState<TransactionsInProgressFiltersDef>>, props: Readonly<ScreenFiltersProps<TransactionsInProgressFiltersDef>>) => (Pick<ScreenFiltersState<TransactionsInProgressFiltersDef>, K> | ScreenFiltersState<TransactionsInProgressFiltersDef> | null)) | Pick<ScreenFiltersState<TransactionsInProgressFiltersDef>, K> | ScreenFiltersState<TransactionsInProgressFiltersDef> | null, callback?: () => void) {
    super.setState(state, callback);
  }

  public render = () => {
    const { filters } = this.state;
    const style = computeStyleSheet();
    return (
      <View>
        <FilterModalContainerComponent
          onFilterChanged={(newFilters) => this.onFiltersChanged(null, newFilters, true)}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          {this.securityProvider?.isComponentOrganizationActive() && (
            <SwitchFilterComponent<boolean>
              filterID={'issuer'}
              internalFilterID={GlobalFilters.ROAMING}
              enabledValue={true}
              style={style.switchFilterControlComponentContainer}
              label={I18n.t('filters.transactionsRoamingFilterLabel')}
              initialValue={filters?.issuer}
              ref={async (
                roamingFilterControlComponent : SwitchFilterComponent<boolean>
              ) => this.addModalFilter(roamingFilterControlComponent)}
            />
          )}
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
