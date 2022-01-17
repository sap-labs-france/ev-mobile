import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import FilterVisibleContainerComponent from '../../../components/search/filter/containers/FilterVisibleContainerComponent';
import SwitchFilterComponent from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import ScreenFilters, { ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  initialFilters?: TransactionsInProgressFiltersDef;
  onFilterChanged?: (filters: TransactionsInProgressFiltersDef) => void;
}

export interface TransactionsInProgressFiltersDef {
  currentUser?: boolean;
}

interface State extends ScreenFiltersState {
  filters?: TransactionsInProgressFiltersDef;
}

export default class TransactionsInProgressFilters extends ScreenFilters {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
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

  public onFilterChanged = (newFilters: TransactionsInProgressFiltersDef, applyFilters: boolean) => {
    const { onFilterChanged } = this.props;
    if (applyFilters) {
      this.setState(
        {
          filters: { ...this.state.filters, ...newFilters }
        },
        () => onFilterChanged(newFilters)
      );
    } else {
      this.setState({
        filters: { ...this.state.filters, ...newFilters }
      });
    }
  };

  public render = () => {
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    return (
      <View>
        {(isAdmin || hasSiteAdmin) && (
          <FilterVisibleContainerComponent
            onFilterChanged={this.onFilterChanged}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
            }>
            <SwitchFilterComponent
              filterID={'currentUser'}
              internalFilterID={GlobalFilters.MY_USER_FILTER}
              initialValue={filters?.currentUser}
              label={I18n.t('general.onlyMyTransactions')}
              onFilterChanged={async (id: string, value: string) => this.getFilterVisibleContainerComponent().notifyFilterChanged()}
              ref={async (myUserSwitchFilterControlComponent: SwitchFilterComponent) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)
              }
            />
          </FilterVisibleContainerComponent>
        )}
      </View>
    );
  };
}
