import React from "react";
import { Platform, FlatList, RefreshControl } from "react-native";
import { Container, View, Spinner, List } from "native-base";
import ProviderFactory from "../../provider/ProviderFactory";
import ChargerComponent from "../../components/Charger";
import HeaderComponent from "../../components/Header";
import SearchHeaderComponent from "../../components/SearchHeader";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import computeStyleSheet from "./styles";
import I18n from "../../I18n/I18n";
import BaseScreen from "../BaseScreen"

const _provider = ProviderFactory.getProvider();
export default class Chargers extends BaseScreen {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      chargers: [],
      withNoSite: Utils.getParamFromNavigation(this.props.navigation, "withNoSite", true),
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  async componentDidMount() {
    // Call parent
    super.componentDidMount();
    // Get ID
    const siteAreaID = Utils.getParamFromNavigation(this.props.navigation, "siteAreaID", null);
    // Get chargers first time
    const chargers = await this._getChargers(this.searchText, this.state.skip, this.state.limit, siteAreaID);
    // Add chargers
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState((prevState, props) => ({
      chargers: chargers.result,
      count: chargers.count,
      loading: false
    }));
  }

  componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
  }

  _getChargers = async (searchText, skip, limit, siteAreaID) => {
    const { withNoSite } = this.state;
    let chargers = [];
    try {
      // Get Chargers
      if (!withNoSite && siteAreaID) {
        // Get with the Site
        chargers = await _provider.getChargers(
          { Search: searchText, SiteAreaID: siteAreaID }, { skip, limit });
      } else {
        // Get without the Site
        chargers = await _provider.getChargers({ Search: searchText }, { skip, limit });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    return chargers;
  }

  _onEndScroll = async () => {
    const siteAreaID = Utils.getParamFromNavigation(this.props.navigation, "siteAreaID", null);
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit) < count) {
      // No: get next sites
      let chargers = await this._getChargers(this.searchText, skip + Constants.PAGING_SIZE, limit, siteAreaID);
      // Add sites
      this.setState((prevState, props) => ({
        chargers: [...prevState.chargers, ...chargers.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  }

  _refresh = async () => {
    const siteAreaID = Utils.getParamFromNavigation(this.props.navigation, "siteAreaID", null);
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      let chargers = await this._getChargers(this.searchText, 0, (skip + limit), siteAreaID);
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

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { chargers, withNoSite } = this.state;
    let siteID = null;
    // Retrieve the site ID to navigate back from a notification
    if (chargers && chargers.length > 0) {
      // Find the first available Site ID
      for (const charger of chargers) {
        // Site Area provided?
        if (charger.siteArea) {
          // Yes: keep the Site ID
          siteID = charger.siteArea.siteID;
          break;
        }
      }
    }
    return (
      <Container>
        <HeaderComponent title={I18n.t("chargers.title")}
          leftAction={!withNoSite ? () => navigation.navigate("SiteAreas", { siteID: siteID }) : undefined} leftActionIcon={!withNoSite ? "arrow-back" : undefined}
          rightAction={navigation.openDrawer} rightActionIcon={"menu"} />
        <SearchHeaderComponent
          onChange={(searchText) => this._search(searchText)} navigation={navigation}/>
        <View style={style.content}>
          { this.state.loading ?
            <Spinner color="white" style={style.spinner} />
          :
            <FlatList
              data={this.state.chargers}
              renderItem={({item}) =>
                <List>
                  <ChargerComponent charger={item} navigation={navigation} />
                </List>
              }
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
