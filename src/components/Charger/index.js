import React, { Component } from "react";
import { FlatList } from "react-native";
import { Text, View, ListItem, Icon } from "native-base";

import * as Animatable from "react-native-animatable";

import ProviderFactory from "../../provider/ProviderFactory";
import ConnectorComponent from "../Connector";
import Utils from "../../utils/Utils";
import styles from "./styles";

const _provider = ProviderFactory.getProvider();

class ChargerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      charger: this.props.items,
      navigation: this.props.nav,
      siteImage: this.props.sitePicture
    };
  }

  _renderItem = ({item, index}) => {
    let alpha = String.fromCharCode(65 + index);
    const { navigation, charger, siteImage } = this.state;
    return (
      <ConnectorComponent alpha={alpha} index={index} item={item} nav={navigation} charger={charger} sitePicture={siteImage} />
    );
  }

  render() {
    const { charger } = this.state;
    return (
      <View style={styles.container}>
        <ListItem style={styles.listDividerContainer} itemDivider>
          <Text style={styles.chargerName}>{charger.id} {/*| <Text style={styles.siteAreaName}>{charger.siteArea.name}</Text>*/}</Text>
          <Animatable.Text animation="pulse" easing="ease-in" iterationCount="infinite">
            <Icon style={styles.heartbeatIcon} type="FontAwesome" name="heartbeat" />
          </Animatable.Text>
        </ListItem>
        <FlatList style={styles.listContainer}
          data={charger.connectors}
          renderItem={item => this._renderItem(item)}
          keyExtractor={(connector, index) => connector.connectorId.toString()}
        />
      </View>
    );
  }
}

export default ChargerComponent;
