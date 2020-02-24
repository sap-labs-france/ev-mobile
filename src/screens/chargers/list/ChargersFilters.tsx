import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';
import BaseScreenFilters, { BaseScreenFiltersState } from '../../../components/search/complex/BaseScreenFilters';
import OnlyAvailableChargerFilterControlComponent from '../../../components/search/complex/filter/only-available-chargers/OnlyAvailableChargerFilterControlComponent';
import FilterModalContainerComponent from '../../../components/search/complex/FilterModalContainerComponent';
import FilterVisibleContainerComponent from '../../../components/search/complex/FilterVisibleContainerComponent';
import { ChargePointStatus } from '../../../types/ChargingStation';
import { GlobalFilters } from '../../../types/Filter';

export interface Props {
  onFilterChanged?: (filters: ChargersFiltersDef) => void;
  initialFilters?: ChargersFiltersDef;
}

export interface ChargersFiltersDef {
  connectorStatus?: ChargePointStatus;
}

interface State extends BaseScreenFiltersState {
  filters?: ChargersFiltersDef;
}

export default class ChargersFilters extends BaseScreenFilters {
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

  public onFilterChanged = (newFilters: ChargersFiltersDef, closed: boolean) => {
    const { onFilterChanged } = this.props;
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
      <View>
        <FilterVisibleContainerComponent>
          <OnlyAvailableChargerFilterControlComponent
              filterID={'connectorStatus'}
              internalFilterID={GlobalFilters.ONLY_AVAILABLE_CHARGERS}
              initialValue={filters.connectorStatus ? filters.connectorStatus : initialFilters.connectorStatus}
              label={I18n.t('general.onlyAvailableChargers')}
              ref={async (onlyAvailableChargerFilterComponent: OnlyAvailableChargerFilterControlComponent) => {
                if (onlyAvailableChargerFilterComponent && this.getFilterContainerComponent()) {
                  await onlyAvailableChargerFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
                }
              }}
            />
        </FilterVisibleContainerComponent>
        <FilterModalContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterContainerComponent: FilterModalContainerComponent) => {
            this.setFilterContainerComponent(filterContainerComponent);
          }}
        >
          <OnlyAvailableChargerFilterControlComponent
            filterID={'connectorStatus'}
            internalFilterID={GlobalFilters.ONLY_AVAILABLE_CHARGERS}
            initialValue={filters.connectorStatus ? filters.connectorStatus : initialFilters.connectorStatus}
            label={I18n.t('general.onlyAvailableChargers')}
            ref={async (onlyAvailableChargerFilterComponent: OnlyAvailableChargerFilterControlComponent) => {
              if (onlyAvailableChargerFilterComponent && this.getFilterContainerComponent()) {
                await onlyAvailableChargerFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
              }
            }}
          />
        </FilterModalContainerComponent>
      </View>
    );
  };
}
