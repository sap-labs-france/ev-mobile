import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';

import BaseProps from '../../types/BaseProps';
import ConnectorStats from '../../types/ConnectorStats';
import Site from '../../types/Site';
import Constants from '../../utils/Constants';
import Utils from '../../utils/Utils';
import ConnectorStatusesContainerComponent from '../connector-status/ConnectorStatusesContainerComponent';
import computeStyleSheet from './SiteComponentStyles';

export interface Props extends BaseProps {
  site: Site;
  onNavigate?: () => void;
}

interface State {
}

export default class SiteComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private counter = 0;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { site, navigation, onNavigate } = this.props;
    const validGPSCoordinates = Utils.containsAddressGPSCoordinates(site.address);
    let connectorStats: ConnectorStats;
    // New backend?
    if (site.connectorStats) {
      // Override
      connectorStats = site.connectorStats;
    } else {
      connectorStats = {
        totalConnectors: site.connectorStats.totalConnectors,
        availableConnectors: site.connectorStats.availableConnectors
      };
    }
    return (
      <Animatable.View
        animation={this.counter++ % 2 === 0 ? 'flipInX' : 'flipInX'}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity onPress={() => {
          if (onNavigate) {
            onNavigate();
          }
          navigation.navigate(
            'SiteAreas',
            {
              params: {
                siteID: site.id
              },
              key: `${Utils.randomNumber()}`
            }
          );
        }}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <View style={style.titleContainer}>
                <TouchableOpacity disabled={!validGPSCoordinates}
                  onPress={() => Utils.jumpToMapWithAddress(site.name, site.address)}>
                  {validGPSCoordinates ?
                    <Icon style={[style.icon, style.iconLeft]} type='MaterialIcons' name='place' />
                    :
                    <Icon style={[style.icon, style.iconLeft]} type='MaterialCommunityIcons' name='map-marker-off' />
                  }
                </TouchableOpacity>
                <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>{site.name}</Text>
              </View>
              <Icon style={style.icon} type='MaterialIcons' name='navigate-next' />
            </View>
            <View style={style.subHeaderContent}>
              <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={1} >
                {Utils.formatAddress(site.address)}
              </Text>
              {(site.distanceMeters > 0) &&
                <Text>{Utils.formatDistance(site.distanceMeters)}</Text>
              }
            </View>
            <View style={style.connectorContent}>
              <ConnectorStatusesContainerComponent navigation={navigation} connectorStats={connectorStats} />
            </View>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}
