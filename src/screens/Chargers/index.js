import React, { Component } from "react";
import {
  Image,
  Platform,
  Dimensions,
  FlatList,
  RefreshControl
} from "react-native";

import {
  Container,
  Header,
  Button,
  Icon,
  Body,
  View,
  Spinner,
  List
} from "native-base";

import ProviderFactory from "../../provider/ProviderFactory";
import ChargerComponent from "../../components/Charger";
import Utils from "../../utils/Utils";
import styles from "./styles";
import * as Animatable from "react-native-animatable";

class Chargers extends Component {

  constructor(props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      refreshing: false,
      siteID: this.props.navigation.state.params.siteID,
      limit: 5,
      skip: 0,
      count: 0,
      scrolling: false,
      chargers: []
    };
  }

  componentDidMount() {
    // Get Site Areas
    this.getChargers(this.state.siteID);
  }

  getChargers = async (siteID) => {
    const { limit, skip } = this.state;
    try {
      // Get Chargers
      let chargers = await ProviderFactory.getProvider().getChargers(
        { SiteID: siteID, WithSiteArea: true }, { limit, skip });
        // Set result
        this.setState({
          loading: false,
          chargers: [...chargers.result],
          count: chargers.count
        });
        console.log("Data stored: ", this.state.chargers);
    } catch (error) {
      // Stop
      this.setState({
        loading: false
      });
      // Other common Error
      Utils.handleHttpUnexpectedError(error);
    }
  }

  _onEndScroll = () => {
    const { siteID, scrolling, skip, count } = this.state;
    if (scrolling && skip <= count) {
      this.setState({skip: this.state.skip + 5}, async () => {
        let data = this.state.chargers;
        await this.getChargers(siteID);
        let newData = data.concat(this.state.chargers);
        this.setState({chargers: newData});
      });
    }
  }

  _onRefresh = () => {
    this.setState({refreshing: true}, () => this.getChargers(this.state.siteID));
    this.setState({refreshing: false});
  }

  footerList = () => {
    const { skip, count, limit } = this.state;
    if (skip <= count && limit <= count) {
      return (
        <Spinner color="white" />
      );
    }
    return null;
  }

  _renderItem({item}) {
    return (
      <List>
        <ChargerComponent items={item} />
      </List>
    );
  }

  render() {
    let d = Dimensions.get("window");
    const { height, width } = d;

    return (
      <Container>
        <Header
          style={[
            styles.headerStyle,
            this.state.open ? styles.headerModalStyle : styles.headerStyle
          ]}
        >
          <Body
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: Platform.OS === "ios" && (height === 812 || width === 812) ? 20 : 0
              }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
            <Button transparent>
              <Icon name="options" style={styles.headerIcons} />
            </Button>
          </Body>
        </Header>

        <View style={{flex: 1}}>
          {this.state.loading && (
            <Container>
              <Spinner color="white" style={{flex: 1}} />
            </Container>
          )}
          {!this.state.loading && (
            <FlatList
              data={this.state.chargers}
              renderItem={this._renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl onRefresh={this._onRefresh} refreshing={this.state.refreshing} />
              }
              indicatorStyle={"white"}
              alwaysBounceVertical
              style={{ backgroundColor: "black"}}
              onEndReached={this._onEndScroll}
              onEndReachedThreshold={0.25}
              ListFooterComponent={this.footerList}
              onScroll={()=>this.setState({scrolling: true})}
              onScrollEndDrag={()=>this.setState({scrolling: false})}
            />
          )}
        </View>
      </Container>
    );
  }
}

export default Chargers;
