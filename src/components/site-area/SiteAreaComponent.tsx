import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import BaseProps from '../../types/BaseProps';
import SiteArea from '../../types/SiteArea';
import Constants from '../../utils/Constants';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import ConnectorStatusesContainerComponent from '../connector-status/ConnectorStatusesContainerComponent';
import computeStyleSheet from './SiteAreaComponentStyles';

export interface Props extends BaseProps {
  siteArea: SiteArea;
}

interface State {
}

export default class SiteAreaComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private counter: number = 0;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { siteArea, navigation } = this.props;
    const validGPSCoordinates = Utils.containsAddressGPSCoordinates(siteArea.address);
    // New backend?
    return (
      <Animatable.View
        animation={this.counter++ % 2 === 0 ? 'flipInX' : 'flipInX'}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            if (siteArea.connectorStats.totalConnectors > 0) {
              navigation.navigate({
                routeName: 'ChargingStations',
                params: {
                siteAreaID: siteArea.id
                },
                key: `${Utils.randomNumber()}`
              });
            } else {
              Message.showError(I18n.t('siteAreas.noChargers'));
            }
          }}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <View style={style.titleContainer}>
                <TouchableOpacity disabled={!validGPSCoordinates}
                    onPress={() => Utils.jumpToMapWithAddress(siteArea.name, siteArea.address)}>
                  { validGPSCoordinates ?
                    <Icon style={[style.icon, style.iconLeft]} type='MaterialIcons' name='place' />
                  :
                    <Icon style={[style.icon, style.iconLeft]} type='MaterialCommunityIcons' name='map-marker-off' />
                  }
                </TouchableOpacity>
                <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>{siteArea.name}</Text>
              </View>
              <Icon style={siteArea.connectorStats.totalConnectors > 0 ? style.icon : style.iconHidden} type='MaterialIcons' name='navigate-next' />
            </View>
            <View style={style.subHeaderContent}>
              <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={1} >
                {Utils.formatAddress(siteArea.address)}
              </Text>
              {(siteArea.distanceMeters > 0) &&
                <Text>{Utils.formatDistance(siteArea.distanceMeters)}</Text>
              }
            </View>
            <View style={style.connectorContent}>
              <ConnectorStatusesContainerComponent navigation={navigation} connectorStats={siteArea.connectorStats} />
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
