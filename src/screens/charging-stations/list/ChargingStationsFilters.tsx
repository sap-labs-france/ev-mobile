import I18n from 'i18n-js';
import { View } from 'native-base';
import React from 'react';

import ConnectorTypeFilterControlComponent from '../../../components/search/filter/controls/connector-type/ConnectorTypeFilterControlComponent';
import computeControlStyleSheet from '../../../components/search/filter/controls/FilterControlComponentStyles';
import ScreenFilters from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';
import SwitchFilterComponent
  from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import FilterModalContainerComponent
  from '../../../components/search/filter/containers/FilterModalContainerComponent';
import SecuredStorage from '../../../utils/SecuredStorage';
import { scale } from 'react-native-size-matters';

export interface ChargingStationsFiltersDef {
  connectorStatus?: string;
  connectorTypes?: string;
}

export default class ChargingStationsFilters extends ScreenFilters<ChargingStationsFiltersDef> {

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    await this.loadInitialFilters();
  }

  private async loadInitialFilters() {
    const connectorStatus = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ONLY_AVAILABLE_CHARGING_STATIONS);
    let connectorTypes = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.CONNECTOR_TYPES);
    connectorTypes = connectorTypes || null;
    const initialFilters = { connectorStatus: connectorStatus as string, connectorTypes: connectorTypes as string };
    this.onFiltersChanged(null, initialFilters, true);
  }

  public render = () => {
    const { filters } = this.state;
    const controlStyle = computeControlStyleSheet();
    return (
      <View>
        <FilterModalContainerComponent
          onFilterChanged={(modalFilters) => this.onFiltersChanged(null, modalFilters, true)}
          ref={(filterModalContainerComponent: FilterModalContainerComponent) =>
            this.setFilterModalContainerComponent(filterModalContainerComponent)
          }>
          <SwitchFilterComponent<string>
            filterID={'connectorStatus'}
            internalFilterID={GlobalFilters.ONLY_AVAILABLE_CHARGING_STATIONS}
            enabledValue={'Available'}
            style={{marginBottom: scale(20)}}
            initialValue={filters?.connectorStatus}
            label={I18n.t('general.onlyAvailableChargers')}
            ref={async (
              onlyAvailableChargingStationSwitchFilterControlComponent: SwitchFilterComponent<string>
            ) => this.addModalFilter(onlyAvailableChargingStationSwitchFilterControlComponent)}
          />
          <ConnectorTypeFilterControlComponent
            filterID={'connectorTypes'}
            internalFilterID={GlobalFilters.CONNECTOR_TYPES}
            initialValue={filters?.connectorTypes}
            style={controlStyle.rowFilterWithBorder}
            label={I18n.t('details.connectors')}
            ref={async (connectorTypeFilterControlComponent: ConnectorTypeFilterControlComponent) =>
              this.addModalFilter(connectorTypeFilterControlComponent)
            }
          />
        </FilterModalContainerComponent>
      </View>
    );
  };
}
