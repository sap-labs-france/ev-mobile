import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import { StackActions } from '@react-navigation/native';
import Utils from '../../utils/Utils';
import computeStyleSheet from './TenantComponentStyle';
import { TenantConnection } from '../../types/Tenant';
import BaseProps from '../../types/BaseProps';
import I18n from 'i18n-js';
import Configuration from '../../config/Configuration';

interface State {}

export interface Props extends BaseProps {
  tenant: TenantConnection;
}

export default class TenantComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public render() {
    const style = computeStyleSheet();
    const { tenant } = this.props;
    const tenantEndpointName = Configuration.getEndpoints().find((e) => e.endpoint === tenant.endpoint)?.name;
    return (
      <TouchableOpacity
        style={style.container}
        onPress={() => {
          this.props.navigation.dispatch(
            StackActions.replace('AuthNavigator', {
              name: 'Login',
              params: {
                tenantSubDomain: tenant.subdomain
              },
              key: `${Utils.randomNumber()}`
            })
          );
        }}>
        <View style={style.content}>
          <Text style={[style.text, style.tenantName]}>{tenant.name}</Text>
          <Text style={style.text}>
            {I18n.t('authentication.tenantEndpoint')}: {tenantEndpointName}
          </Text>
          <Text style={style.text}>
            {I18n.t('authentication.tenantSubdomain')}: {tenant.subdomain}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
