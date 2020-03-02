import { View } from 'native-base';
import React from 'react';
import ScreenFilters, { ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';

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

  public onFilterChanged = (newFilters: TransactionsInProgressFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (closed) {
      this.setState({
        filters: newFilters
      }, () => onFilterChanged(newFilters));
    }
  }

  public render = () => {
    // const { initialFilters } = this.props;
    // const { filters, isAdmin, hasSiteAdmin } = this.state;
    return (
      <View/>
       // <FilterModalContainerComponent
      //   onFilterChanged={this.onFilterChanged}
      //   ref={(filterContainerComponent: FilterModalContainerComponent) => {
      //     this.setFilterContainerComponent(filterContainerComponent);
      //   }}
      // >
      //   {(isAdmin || hasSiteAdmin) &&
      //     <MyUserSwitchFilterControlComponent
      //       filterID={'userID'}
      //       internalFilterID={GlobalFilters.MY_USER_FILTER}
      //       initialValue={filters.userID ? filters.userID : initialFilters.userID}
      //       label={I18n.t('general.onlyMyTransactions')}
      //       ref={async (myUserSwitchFilterComponent: MyUserSwitchFilterControlComponent) => {
      //         if (myUserSwitchFilterComponent && this.getFilterContainerComponent()) {
      //           await myUserSwitchFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
      //         }
      //       }}
      //     />
      //   }
      // </FilterModalContainerComponent>
    );
  };
}
