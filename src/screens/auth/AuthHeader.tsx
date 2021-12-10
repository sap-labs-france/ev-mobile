import I18n from 'i18n-js';
import { Text, View } from 'native-base';
import React from 'react';
import { Image, ImageStyle } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import BaseProps from '../../types/BaseProps';
import computeStyleSheet from './AuthStyles';

export interface Props extends BaseProps {
  tenantName?: string;
  tenantLogo?: string;
}

interface State {}

export default class AuthHeader extends React.Component<Props, State>{
  public state: State;
  public props: Props;

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { tenantName, tenantLogo } = this.props;
    return (
      <View style={style.header}>
        {tenantLogo ?
            <Image style={style.logo as ImageStyle} source={{ uri: tenantLogo }} />
          :
            <View style={style.logo}/>
        }
        <View>
          <Text style={style.appText}>Open e-Mobility</Text>
          <Text style={style.appVersionText}>{`${I18n.t('general.version')} ${DeviceInfo.getVersion()}`}</Text>
        </View>
        {tenantName ? (
          <View>
            <Text style={style.appTenant}>{I18n.t('authentication.tenantTitle')}</Text>
            <Text style={style.appTenantName}>{tenantName}</Text>
          </View>
        ) : undefined}
      </View>
    );
  }
}
