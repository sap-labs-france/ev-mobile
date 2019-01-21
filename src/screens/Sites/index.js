import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Image, FlatList, RefreshControl } from "react-native";
import { Container, Header, Spinner, Left, Right, Body, Title, Button, Icon, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteComponent from "../../components/Site";
import I18n from "../../I18n/I18n";
import computeStyleSheet from "./styles";

const _provider = ProviderFactory.getProvider();
class Sites extends ResponsiveComponent {
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
    const sites = await this._getSites(this.state.skip, this.state.limit);
    // Add sites
    this.setState({
      sites: sites.result,
      count: sites.count,
      loading: false
    });
    // Refresh every minutes
    this.timerRefresh = setInterval(() => {
      // Refresh
      this._refresh();
    }, Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS);
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
  }

  componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Stop the timer
    if (this.timerRefresh) {
      clearInterval(this.timerRefresh);
    }
  }

  componentDidFocus = () => {
    // Restart the timer
    if (!this.timerRefresh) {
      // Force Refresh
      this._refresh();
      // Refresh every minutes
      this.timerRefresh = setInterval(() => {
        // Refresh
        this._refresh();
      }, Constants.AUTO_REFRESH_MEDIUM_PERIOD_MILLIS);
    }
  }

  componentDidBlur = () => {
    // Stop the timer
    if (this.timerRefresh) {
      clearInterval(this.timerRefresh);
      this.timerRefresh = null;
    }
  }

  _getSites = async (skip, limit) => {
    let sites = [];
    try {
      // Get the Sites
      sites = await _provider.getSites(
        { WithAvailableChargers: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return sites;
  }

  _refresh = async () => {
    // Component Mounted?
    if (this.mounted) {
      const { skip, limit } = this.state;
      // Refresh All
      let sites = await this._getSites(0, (skip + limit));
      // Add sites
      this.setState({
        sites: sites.result
      });
    }
  }

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit) < count) {
      // No: get next sites
      let sites = await this._getSites(skip + Constants.PAGING_SIZE, limit);
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

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading } = this.state;
    return (
      <Container>
        <Header style={style.header}>
          <Left style={style.leftHeader}>
            <Image source={require("../../../assets/logo-low.gif")} style={style.logoHeader} />
          </Left>
          <Body style={style.bodyHeader}>
            <Title style={style.titleHeader}>{I18n.t("sidebar.sites")}</Title>
          </Body>
          <Right style={style.rightHeader}>
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon active name="menu" style={style.iconHeader} />
            </Button>
          </Right>
        </Header>

        <View style={style.content}>
          {loading ?
            <Spinner color="white" style={style.spinner} />
          :
            <FlatList
              data={this.state.sites}
              renderItem={({item}) =>
                <SiteComponent site={item} navigation={this.props.navigation} />
              }
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
