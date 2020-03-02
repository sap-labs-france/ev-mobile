import FilterControlComponent from 'components/search/filter/controls/FilterControlComponent';
import I18n from 'i18n-js';
import React from 'react';
import FilterAggregatorContainerComponent from '../../../components/search/filter/aggregators/FilterAggregatorContainerComponent';
import FilterModalContainerComponent from '../../../components/search/filter/containers/FilterModalContainerComponent';
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

  public onFilterChanged = (newFilters: ChargersFiltersDef) => {
    const { onFilterChanged } = this.props;
    this.setState({
      filters: newFilters
    }, () => onFilterChanged(newFilters));
  }

  public render = () => {
    const { initialFilters } = this.props;
    const { filters } = this.state;
    return (
      <FilterAggregatorContainerComponent
          onFilterChanged={this.onFilterChanged}
          ref={(filterAggregatorContainerComponent: FilterAggregatorContainerComponent) => {
            if (filterAggregatorContainerComponent) {
              this.setFilterAggregatorContainerComponent(filterAggregatorContainerComponent);
            }
          }}
        >
        {/* <FilterVisibleContainerComponent>
          <OnlyAvailableChargerSwitchFilterControlComponent
              filterID={'connectorStatus'}
              internalFilterID={GlobalFilters.ONLY_AVAILABLE_CHARGERS}
              initialValue={filters.connectorStatus ? filters.connectorStatus : initialFilters.connectorStatus}
              label={I18n.t('general.onlyAvailableChargers')}
              ref={async (onlyAvailableChargerFilterComponent: OnlyAvailableChargerSwitchFilterControlComponent) => {
                if (onlyAvailableChargerFilterComponent && this.getFilterContainerComponent()) {
                  await onlyAvailableChargerFilterComponent.setFilterContainerComponent(this.getFilterContainerComponent());
                }
              }}
            />
        </FilterVisibleContainerComponent> */}
        <FilterModalContainerComponent
          containerID='ChargersFiltersModal'
          ref={(filterModalContainerComponent: FilterModalContainerComponent) => {
            if (filterModalContainerComponent && this.getFilterAggregatorContainerComponent()) {
              filterModalContainerComponent.setFilterAggregatorContainerComponent(this.getFilterAggregatorContainerComponent());
              this.getFilterAggregatorContainerComponent().addFilterContainerComponent(filterModalContainerComponent);
            }
          }}
        >
          <OnlyAvailableChargerSwitchFilterControlComponent
            filterID={'connectorStatus'}
            internalFilterID={GlobalFilters.ONLY_AVAILABLE_CHARGERS}
            initialValue={filters.hasOwnProperty('connectorStatus') ? filters.connectorStatus : initialFilters.connectorStatus}
            label={I18n.t('general.onlyAvailableChargers')}
            ref={async (filterControlComponent: FilterControlComponent<any>) => {
              if (filterControlComponent && this.getFilterAggregatorContainerComponent()) {
                const filterContainerComponent = this.getFilterAggregatorContainerComponent().getFilterContainerComponent('ChargersFiltersModal');
                if (filterContainerComponent) {
                  filterControlComponent.setFilterContainerComponent(filterContainerComponent);
                  filterContainerComponent.addFilter(filterControlComponent);
                }
              }
            }}
          />
        </FilterModalContainerComponent>
      </FilterAggregatorContainerComponent>
    );
  };
}
