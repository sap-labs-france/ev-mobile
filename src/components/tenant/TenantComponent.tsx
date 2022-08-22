import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { StackActions } from '@react-navigation/native';
import Utils from '../../utils/Utils';
import computeStyleSheet from './TenantComponentStyle';
import { TenantConnection } from '../../types/Tenant';
import BaseProps from '../../types/BaseProps';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import I18n from 'i18n-js';

interface State {}

export interface Props extends BaseProps {
  tenant: TenantConnection;
}

export default class TenantComponent extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public render() {
    const style = computeStyleSheet();
    const listItemCommonStyle = computeListItemCommonStyle();
    const { tenant } = this.props;
    const tenantEndpointName = tenant?.endpoint?.name;
    return (
      <TouchableOpacity
        style={[listItemCommonStyle.container, style.container]}
        disabled={!tenantEndpointName}
        onPress={() => {
          this.props.navigation.dispatch(
            StackActions.replace('AuthNavigator', {
              name: 'Login',
              params: {
                tenantSubDomain: tenant?.subdomain
              },
              key: `${Utils.randomNumber()}`
            })
          );
        }}>
        <View style={style.content}>
          <Text style={[style.text, style.tenantName]}>
            {tenant?.name} ({tenant?.subdomain})
          </Text>
          {tenantEndpointName ? (
            <Text style={style.text}>{tenantEndpointName}</Text>
          ) : (
            <Text style={[style.text, style.errorText]}>{I18n.t('authentication.noEndpoint')}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }
}
