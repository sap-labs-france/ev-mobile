import I18n from 'i18n-js';
import { Button, Text, View } from 'native-base';
import React from 'react';
import { ScrollView } from 'react-native'
import Modal from 'react-native-modal';
import { TenantConnection } from 'types/Tenant';

import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import BaseScreen from '../../base-screen/BaseScreen';
import computeTenantStyleSheet from '../TenantManangementStyle';

export interface Props extends BaseProps {
  tenantName: string;
  tenants: TenantConnection[];
}

interface State {
  tenantVisible: boolean
}

export default class TenantManagement extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;
  constructor(props: Props) {
    super(props);
    this.state = {
      tenantVisible: false
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const formStyle = computeFormStyleSheet();
    const tenantStyle = computeTenantStyleSheet();
    return (
      <View>
        <Button block={true} style={formStyle.button} onPress={() => this.setState({tenantVisible: true})}>
          <Text style={formStyle.buttonText} uppercase={false}>{this.props.tenantName}</Text>
        </Button>
        <Modal onSwipeComplete={() => this.setState({tenantVisible: false})} swipeDirection={'down'} isVisible={this.state.tenantVisible}>
            <View style={tenantStyle.modalContainer}>
              <View style={tenantStyle.titleView}>
                <Text style={tenantStyle.titleText}>{I18n.t('authentication.tenant')}</Text>
              </View>
              <View style={tenantStyle.toolBar}>
                <Button style={tenantStyle.restoreTenantButton} block={true} warning>
                  <Text style={tenantStyle.restoreTenantText}>Restore</Text>
                </Button>
                <Button style={tenantStyle.createTenantButton} success>
                  <Text style={tenantStyle.createTenantText}>Create</Text>
                </Button>
              </View>
              <ScrollView style={{backgroundColor: 'red'}}>
                <Text style={tenantStyle.tenantNameText}>SAP Labs France</Text>
                <Text style={tenantStyle.tenantNameText}>TenantName</Text>
                <Text style={tenantStyle.tenantNameText}>TenantName</Text>
                <Text style={tenantStyle.tenantNameText}>TenantName</Text>
                <Text style={tenantStyle.tenantNameText}>TenantName</Text>
              </ScrollView>
              <Button block={true}>
                <Text>Cancel</Text>
              </Button>
            </View>
        </Modal>
      </View>
    );
  }
}
