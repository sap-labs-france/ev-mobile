import React from "react";
import { Platform, FlatList, RefreshControl } from "react-native";
import { Container, View, Spinner, List } from "native-base";
import ProviderFactory from "../../provider/ProviderFactory";
import ChargerComponent from "../../components/charger/ChargerComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import SearchHeaderComponent from "../../components/search-header/SearchHeaderComponent";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import computeStyleSheet from "./ChargersStyles";
import I18n from "../../I18n/I18n";
import BaseScreen from "../base-screen/BaseScreen";

const _provider = ProviderFactory.getProvider();
export default class Chargers extends BaseScreen {
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
    super.componentDidMount();
    // Get chargers first time
    const chargers = await this._getChargers(
      this.searchText,
      this.state.skip,
      this.state.limit
    );
    // Add chargers
    if (this.isMounted()) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState((prevState, props) => ({
        chargers: chargers.result,
        count: chargers.count,
        loading: false
      }));
    }
  }

  componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
  }

  _getChargers = async (searchText, skip, limit) => {
    const { siteAreaID } = this.state;
    let chargers = [];
    try {
      // Get Chargers
      if (siteAreaID) {
        // Get with the Site Area
        chargers = await _provider.getChargers(
          { Search: searchText, SiteAreaID: siteAreaID },
          { skip, limit }
        );
      } else {
        // Get without the Site
        chargers = await _provider.getChargers({ Search: searchText }, { skip, limit });
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    return chargers;
  };

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count) {
      // No: get next sites
      const chargers = await this._getChargers(
        this.searchText,
        skip + Constants.PAGING_SIZE,
        limit
      );
      // Add sites
      this.setState((prevState, props) => ({
        chargers: [...prevState.chargers, ...chargers.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  _refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const chargers = await this._getChargers(this.searchText, 0, skip + limit);
      // Add sites
      this.setState((prevState, props) => ({
        chargers: chargers.result
      }));
    }
  };

  _manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this._refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };

  _footerList = () => {
    const { skip, count, limit } = this.state;
    if (skip + limit < count) {
      return <Spinner color="white" />;
    }
    return null;
  };

  _getSiteIDFromChargers(chargers) {
    // Find the first available Site ID
    if (chargers && chargers.length > 0) {
      for (const charger of chargers) {
        if (charger.siteArea) {
          return  charger.siteArea.siteID;
        }
      }
    }
  }

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { chargers, siteAreaID } = this.state;
    // Safe way to retrieve the Site ID to navigate back from a notification
    const siteID = this._getSiteIDFromChargers(chargers);
    return (
      <Container>
        <HeaderComponent
          title={I18n.t("chargers.title")}
          showSearchAction={true}
          searchRef={this.searchRef}
          leftAction={siteAreaID ? () => navigation.navigate("SiteAreas", { siteID }) : undefined}
          leftActionIcon={siteAreaID ? "arrow-back" : undefined}
          rightAction={navigation.openDrawer}
          rightActionIcon={"menu"}
        />
        <SearchHeaderComponent
          initialVisibility={false}
          ref={ref => {
            this.searchRef = ref;
          }}
          onChange={searchText => this._search(searchText)}
          navigation={navigation}
        />
        <View style={style.content}>
          {this.state.loading ? (
            <Spinner color="white" style={style.spinner} />
          ) : (
            <FlatList
              data={this.state.chargers}
              renderItem={({ item }) => (
                <List>
                  <ChargerComponent charger={item} navigation={navigation} siteAreaID={siteAreaID} />
                </List>
              )}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  onRefresh={this._manualRefresh}
                  refreshing={this.state.refreshing}
                />
              }
              indicatorStyle={"white"}
              onEndReached={this._onEndScroll}
              onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1}
              ListFooterComponent={this._footerList}
            />
          )}
        </View>
      </Container>
    );
  }
}
