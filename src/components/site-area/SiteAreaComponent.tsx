import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import { TouchableOpacity, ViewStyle, Text, View } from 'react-native';

import BaseProps from '../../types/BaseProps';
import SiteArea from '../../types/SiteArea';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import ConnectorStatusesContainerComponent from '../connector-status/ConnectorStatusesContainerComponent';
import computeStyleSheet from './SiteAreaComponentStyles';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import I18nManager from '../../I18n/I18nManager';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends BaseProps {
  siteArea: SiteArea;
  onNavigate?: () => void;
  containerStyle?: ViewStyle[];
}

interface State {}

export default class SiteAreaComponent extends React.Component<Props, State> {
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
    const { siteArea, navigation, onNavigate, containerStyle } = this.props;
    const validGPSCoordinates = Utils.containsAddressGPSCoordinates(siteArea.address);
    const listItemCommonStyle = computeListItemCommonStyle();
    return (
      <View style={[style.siteAreaContainer, listItemCommonStyle.container, ...(containerStyle || [])]}>
        <View style={[Utils.getOrganizationConnectorStatusesStyle(siteArea.connectorStats, style), style.statusIndicator]} />
        <TouchableOpacity
          style={style.siteAreaContent}
          onPress={() => {
            if (onNavigate) {
              onNavigate();
            }
            if (siteArea.connectorStats?.totalConnectors > 0) {
              navigation.navigate('ChargingStations', {
                params: {
                  siteArea
                },
                key: `${Utils.randomNumber()}`
              });
            } else {
              Message.showError(I18n.t('siteAreas.noChargers'));
            }
          }}>
          <View style={style.titleContainer}>
            <View style={style.leftHeader}>
              <TouchableOpacity
                disabled={!validGPSCoordinates}
                onPress={() => Utils.jumpToMapWithAddress(siteArea.name, siteArea.address)}>
                {validGPSCoordinates ? (
                  <Icon size={scale(30)} style={style.icon} as={MaterialIcons} name="place" />
                ) : (
                  <Icon size={scale(30)} style={style.icon} as={MaterialCommunityIcons} name="map-marker-off" />
                )}
              </TouchableOpacity>
              <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>
                {siteArea.name}
              </Text>
            </View>
            <Icon size={scale(18)} style={style.arrowIcon} as={MaterialCommunityIcons} name="arrow-right-circle-outline" />
          </View>
          <View style={style.subTitleContainer}>
            <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={2}>
              {Utils.formatAddress(siteArea.address)} {Utils.formatAddress2(siteArea.address)}
            </Text>
            {siteArea.distanceMeters > 0 && <Text style={style.distance}>{I18nManager.formatDistance(siteArea.distanceMeters)}</Text>}
          </View>
          <View style={style.connectorContent}>
            <ConnectorStatusesContainerComponent navigation={navigation} connectorStats={siteArea.connectorStats} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
