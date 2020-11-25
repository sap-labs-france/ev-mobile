import I18n from 'i18n-js';
import { Button, Text } from 'native-base';
import React from 'react';
import Modalize from 'react-native-modalize';

import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import BaseScreen from '../../base-screen/BaseScreen';

export interface Props extends BaseProps {
  tenantName: string;
}

interface State {
}

export default class TenantManagement extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public renderTenant() {
    return (
      <Modalize ></Modalize>
    );
  }

  public render() {
    const formStyle = computeFormStyleSheet();
    return (
      <Button block={true} style={formStyle.button} onPress={() => this.renderTenant()}>
        <Text style={formStyle.buttonText} uppercase={false}>{this.props.tenantName}</Text>
      </Button>
    );
  }
}
