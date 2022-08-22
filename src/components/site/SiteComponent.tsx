import { Icon } from 'native-base';
import React from 'react';
import { TouchableOpacity, ViewStyle, Text, View } from 'react-native';

import BaseProps from '../../types/BaseProps';
import Site from '../../types/Site';
import Utils from '../../utils/Utils';
import ConnectorStatusesContainerComponent from '../connector-status/ConnectorStatusesContainerComponent';
import computeStyleSheet from './SiteComponentStyles';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import I18nManager from '../../I18n/I18nManager';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {
  site: Site;
  onNavigate?: () => void;
  containerStyle?: ViewStyle[];
}

interface State {}

export default class SiteComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

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
    const { site, navigation, onNavigate, containerStyle } = this.props;
    const validGPSCoordinates = Utils.containsAddressGPSCoordinates(site.address);
    const listItemCommonStyle = computeListItemCommonStyle();
    return (
      <View style={[listItemCommonStyle.container, style.siteContainer, ...(containerStyle || [])]}>
        <View style={[Utils.getOrganizationConnectorStatusesStyle(site.connectorStats, style), style.statusIndicator]} />
        <TouchableOpacity
          style={style.siteContent}
          onPress={() => {
            if (onNavigate) {
              onNavigate();
            }
            navigation.navigate('SiteAreas', {
              params: {
                site
              },
              key: `${Utils.randomNumber()}`
            });
          }}>
          <View style={style.titleContainer}>
            <View style={style.leftHeader}>
              <TouchableOpacity disabled={!validGPSCoordinates} onPress={() => Utils.jumpToMapWithAddress(site.name, site.address)}>
                {validGPSCoordinates ? (
                  <Icon size={scale(30)} style={style.icon} as={MaterialIcons} name="place" />
                ) : (
                  <Icon size={scale(30)} style={style.icon} as={MaterialCommunityIcons} name="map-marker-off" />
                )}
              </TouchableOpacity>
              <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>
                {site.name}
              </Text>
            </View>
            <Icon size={scale(20)} style={style.arrowIcon} as={MaterialCommunityIcons} name="arrow-right-circle-outline" />
          </View>
          <View style={style.subTitleContainer}>
            <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={2}>
              {Utils.formatAddress(site.address)} {Utils.formatAddress2(site.address)}
            </Text>
            {site.distanceMeters > 0 && <Text style={style.distance}>{I18nManager.formatDistance(site.distanceMeters)}</Text>}
          </View>
          <View style={style.connectorContent}>
            <ConnectorStatusesContainerComponent navigation={navigation} connectorStats={site.connectorStats} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
