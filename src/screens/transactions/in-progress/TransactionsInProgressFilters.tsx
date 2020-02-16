import I18n from 'i18n-js';
import React from 'react';
import BaseScreenFilters, { BaseScreenFiltersState } from '../../../components/search/complex/BaseScreenFilters';
import MyUserSwitchFilterControlComponent from '../../../components/search/complex/filter/my-user-switch/MyUserSwitchFilterControlComponent';
import FilterContainerComponent from '../../../components/search/complex/FilterContainerComponent';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: TransactionsInProgressFiltersDef) => void;
  initialFilters?: TransactionsInProgressFiltersDef;
}

export interface TransactionsInProgressFiltersDef {
  userID?: string;
}

interface State extends BaseScreenFiltersState {
  filters?: TransactionsInProgressFiltersDef;
}

export default class TransactionsInProgressFilters extends BaseScreenFilters {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
      filters: {}
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public onFilterChanged = (newFilters: TransactionsInProgressFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    console.log('====================================');
    console.log('TransactionsInProgress.onFilterChanged');
    console.log(newFilters);
    console.log('====================================');
    if (closed) {
      this.setState({
        filters: newFilters
      }, () => onFilterChanged(newFilters));
    }
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters } = this.state;
    return (
      <FilterContainerComponent
        onFilterChanged={this.onFilterChanged}
        ref={(filterContainerComponent: FilterContainerComponent) => {
          this.setFilterContainerComponent(filterContainerComponent);
        }}
      >
        {this.state.isAdmin &&
          <MyUserSwitchFilterControlComponent
            filterID={'userID'}
            internalFilterID={GlobalFilters.MY_USER_FILTER}
            initialValue={filters.userID ? filters.userID : initialFilters.userID}
            label={I18n.t('general.onlyMyTransactions')}
            ref={async (myUserSwitchFilterComponent: MyUserSwitchFilterControlComponent) => {
              if (myUserSwitchFilterComponent && this.getFilterContainerComponent()) {
                await myUserSwitchFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
              }
            }}
          />
        }
      </FilterContainerComponent>
    );
  };
}
