import { Icon, Text, View } from 'native-base';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import I18n from '../../I18n/I18n';
import BaseProps from '../../types/BaseProps';
import SiteArea from '../../types/SiteArea';
import Constants from '../../utils/Constants';
import Message from '../../utils/Message';
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
    let connectorStats;
    // New backend?
    if (siteArea.connectorStats) {
      // Override
      connectorStats = siteArea.connectorStats;
    } else {
      connectorStats = {
        totalConnectors: siteArea.totalConnectors,
        availableConnectors: siteArea.availableConnectors
      };
    }
    return (
      <Animatable.View
        animation={this.counter++ % 2 === 0 ? 'flipInX' : 'flipInX'}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity
          onPress={() => {
            if (siteArea.totalConnectors > 0) {
              navigation.navigate('Chargers', {
                siteAreaID: siteArea.id
              });
            } else {
              Message.showError(I18n.t('siteAreas.noChargers'));
            }
          }}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <Text style={style.headerName}>{siteArea.name}</Text>
              <Icon style={siteArea.totalConnectors > 0 ? style.icon : style.iconHidden} type='MaterialIcons' name='navigate-next' />
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
