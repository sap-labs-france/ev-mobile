import I18n from 'i18n-js';
import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

import BaseProps from '../../types/BaseProps';
import SiteArea from '../../types/SiteArea';
import Message from '../../utils/Message';
import Utils from '../../utils/Utils';
import ConnectorStatusesContainerComponent from '../connector-status/ConnectorStatusesContainerComponent';
import computeStyleSheet from './SiteAreaComponentStyles';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';

export interface Props extends BaseProps {
  siteArea: SiteArea;
  onNavigate?: () => void;
  containerStyle?: ViewStyle[]
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
          <View style={style.leftContainer}>
            <View style={style.titleContainer}>
              <TouchableOpacity
                disabled={!validGPSCoordinates}
                onPress={() => Utils.jumpToMapWithAddress(siteArea.name, siteArea.address)}>
                {validGPSCoordinates ? (
                  <Icon style={[style.icon, style.iconLeft]} type="MaterialIcons" name="place" />
                ) : (
                  <Icon style={[style.icon, style.iconLeft]} type="MaterialCommunityIcons" name="map-marker-off" />
                )}
              </TouchableOpacity>
              <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.headerName}>
                {siteArea.name}
              </Text>
            </View>
            <View style={style.subTitleContainer}>
              <Text style={style.address} ellipsizeMode={'tail'} numberOfLines={2}>
                {Utils.formatAddress(siteArea.address)} {Utils.formatAddress2(siteArea.address)}
              </Text>
              {siteArea.distanceMeters > 0 && <Text style={style.distance}>{Utils.formatDistance(siteArea.distanceMeters)}</Text>}
            </View>
            <View style={style.connectorContent}>
              <ConnectorStatusesContainerComponent navigation={navigation} connectorStats={siteArea.connectorStats} />
            </View>
          </View>
          <View style={style.rightContainer}>
            <Icon
              style={siteArea.connectorStats?.totalConnectors > 0 ? [style.icon, style.arrowIcon] : style.iconHidden}
              type="MaterialIcons"
              name="navigate-next"
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
