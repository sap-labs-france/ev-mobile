import React, { Component } from "react";
import { Text, Image, Platform, FlatList, RefreshControl } from "react-native";
import { Container, Header, Button, Icon, Body, Left, Right, View, Spinner, List } from "native-base";

import ProviderFactory from "../../provider/ProviderFactory";
import ChargerComponent from "../../components/Charger";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import styles from "./styles";

const _provider = ProviderFactory.getProvider();

class Chargers extends Component {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      site: this.props.navigation.state.params.site,
      chargers: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  async componentDidMount() {
    // Get chargers first time
    const chargers = await this._getChargers(this.state.skip, this.state.limit, this.state.site.id);
    // Add listeners
    this.props.navigation.addListener('didFocus', this.componentDidFocus);
    this.props.navigation.addListener('didBlur', this.componentDidBlur);
    // Add chargers
    this.setState((prevState, props) => ({
      chargers: chargers.result,
      count: chargers.count,
      loading: false
    }));
    // Refresh every minutes
    this.refreshTimer = setInterval(() => {
      this._refresh();
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
  }

  componentDidFocus = () => {
    // Force Refresh
    this._refresh();
    // Stop the timer
    if (!this.refreshTimer) {
      // Refresh every minutes
      this.refreshTimer = setInterval(() => {
        this._refresh();
      }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
    }
  }

  componentDidBlur = () => {
    // Stop the timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  componentWillUnmount() {
    // Stop the timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  _getChargers = async (skip, limit, siteID) => {
    let chargers = [];
    try {
      // Get Chargers
      chargers = await _provider.getChargers(
        { SiteID: siteID, WithSiteArea: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    return chargers;
  }

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit) < count) {
      // No: get next sites
      let chargers = await this._getChargers(skip + Constants.PAGING_SIZE, limit, this.state.site.id);
      // Add sites
      this.setState((prevState, props) => ({
        chargers: [...prevState.chargers, ...chargers.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  }

  _refresh = async () => {
    const { skip, limit } = this.state;
    // Refresh All
    let chargers = await this._getChargers(0, (skip + limit), this.state.site.id);
    // Add sites
    this.setState((prevState, props) => ({
      chargers: chargers.result
    }));
  }

  _footerList = () => {
    const { skip, count, limit } = this.state;
    if ((skip + limit) < count) {
      return (
        <Spinner color="white" />
      );
    }
    return null;
  }

  _renderItem = ({item}, navigation) => {
    return (
      <List>
        <ChargerComponent items={item} nav={navigation} siteID={this.state.site.id} />
      </List>
    );
  }

  render() {
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon active name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Text style={styles.titleHeader}>{this.state.site.name}</Text>
          </Body>
          <Right>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
          </Right>
        </Header>

        <View style={styles.content}>
          { this.state.loading ?
            <Spinner color="white" style={styles.spinner} />
          :
            <FlatList
              data={this.state.chargers}
              renderItem={item => this._renderItem(item, this.props.navigation)}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl onRefresh={this._refresh} refreshing={this.state.refreshing} />
              }
              indicatorStyle={"white"}
              onEndReached={this._onEndScroll}
              onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1 }
              ListFooterComponent={this._footerList}
            />
          }
        </View>
      </Container>
    );
  }
}

export default Chargers;
