import { Text, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ToggleButton } from 'react-native-paper';

import Chademo from '../../../../../../assets/connectorType/chademo.svg';
import ComboCCS from '../../../../../../assets/connectorType/combo-ccs.svg';
import Domestic from '../../../../../../assets/connectorType/domestic-ue.svg';
import Type2 from '../../../../../../assets/connectorType/type2.svg';
import { ConnectorType } from '../../../../../types/ChargingStation';
import Utils from '../../../../../utils/Utils';
import FilterControlComponent, {
  FilterControlComponentProps,
  FilterControlComponentState
} from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<string> {
}

interface State extends FilterControlComponentState<string> {
  connectorTypes: ConnectorFilter[];
}

interface ConnectorFilter {
  type: ConnectorType;
  element: Element;
  selected: boolean;
}

export default class ConnectorTypeFilterControlComponent extends FilterControlComponent<string> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    // Init
    const connectorStyle = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    this.state = {
      connectorTypes: [
        { type: ConnectorType.TYPE_2, element: <Type2 width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} stroke={commonColor.textColor} strokeWidth='10' />, selected: false },
        { type: ConnectorType.COMBO_CCS, element: <ComboCCS width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} stroke={commonColor.textColor} strokeWidth='30' />, selected: false },
        { type: ConnectorType.CHADEMO, element: <Chademo width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} stroke={commonColor.textColor} strokeWidth='30' />, selected: false },
        { type: ConnectorType.DOMESTIC, element: <Domestic width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} fill={commonColor.textColor} />, selected: false },
      ],
      value : this.props.initialValue
    };
    // Default filter values
    const connectorTypes = this.getValue() as string;
    if (connectorTypes) {
      for (const connectorType of connectorTypes.split('|')) {
        for (const connector of this.state.connectorTypes) {
          if (connector.type === connectorType) {
            connector.selected = true;
            break;
          }
        }
      }
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public canBeSaved() {
    return true;
  }

  private onValueChanged = async () => {
    const { onFilterChanged } = this.props;
    // Build Filter
    const connectorFilters: ConnectorType[] = [];
    const connectorTypes = this.state.connectorTypes;
    for (const connector of connectorTypes) {
      if (connector.selected) {
        connectorFilters.push(connector.type);
      }
    }
    if (onFilterChanged) {
      if (connectorFilters.length) {
        const filterValue = connectorFilters.join('|');
        this.setValue(filterValue, () => { onFilterChanged(this.getID(), filterValue); } );
      } else {
        this.clearValue(() => { onFilterChanged(this.getID(), null); });
      }
    }
    // Update
    this.forceUpdate();
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { style, label } = this.props;
    return (
      <View style={StyleSheet.compose(internalStyle.columnFilterContainer, style)}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <View style={internalStyle.connectorTypeFilterContainer}>
          {this.state.connectorTypes.map((connector) =>
            <ToggleButton
              style={internalStyle.connectorTypeButton}
              key={connector.type}
              icon={() => connector.element}
              value='bluetooth'
              status={connector.selected ? 'checked' : 'unchecked'}
              onPress={() => {
                connector.selected = !connector.selected;
                this.onValueChanged();
              }}
            />
          )}
        </View>
      </View>
    );
  }
}
