import I18n from 'i18n-js';
import { Button, Icon, StyleProvider, Text, View } from 'native-base';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal';
import { SwipeListView } from 'react-native-swipe-list-view'
import { TenantConnection } from 'types/Tenant';

import HeaderComponent from '../../../components/header/HeaderComponent';
import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import BaseScreen from '../../base-screen/BaseScreen';
import computeTenantStyleSheet from '../TenantManagementStyle';

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
      tenantVisible: false,
    }
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    // add key property to tenants object array for the key extractor
    const tenants = this.props.tenants.map((tenant, i) => ({...tenant, key: JSON.stringify(i)}));
    const formStyle = computeFormStyleSheet();
    const tenantStyle = computeTenantStyleSheet();
    return (
      <View>
        <Button block={true} style={formStyle.button} onPress={() => this.setState({tenantVisible: true})}>
          <Text style={formStyle.buttonText} uppercase={false}>{this.props.tenantName}</Text>
        </Button>
        <Modal isVisible={this.state.tenantVisible}>
          <View style={tenantStyle.modalContainer}>
            <HeaderComponent
              navigation={this.props.navigation}
              title={I18n.t('authentication.tenant')}
              rightActionIcon={null}
              hideHomeAction={true}
              leftActionIcon='clear'
              leftActionIconType='MaterialIcons'
              leftAction={() => this.setState({tenantVisible: false})}
            />
            <View style={tenantStyle.toolBar}>
              <Button style={tenantStyle.restoreTenantButton} transparent={true}>
                <Icon style={tenantStyle.icon} type={'MaterialIcons'} name='settings-backup-restore'/>
              </Button>
              <Button style={tenantStyle.createTenantButton} transparent={true}>
                <Icon style={tenantStyle.icon} type={'MaterialIcons'} name='add'/>
              </Button>
            </View>
            <SwipeListView
              useFlatList={true}
              data={tenants}
              renderItem={({ item }) => (
                <View style={tenantStyle.tenantNameView}>
                  <TouchableOpacity>
                    <Text style={tenantStyle.tenantNameText}>{item.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
              renderHiddenItem={() => (
                <Button style={tenantStyle.trashIconButton} danger={true}>
                  <Icon style={tenantStyle.icon} name='trash'/>
                </Button>
              )}
              rightOpenValue={-65}
              keyExtractor={(item) => item.key}
            />
          </View>
        </Modal>
      </View>
    );
  }
}
