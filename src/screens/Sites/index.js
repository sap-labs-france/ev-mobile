import React, { Component } from "react";
import { Image, FlatList, RefreshControl } from "react-native";
import { Container, Header, Spinner, Left, Right, Body, Button, Icon, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteComponent from "../../components/Site";
import styles from "./styles";

const _provider = ProviderFactory.getProvider();
class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  async componentDidMount() {
    // Get the sites
    const sites = await this.getSites(this.state.skip, this.state.limit);
    // Add sites
    this.setState({
      sites: sites.result,
      count: sites.count,
      loading: false
    });
  }

  getSites = async (skip, limit) => {
    let sites = [];
    try {
      // Get the Sites
      sites = await _provider.getSites(
        { WithAvailableChargers: true, WithChargeBoxes: true }, { skip, limit });
      console.log(sites);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return sites;
  }

  _onRefresh = async () => {
    const { skip, limit } = this.state;
    // Refresh All
    let sites = await this.getSites(0, (skip + limit));
    // Add sites
    this.setState({
      sites: sites.result
    });
  }

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit) < count) {
      // No: get next sites
      let sites = await this.getSites(skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        sites: [...prevState.sites, ...sites.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
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

  _renderItem = ({item}) => {
    return (
      <SiteComponent item={item} navigation={this.props.navigation} />
    );
  };

  render() {
    const navigation = this.props.navigation;
    const { loading } = this.state;
    return (
      <Container>
        <Header style={styles.header}>
          <Left>
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
          </Body>
        </Header>

        <View style={styles.content}>
          {loading ?
            <Spinner color="white" style={styles.spinner} />
          :
            <FlatList
              data={this.state.sites}
              renderItem={this._renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl onRefresh={this._onRefresh} refreshing={this.state.refreshing} />
              }
              onEndReached={this._onEndScroll}
              onEndReachedThreshold={0.5}
              ListFooterComponent={this._footerList}
            />
          }
        </View>
      </Container>
    );
  }
}

export default Sites;
