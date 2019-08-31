import React from "react";
import { Platform, FlatList, RefreshControl } from "react-native";
import { Container, Spinner, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import SiteAreaComponent from "../../components/site-area/SiteAreaComponent";
import SearchHeaderComponent from "../../components/search-header/SearchHeaderComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import computeStyleSheet from "./SiteAreasStyles";
import I18n from "../../I18n/I18n";
import BaseAutoRefreshScreen from "../base-screen/BaseAutoRefreshScreen";
import BackgroundComponent from "../../components/background/BackgroundComponent";
import ListEmptyTextComponent from "../../components/list-empty-text/ListEmptyTextComponent";
import PropTypes from "prop-types";

export default class SiteAreas extends BaseAutoRefreshScreen {
  constructor(props) {
    super(props);
    this.state = {
      siteAreas: [],
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
    // Get the Site Areas
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  _getSiteAreas = async (searchText, skip, limit) => {
    let siteAreas = [];
    const siteID = Utils.getParamFromNavigation(this.props.navigation, "siteID", null);
    try {
      // Get the Site Areas
      siteAreas = await this.centralServerProvider.getSiteAreas(
        { Search: searchText, SiteID: siteID, WithAvailableChargers: true },
        { skip, limit }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return siteAreas;
  };

  onBack = () => {
    // Back mobile button: Force navigation
    this.props.navigation.goBack();
    // Do not bubble up
    return true;
  };

  refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const siteAreas = await this._getSiteAreas(this.searchText, 0, skip + limit);
      // Set Site Areas
      this.setState({
        loading: false,
        siteAreas: siteAreas.result,
        count: siteAreas.count
      });
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

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit < count) || (count === -1)) {
      // No: get next sites
      const siteAreas = await this._getSiteAreas(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        siteAreas: [...prevState.siteAreas, ...siteAreas.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  _footerList = () => {
    const { skip, count, limit } = this.state;
    if ((skip + limit < count) || (count === -1)) {
      return <Spinner />;
    }
    return null;
  };

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent active={false}>
          <HeaderComponent
            title={I18n.t("siteAreas.title")}
            showSearchAction={true}
            searchRef={this.searchRef}
            leftAction={this.onBack}
            leftActionIcon={"navigate-before"}
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
                data={this.state.siteAreas}
                renderItem={({ item }) => <SiteAreaComponent siteArea={item} navigation={this.props.navigation} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this._manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this._onEndScroll}
                onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1}
                ListFooterComponent={this._footerList}
                ListEmptyComponent={() => <ListEmptyTextComponent/>}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  }
}
