import I18n from 'i18n-js';
import React from 'react';
import FilterAggregatorContainerComponent from '../../../components/search/filter/aggregators/FilterAggregatorContainerComponent';
import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
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

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public onFilterChanged = (newFilters: TransactionsInProgressFiltersDef) => {
    const { onFilterChanged } = this.props;
    this.setState({
      filters: newFilters
    }, () => onFilterChanged(newFilters));
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters, isAdmin, hasSiteAdmin } = this.state;
    return (
      <FilterAggregatorContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterAggregatorContainerComponent: FilterAggregatorContainerComponent) => {
            if (filterAggregatorContainerComponent) {
              this.setFilterAggregatorContainerComponent(filterAggregatorContainerComponent);
            }
          }}
        >
        <FilterModalContainerComponent
          containerID='TransactionsInProgressFiltersModal'
          ref={(filterModalContainerComponent: FilterModalContainerComponent) => {
            if (filterModalContainerComponent && this.getFilterAggregatorContainerComponent()) {
              filterModalContainerComponent.setFilterAggregatorContainerComponent(this.getFilterAggregatorContainerComponent());
              this.getFilterAggregatorContainerComponent().addFilterContainerComponent(filterModalContainerComponent);
            }
          }}
        >
        {(isAdmin || hasSiteAdmin) &&
          <MyUserSwitchFilterControlComponent
            filterID={'userID'}
            internalFilterID={GlobalFilters.MY_USER_FILTER}
            initialValue={filters.userID ? filters.userID : initialFilters.userID}
            label={I18n.t('general.onlyMyTransactions')}
            ref={async (myUserSwitchFilterControlComponent: MyUserSwitchFilterControlComponent) => {
              if (myUserSwitchFilterControlComponent && this.getFilterAggregatorContainerComponent()) {
                if (myUserSwitchFilterControlComponent && this.getFilterAggregatorContainerComponent()) {
                  const filterContainerComponent = this.getFilterAggregatorContainerComponent().getFilterContainerComponent('TransactionsInProgressFiltersModal');
                  if (filterContainerComponent) {
                    myUserSwitchFilterControlComponent.setFilterContainerComponent(filterContainerComponent);
                    filterContainerComponent.addFilter(myUserSwitchFilterControlComponent);
                  }
                }
              }
            }}
          />
        }
        </FilterModalContainerComponent>
      </FilterAggregatorContainerComponent>
    );
  };
}
