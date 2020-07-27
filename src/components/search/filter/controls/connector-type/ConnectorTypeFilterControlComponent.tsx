import { Text, View } from 'native-base';
import React from 'react';
import { ToggleButton } from 'react-native-paper';
import Chademo from '../../../../../../assets/connectorType/chademo.svg';
import ComboCCS from '../../../../../../assets/connectorType/combo-ccs.svg';
import Domestic from '../../../../../../assets/connectorType/domestic-ue.svg';
import Type2 from '../../../../../../assets/connectorType/type2.svg';
import commonColor from '../../../../../custom-theme/customCommonColor';
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

  constructor(props: Props) {
    super(props);
    const connectorTypes = this.getValue() as string;
    if (connectorTypes) {
      for (const connectorType of connectorTypes.split('|')) {
        for (const connector of this.getConnectors()) {
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

  public getConnectors(): {type: ConnectorType; element: Element; selected: boolean;}[] {
    const connectorStyle = computeStyleSheet();
    return [
      { type: ConnectorType.TYPE_2, element: <Type2 width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} stroke={commonColor.textColor} strokeWidth='10'/>, selected: false },
      { type: ConnectorType.COMBO_CCS, element: <ComboCCS width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} stroke={commonColor.textColor} strokeWidth='30'/>, selected: false },
      { type: ConnectorType.CHADEMO, element: <Chademo width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} stroke={commonColor.textColor} strokeWidth='30'/>, selected: false },
      { type: ConnectorType.DOMESTIC, element: <Domestic width={connectorStyle.connectorTypeSVG.width} height={connectorStyle.connectorTypeSVG.height} fill={commonColor.textColor}/>, selected: false },
    ]
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
    for (const connector of this.getConnectors()) {
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
      <View style={{...internalStyle.columnFilterContainer, ...style}}>
        <Text style={internalStyle.textFilter}>{label}</Text>
        <View style={internalStyle.connectorTypeFilterContainer}>
          {this.getConnectors().map((connector) =>
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
