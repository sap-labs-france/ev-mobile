import React from 'react';

import { ConnectorType } from '../../../../../types/ChargingStation';
import Utils from '../../../../../utils/Utils';
import FilterControlComponent, { FilterControlComponentProps, FilterControlComponentState } from '../FilterControlComponent';
import computeStyleSheet from '../FilterControlComponentStyles';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

export interface Props extends FilterControlComponentProps<string> {}

interface State extends FilterControlComponentState<string> {
  connectorTypes: Set<ConnectorType>;
  value?: string;
}

export default class ConnectorTypeFilterControlComponent extends FilterControlComponent<string> {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    // Init
    this.state = {
      connectorTypes: new Set<ConnectorType>(this.props.initialValue?.split('|') as ConnectorType[]),
      value: this.props.initialValue
    };
  }

  public canBeSaved() {
    return true;
  }

  public clearValue(callback?: () => unknown) {
    super.clearValue(callback);
    this.setState({connectorTypes: new Set()});
  }

  public render = () => {
    const internalStyle = computeStyleSheet();
    const { style } = this.props;
    const { connectorTypes } = this.state;
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={StyleSheet.compose(internalStyle.connectorTypeFilterContainer, style)}>
        {Object.values(ConnectorType)?.map((connector, index) => (
          <TouchableOpacity key={index} onPress={async () => this.onValueChanged(connector)} style={[internalStyle.connectorContainer, connectorTypes.has(connector) && internalStyle.selectedConnectorContainer]}>
            <>
              {Utils.buildConnectorTypeSVG(connector, connectorTypes.has(connector) ? commonColors.containerBgColor : commonColors.textColor, 30)}
              <Text numberOfLines={2} ellipsizeMode={'tail'} style={[internalStyle.connectorLabel, connectorTypes.has(connector) && internalStyle.selectedConnectorLabel]}>{Utils.translateConnectorType(connector)}</Text>
            </>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  private async onValueChanged (connector: ConnectorType): Promise<void> {
    const { onFilterChanged } = this.props;
    const { connectorTypes } = this.state;
    if(connectorTypes.has(connector)){
      connectorTypes.delete(connector);
    } else {
      connectorTypes.add(connector);
    }
    const value = connectorTypes.size > 0 ? Array.from(connectorTypes).join('|') : null;
    this.setState({connectorTypes, value}, () => onFilterChanged?.(this.getID(), value));
  }
}
