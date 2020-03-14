import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';
import FilterVisibleContainerComponent from '../../../components/search/filter/containers/FilterVisibleContainerComponent';
import OnlyAvailableChargerSwitchFilterControlComponent from '../../../components/search/filter/controls/only-available-chargers/OnlyAvailableChargerSwitchFilterControlComponent';
import ScreenFilters, { ScreenFiltersState } from '../../../components/search/filter/screen/ScreenFilters';
import { ChargePointStatus } from '../../../types/ChargingStation';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: ChargersFiltersDef) => void;
  initialFilters?: ChargersFiltersDef;
}

interface State extends ScreenFiltersState {
  filters?: ChargersFiltersDef;
}

export interface ChargersFiltersDef {
  connectorStatus?: ChargePointStatus;
}

export default class ChargersFilters extends ScreenFilters {
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

  public onFilterChanged = (newFilters: ChargersFiltersDef, applyFilters: boolean) => {
    const { onFilterChanged } = this.props;
    this.setState({
      filters: { ...this.state.filters, ...newFilters }
    }, () => onFilterChanged(newFilters));
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters } = this.state;
    return (
      <View>
        <FilterVisibleContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterVisibleContainerComponent: FilterVisibleContainerComponent) =>
            this.setFilterVisibleContainerComponent(filterVisibleContainerComponent)}
        >
          <OnlyAvailableChargerSwitchFilterControlComponent
            filterID={'connectorStatus'}
            internalFilterID={GlobalFilters.ONLY_AVAILABLE_CHARGERS}
            initialValue={filters.hasOwnProperty('connectorStatus') ? filters.connectorStatus : initialFilters.connectorStatus}
            label={I18n.t('general.onlyAvailableChargers')}
            onFilterChanged={(id: string, value: ChargePointStatus) =>
              this.getFilterVisibleContainerComponent().setFilter(id, value)}
            ref={(onlyAvailableChargerSwitchFilterControlComponent: OnlyAvailableChargerSwitchFilterControlComponent) =>
              this.addVisibleFilter(onlyAvailableChargerSwitchFilterControlComponent)}
          />
        </FilterVisibleContainerComponent>
      </View>
    );
  };
}
