import { Text, View } from 'native-base';
import React from 'react';
import { ToggleButton } from 'react-native-paper';
import ComboCCS from '../../../../../../assets/connectorType/combo-ccs.svg';
import { ConnectorType } from '../../../../../types/ChargingStation';
import FilterControlComponent, { FilterControlComponentProps } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';

export interface Props extends FilterControlComponentProps<string> {
}

interface State {
}

export default class ConnectorTypeFilterControlComponent extends FilterControlComponent<string> {
  public state: State;
  public props: Props;
  private connectors: {type: ConnectorType; element: Element; selected: boolean;}[] = [
    { type: ConnectorType.COMBO_CCS, element: <ComboCCS width={30} height={30}/>, selected: false }
  ]

  constructor(props: Props) {
    super(props);
    const connectorTypes = this.getValue() as string;
    if (connectorTypes) {
      for (const connectorType of connectorTypes.split('|')) {
        for (const connector of this.connectors) {
          if (connector.type === connectorType) {
            connector.selected = true;
            break;
          }
        }
      }
    }
    this.state = {
    };
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
    for (const connector of this.connectors) {
      if (connector.selected) {
        connectorFilters.push(connector.type);
      }
    }
    if (onFilterChanged) {
      if (connectorFilters.length) {
        const filterValue = connectorFilters.join('|');
        this.setValue(filterValue);
        onFilterChanged(this.getID(), filterValue);
      } else {
        this.clearValue();
        onFilterChanged(this.getID(), null);
      }
    }
    // Update
    this.forceUpdate();
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { style, label } = this.props;
    return (
      <View style={{...internalStyle.rowFilter, ...style}}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        {this.connectors.map((connector) =>
          <ToggleButton
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
    );
  }
}
