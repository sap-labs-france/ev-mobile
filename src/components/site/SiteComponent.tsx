import { Icon, Text, View } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import openMap from "react-native-open-maps";
import ConnectorStats from "types/ConnectorStats";
import Address from "../../types/Address";
import BaseProps from "../../types/BaseProps";
import Site from "../../types/Site";
import Constants from "../../utils/Constants";
import ConnectorStatusesContainerComponent from "../connector-status/ConnectorStatusesContainerComponent";
import computeStyleSheet from "./SiteComponentStyles";

export interface Props extends BaseProps {
  site: Site;
}

interface State {
}

export default class SiteComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private counter: number = 0;

  constructor(props: Props) {
    super(props);
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public siteLocation(address: Address) {
    openMap({
      latitude: address.latitude,
      longitude: address.longitude,
      zoom: 18
    });
  }

  public render() {
    const style = computeStyleSheet();
    const { site, navigation } = this.props;
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
        animation={this.counter++ % 2 === 0 ? "flipInX" : "flipInX"}
        iterationCount={1}
        duration={Constants.ANIMATION_SHOW_HIDE_MILLIS}>
        <TouchableOpacity onPress={() => navigation.navigate("SiteAreas", { siteID: site.id })}>
          <View style={style.container}>
            <View style={style.headerContent}>
              <View style={style.subHeaderContent}>
                <TouchableOpacity onPress={() => this.siteLocation(site.address)}>
                  <Icon style={style.icon} name="pin" />
                </TouchableOpacity>
                <Text style={style.headerName}>{site.name}</Text>
              </View>
              <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />
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
