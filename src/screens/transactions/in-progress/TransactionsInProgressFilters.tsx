import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import FilterVisibleContainerComponent from '../../../components/search/filter/containers/FilterVisibleContainerComponent';
import SwitchFilterComponent from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import ScreenFilters, { ScreenFiltersProps, ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';
import SecuredStorage from '../../../utils/SecuredStorage';
import computeStyleSheet from '../../../components/search/filter/controls/FilterControlComponentStyles';

export interface TransactionsInProgressFiltersDef {
  userID?: string;
}

export default class TransactionsInProgressFilters extends ScreenFilters<TransactionsInProgressFiltersDef> {
  private currentUserID: string;

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.loadInitialFilters();
    this.currentUserID = this.centralServerProvider.getUserInfo()?.id;
  }

  public async loadInitialFilters() {
    const userID = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.MY_USER_FILTER);
    this.setState({
      filters: { userID: userID as string }
    });
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
          <FilterVisibleContainerComponent
            onFilterChanged={(newFilters) => this.onFiltersChanged(newFilters, null, true)}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
            }>
            <SwitchFilterComponent<string>
              filterID={'userID'}
              internalFilterID={GlobalFilters.MY_USER_FILTER}
              initialValue={filters?.userID}
              enabledValue={this.currentUserID}
              style={style.transactionsInProgressUserSwitchContainer}
              label={I18n.t('general.onlyMyTransactions')}
              onFilterChanged={async (id: string, value: string) => this.getFilterVisibleContainerComponent().notifyFilterChanged()}
              ref={async (myUserSwitchFilterControlComponent: SwitchFilterComponent<string>) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)
              }
            />
          </FilterVisibleContainerComponent>
        )}
      </View>
    );
  };
}
