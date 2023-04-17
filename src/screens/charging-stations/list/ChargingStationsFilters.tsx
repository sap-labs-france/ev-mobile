import I18n from 'i18n-js';
import React from 'react';

import ConnectorTypeFilterControlComponent from '../../../components/search/filter/controls/connector-type/ConnectorTypeFilterControlComponent';
import ScreenFilters, { ScreenFiltersProps } from '../../../components/search/filter/screen/ScreenFilters';
import { GlobalFilters } from '../../../types/Filter';
import SwitchFilterComponent
  from '../../../components/search/filter/controls/switch/SwitchFilterComponent';
import FilterModalContainerComponent
  from '../../../components/search/filter/containers/FilterModalContainerComponent';
import SecuredStorage from '../../../utils/SecuredStorage';
import computeChargingStationsFiltersStyles from './ChargingStationsFiltersStyles';
import { View } from 'react-native';

export interface ChargingStationsFiltersDef {
  connectorStatus?: string;
  connectorTypes?: string;
  issuer?: boolean;
}

export interface Props extends ScreenFiltersProps<ChargingStationsFiltersDef> {
  showRoamingFilter?: boolean;
}

export default class ChargingStationsFilters extends ScreenFilters<ChargingStationsFiltersDef, Props> {
  public static defaultProps = {
    showRoamingFilter: true
  };

  protected async getInitialFilters(): Promise<{visibleFilters: ChargingStationsFiltersDef, modalFilters: ChargingStationsFiltersDef}> {
    const connectorStatus = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ONLY_AVAILABLE_CHARGING_STATIONS);
    let connectorTypes = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.CONNECTOR_TYPES);
    connectorTypes = connectorTypes || null;
    const issuer = await SecuredStorage.loadFilterValue(this.centralServerProvider.getUserInfo(), GlobalFilters.ROAMING);
    const initialFilters = { connectorStatus: connectorStatus as string, connectorTypes: connectorTypes as string, issuer: !!issuer };
    return { visibleFilters: null, modalFilters: initialFilters };
  }

  public render = () => {
    const { filters } = this.state;
    const filtersStyles = computeChargingStationsFiltersStyles();
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
            style={filtersStyles.switchFilterControlComponentContainer}
            initialValue={filters?.connectorStatus}
            label={I18n.t('general.onlyAvailableChargers')}
            ref={(onlyAvailableChargingStationSwitchFilterControlComponent: SwitchFilterComponent<string>
            ) => this.addModalFilter(onlyAvailableChargingStationSwitchFilterControlComponent)}
          />
          {this.securityProvider?.isComponentOrganizationActive() && this.props.showRoamingFilter && (
            <SwitchFilterComponent<boolean>
              filterID={'issuer'}
              internalFilterID={GlobalFilters.ROAMING}
              enabledValue={true}
              style={filtersStyles.switchFilterControlComponentContainer}
              label={I18n.t('filters.chargingStationsRoamingFilterLabel')}
              initialValue={filters?.issuer}
              ref={(roamingFilterControlComponent: SwitchFilterComponent<boolean>) => this.addModalFilter(roamingFilterControlComponent)}
            />
          )}
          <ConnectorTypeFilterControlComponent
            filterID={'connectorTypes'}
            internalFilterID={GlobalFilters.CONNECTOR_TYPES}
            initialValue={filters?.connectorTypes}
            label={I18n.t('details.connectors')}
            ref={(connectorTypeFilterControlComponent: ConnectorTypeFilterControlComponent) =>
              this.addModalFilter(connectorTypeFilterControlComponent)
            }
          />
        </FilterModalContainerComponent>
      </View>
    );
  };
}
