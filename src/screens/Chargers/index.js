import React from "react";
import { Platform, FlatList, RefreshControl } from "react-native";
import { Container, Button, Icon, Header, Body, Left, Right, View, Spinner, List, Title } from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import ProviderFactory from "../../provider/ProviderFactory";
import ChargerComponent from "../../components/Charger";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import computeStyleSheet from "./styles";

const _provider = ProviderFactory.getProvider();

class Chargers extends ResponsiveComponent {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      site: this.props.navigation.state.params.site,
      siteImage: null,
      chargers: [],
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
    // Get the Site Image
    this._getSiteImage();
    // Get chargers first time
    const chargers = await this._getChargers(this.state.skip, this.state.limit, this.state.site.id);
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
    // Add chargers
    this.setState((prevState, props) => ({
      chargers: chargers.result,
      count: chargers.count,
      loading: false
    }));
    // Refresh every minutes
    this.timerRefresh = setInterval(() => {
      // Refresh
      this._refresh();
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
  }

  componentDidFocus = () => {
    // Stop the timer
    if (!this.timerRefresh) {
      // Force Refresh
      this._refresh();
      // Refresh every minutes
      this.timerRefresh = setInterval(() => {
        // Refresh
        this._refresh();
      }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
    }
  }

  componentDidBlur = () => {
    // Stop the timer
    if (this.timerRefresh) {
      clearInterval(this.timerRefresh);
      this.timerRefresh = null;
    }
  }

  componentWillUnmount() {
    // Clear
    this.mounted = false;
    // Stop the timer
    if (this.timerRefresh) {
      clearInterval(this.timerRefresh);
    }
  }

  _getSiteImage = async () => {
    try {
      let result = await _provider.getSiteImage(
        { ID: this.state.site.id }
      );
      if (result) {
        this.setState({siteImage: result.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
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
    // Component Mounted?
    if (this.mounted) {
      const { skip, limit } = this.state;
      // Refresh All
      let chargers = await this._getChargers(0, (skip + limit), this.state.site.id);
      // Add sites
      this.setState((prevState, props) => ({
        chargers: chargers.result
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

  _renderItem = ({item}, navigation) => {
    return (
      <List>
        <ChargerComponent charger={item} navigation={navigation} siteID={this.state.site.id} siteImage={this.state.siteImage} />
      </List>
    );
  }

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    return (
      <Container>
        <Header style={style.header}>
          <Left style={style.leftHeader}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" style={style.iconHeader} />
            </Button>
          </Left>
          <Body style={style.bodyHeader}>
            <Title style={style.titleHeader}>{this.state.site.name}</Title>
          </Body>
          <Right style={style.rightHeader}>
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon active name="menu" style={style.iconHeader} />
            </Button>
          </Right>
        </Header>
        <View style={style.content}>
          { this.state.loading ?
            <Spinner color="white" style={style.spinner} />
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
