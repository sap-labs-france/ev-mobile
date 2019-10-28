import I18n from 'i18n-js';
import { Text, View } from 'native-base';
import React from 'react';
import { Image } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import BaseProps from '../../types/BaseProps';
import BaseScreen from '../base-screen/BaseScreen';
import computeStyleSheet from './AuthStyles';

import logo from '../../../assets/logo-low.png';

export interface Props extends BaseProps {
  tenantName?: string;
}

interface State {
}

export default class AuthHeader extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { tenantName } = this.props;
    return (
      <View style={style.formHeader}>
        <Image style={style.logo} source={logo} />
        <Text style={style.appText}>e-Mobility</Text>
        <Text style={style.appVersionText}>{`${I18n.t('general.version')} ${DeviceInfo.getVersion()}`} (Beta)</Text>
        <Text style={style.appTenantName}>{tenantName}</Text>
      </View>
    );
  }
}
