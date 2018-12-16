import React, { Component } from "react";
import { Text, Image, FlatList, RefreshControl } from "react-native";
import { Container, Header, Spinner, Left, Right, Body, Button, Icon, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteComponent from "../../components/Site";
import styles from "./styles";
import I18n from "../../I18n/I18n";

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
    // Set
    this.mounted = true;
    // Get the sites
    const sites = await this.getSites(this.state.skip, this.state.limit);
    // Add sites
    this.setState({
      sites: sites.result,
      count: sites.count,
      loading: false
    });
    // Refresh every minutes
    this.refreshTimer = setInterval(() => {
      // Component Mounted?
      if (this.mounted) {
        // Refresh
        this._refresh();
      }
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
  }

  componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Stop the timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }

  componentDidFocus = () => {
    // Force Refresh
    this._refresh();
    // Stop the timer
    if (!this.refreshTimer) {
      // Refresh every minutes
      this.refreshTimer = setInterval(() => {
        // Component Mounted?
        if (this.mounted) {
          // Refresh
          this._refresh();
        }
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

  getSites = async (skip, limit) => {
    let sites = [];
    try {
      // Get the Sites
      sites = await _provider.getSites(
        { WithAvailableChargers: true, WithChargeBoxes: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return sites;
  }

  _refresh = async () => {
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
      <SiteComponent site={item} navigation={this.props.navigation} />
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
            <Text style={styles.titleHeader}>{I18n.t("sidebar.sites")}</Text>
          </Body>
          <Right>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
          </Right>
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
                <RefreshControl onRefresh={this._refresh} refreshing={this.state.refreshing} />
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
