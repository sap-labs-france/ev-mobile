import { Card, CardItem, Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import BaseProps from '../../types/BaseProps';
import Site from '../../types/Site';
import Utils from '../../utils/Utils';
import ConnectorStatusesContainerComponent from '../connector-status/ConnectorStatusesContainerComponent';
import computeStyleSheet from './SiteComponentStyles';

export interface Props extends BaseProps {
  site: Site;
  onNavigate?: () => void;
}

interface State {}

export default class SiteComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private counter = 0;

  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const style = computeStyleSheet();
    const { site, navigation, onNavigate } = this.props;
    const validGPSCoordinates = Utils.containsAddressGPSCoordinates(site.address);
    return (
      <Card style={style.container}>
        <CardItem style={[style.siteContent]}>
          <View style={[Utils.getOrganizationConnectorStatusesStyle(site.connectorStats, style), style.statusIndicator]} />
          <TouchableOpacity
            style={style.siteContainer}
            onPress={() => {
              if (onNavigate) {
                onNavigate();
              }
              navigation.navigate('SiteAreas', {
                params: {
                  siteID: site.id
                },
                key: `${Utils.randomNumber()}`
              });
            }}>
            <View style={style.leftContainer}>
              <View style={style.titleContainer}>
                <TouchableOpacity disabled={!validGPSCoordinates} onPress={() => Utils.jumpToMapWithAddress(site.name, site.address)}>
                  {validGPSCoordinates ? (
                    <Icon style={[style.icon, style.iconLeft]} type="MaterialIcons" name="place" />
                  ) : (
                    <Icon style={[style.icon, style.iconLeft]} type="MaterialCommunityIcons" name="map-marker-off" />
                  )}
                </TouchableOpacity>
                <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>
                  {site.name}
                </Text>
              </View>
              <View style={style.subTitleContainer}>
                <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={1}>
                  {Utils.formatAddress(site.address)}
                </Text>
                {site.distanceMeters > 0 && <Text>{Utils.formatDistance(site.distanceMeters)}</Text>}
              </View>
              <View style={style.subTitleContainer}>
                <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={1}>
                  {Utils.formatAddress2(site.address)}
                </Text>
              </View>
              <View style={style.connectorContent}>
                <ConnectorStatusesContainerComponent navigation={navigation} connectorStats={site.connectorStats} />
              </View>
            </View>
            <View style={style.rightContainer}>
              <Icon style={[style.icon, style.arrowIcon]} type="MaterialIcons" name="navigate-next" />
            </View>
          </TouchableOpacity>
        </CardItem>
      </Card>
    );
  }
}
