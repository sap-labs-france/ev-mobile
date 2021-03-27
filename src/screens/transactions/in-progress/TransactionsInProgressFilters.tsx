import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import FilterVisibleContainerComponent from '../../../components/search/filter/containers/FilterVisibleContainerComponent';
import MyUserSwitchFilterControlComponent from '../../../components/search/filter/controls/my-user-switch/MyUserSwitchFilterControlComponent';
import ScreenFilters, { ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: TransactionsInProgressFiltersDef) => void;
  initialFilters?: TransactionsInProgressFiltersDef;
}

export interface TransactionsInProgressFiltersDef {
  userID?: string;
}

interface State extends ScreenFiltersState {
  filters?: TransactionsInProgressFiltersDef;
}

export default class TransactionsInProgressFilters extends ScreenFilters {
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
    const { initialFilters } = this.props;
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    return (
      <View>
        {(isAdmin || hasSiteAdmin) && (
          <FilterVisibleContainerComponent
            onFilterChanged={this.onFilterChanged}
            ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
              this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)
            }>
            <MyUserSwitchFilterControlComponent
              filterID={'userID'}
              internalFilterID={GlobalFilters.MY_USER_FILTER}
              initialValue={filters.hasOwnProperty('userID') ? filters.userID : initialFilters.userID}
              label={I18n.t('general.onlyMyTransactions')}
              onFilterChanged={async (id: string, value: string) => this.getFilterVisibleContainerComponent().setFilter(id, value)}
              ref={async (myUserSwitchFilterControlComponent: MyUserSwitchFilterControlComponent) =>
                this.addVisibleFilter(myUserSwitchFilterControlComponent)
              }
            />
          </FilterVisibleContainerComponent>
        )}
      </View>
    );
  };
}
