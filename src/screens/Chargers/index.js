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


class Chargers extends Component {

  constructor(props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      refreshing: false,
      timer: 0,
      siteID: this.props.navigation.state.params.siteID,
      limit: 10,
      skip: 0,
      count: 0,
      newDataStoredFirstTime: false,
      chargers: [],
      newData: []
    };
  }

  componentDidMount() {
    // Get chargers first time
    this.getChargers(this.state.siteID);
    // Refresh every minutes
    this.timer = setInterval(() => {
      this._timerRefresh();
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  getChargers = async (siteID) => {
    const { limit, skip } = this.state;
    try {
      // Get Chargers
      let chargers = await ProviderFactory.getProvider().getChargers(
        { SiteID: siteID, WithSiteArea: true }, { limit, skip });
        // Set result
        this.setState({
          newData: chargers.result,
          count: chargers.count
        }, () => {
          if (!this.state.newDataStoredFirstTime) {
            this.setState({chargers: this.state.newData, newDataStoredFirstTime: true});
          }
        });
        console.log("Data stored: ", this.state.newData);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    this.setState({
      refreshing: false,
      loading: false
    });
  }

  _onEndScroll = () => {
    const { siteID, chargers, count } = this.state;
    if (chargers.length < count) {
      this.setState({skip: this.state.skip + 10}, async () => {
        await this.getChargers(siteID);
        this.setState({chargers: [...this.state.chargers, ...this.state.newData]});
      });
    }
  }

  _timerRefresh = async () => {
    if (this.state.refreshing !== true) {
      if (this.state.limit !== 0 && this.state.skip !== 0) {
        this.setState(
          {
            limit: this.state.skip === 0 ? 10 : 0,
            skip: 0,
            newDataStoredFirstTime: false,
            newData: []
          },
          async () => {
            await this.getChargers(this.state.siteID);
          }
        );
      } else {
        this.setState({
          newDataStoredFirstTime: false,
          newData: []
        }, async () => {
          await this.getChargers(this.state.siteID);
        });
      }
    }
  }

  _onRefresh = async () => {
    if (this.state.limit !== 0 && this.state.skip !== 0) {
      this.setState(
      {
        refreshing: true,
        limit: this.state.skip === 0 ? 10 : 0,
        skip: 0,
        newDataStoredFirstTime: false,
        newData: []
      },
      async () => {
        await this.getChargers(this.state.siteID);
      });
    } else {
      this.setState({
        newDataStoredFirstTime: false,
        newData: []
      }, async () => {
        await this.getChargers(this.state.siteID);
      });
    }
  }

  footerList = () => {
    const { chargers, count } = this.state;
    if (chargers.length < count) {
      return (
        <Spinner color="white" />
      );
    }
    return null;
  }

  _renderItem = ({item}, navigation) => {
    return (
      <List>
        <ChargerComponent items={item} nav={navigation} />
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
              renderItem={item => this._renderItem(item, this.props.navigation)}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl onRefresh={this._onRefresh} refreshing={this.state.refreshing} />
              }
              indicatorStyle={"white"}
              onEndReached={this._onEndScroll}
              onEndReachedThreshold={0.4}
              ListFooterComponent={this.footerList}
            />
          )}
        </View>
      </Container>
    );
  }
}

export default Chargers;
