import I18n from 'i18n-js';
import React from 'react';
import BaseFilters, { BaseFiltersState } from '../../../components/search/complex/BaseFilters';
import ComplexSearchComponent from '../../../components/search/complex/ComplexSearchComponent';
import MyUserSwitchFilterComponent from '../../../components/search/complex/filter/my-user-switch/MyUserSwitchFilterComponent';
import { FilterGlobalInternalIDs } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: TransactionsFiltersDef) => void;
  initialFilters?: TransactionsFiltersDef;
}

export interface TransactionsFiltersDef {
  'UserID'?: string;
}

interface State extends BaseFiltersState {
  filters?: TransactionsFiltersDef;
}

export default class TransactionsInProgressFilters extends BaseFilters {
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

  public onFilterChanged = (filters: TransactionsFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (closed) {
      this.setState({
        filters
      });
      onFilterChanged(filters);
    }
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters } = this.state;
    return (
      <ComplexSearchComponent
        onFilterChanged={this.onFilterChanged}
        ref={(complexSearchComponent: ComplexSearchComponent) => {
          this.setComplexSearchComponent(complexSearchComponent);
        }}
      >
        {this.state.isAdmin &&
          <MyUserSwitchFilterComponent
            filterID={'UserID'}
            internalFilterID={FilterGlobalInternalIDs.MY_USER_FILTER}
            initialValue={filters.UserID ? filters.UserID : initialFilters.UserID}
            label={I18n.t('general.onlyMyTransactions')}
            ref={async (myUserSwitchFilterComponent: MyUserSwitchFilterComponent) => {
              if (myUserSwitchFilterComponent && this.getComplexSearchComponent()) {
                await myUserSwitchFilterComponent.setComplexSearchComponent(this.getComplexSearchComponent());
              }
            }}
          />
        }
      </ComplexSearchComponent>
    );
  };
}
