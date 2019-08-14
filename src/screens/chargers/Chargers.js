import React from "react";
import { Platform, FlatList, RefreshControl } from "react-native";
import { Container, View, Spinner, List } from "native-base";
import ChargerComponent from "../../components/charger/ChargerComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import SearchHeaderComponent from "../../components/search-header/SearchHeaderComponent";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import computeStyleSheet from "./ChargersStyles";
import I18n from "../../I18n/I18n";
import BaseAutoRefreshScreen from "../base-screen/BaseAutoRefreshScreen";
import BackgroundComponent from "../../components/background/BackgroundComponent";

export default class Chargers extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    // Init State
    this.state = {
      chargers: [],
      siteAreaID: Utils.getParamFromNavigation(this.props.navigation, "siteAreaID", null),
      loading: true,
      refreshing: false,
      skip: 0,
      limit: Constants.PAGING_SIZE,
      count: 0
    };
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Get Chargers
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  async componentDidFocus() {
    // Call parent
    await super.componentDidFocus();
  }

  _getChargers = async (searchText, skip, limit) => {
    const { siteAreaID } = this.state;
    let chargers = [];
    try {
      // Get Chargers
      if (siteAreaID) {
        // Get with the Site Area
        chargers = await this.centralServerProvider.getChargers({ Search: searchText, SiteAreaID: siteAreaID }, { skip, limit });
      } else {
        // Get without the Site
        chargers = await this.centralServerProvider.getChargers({ Search: searchText }, { skip, limit });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    return chargers;
  };

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit < count) || (count === -1)) {
      // No: get next sites
      const chargers = await this._getChargers(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        chargers: [...prevState.chargers, ...chargers.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  onBack = () => {
    const { siteAreaID } = this.state;
    // Safe way to retrieve the Site ID to navigate back from a notification
    const siteID = this._getSiteIDFromChargers();
    if (siteAreaID) {
      // Back mobile button: Force navigation
      this.props.navigation.navigate("SiteAreas", { siteID });
    }
    // Do not bubble up
    return true;
  };

  refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const chargers = await this._getChargers(this.searchText, 0, skip + limit);
      // Add Chargers
      this.setState((prevState, props) => ({
        loading: false,
        chargers: chargers.result,
        count: chargers.count
      }));
    }
  };

  _manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  _footerList = () => {
    const { skip, count, limit } = this.state;
    if ((skip + limit < count) || (count === -1)) {
      return <Spinner />;
    }
    return null;
  };

  _getSiteIDFromChargers() {
    const { chargers } = this.state;
    // Find the first available Site ID
    if (chargers && chargers.length > 0) {
      for (const charger of chargers) {
        if (charger.siteArea) {
          return charger.siteArea.siteID;
        }
      }
    }
  }

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { siteAreaID, loading } = this.state;
    // Safe way to retrieve the Site ID to navigate back from a notification
    const siteID = this._getSiteIDFromChargers();
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("chargers.title")}
            showSearchAction={true}
            searchRef={this.searchRef}
            leftAction={this.onBack}
            leftActionIcon={siteAreaID ? "navigate-before" : undefined}
            rightAction={navigation.openDrawer}
            rightActionIcon={"menu"}
          />
          <SearchHeaderComponent
            initialVisibility={false}
            ref={(ref) => {
              this.searchRef = ref;
            }}
            onChange={(searchText) => this._search(searchText)}
            navigation={navigation}
          />
          <View style={style.content}>
            {loading ? (
              <Spinner style={style.spinner} />
            ) : (
              <FlatList
                data={this.state.chargers}
                renderItem={({ item }) => <ChargerComponent charger={item} navigation={navigation} siteAreaID={siteAreaID} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this._manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this._onEndScroll}
                onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1}
                ListFooterComponent={this._footerList}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  }
}
