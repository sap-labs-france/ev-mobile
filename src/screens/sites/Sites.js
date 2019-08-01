import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Container, Spinner, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteComponent from "../../components/site/SiteComponent";
import SearchHeaderComponent from "../../components/search-header/SearchHeaderComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import BackgroundComponent from "../../components/background/BackgroundComponent";
import computeStyleSheet from "./SitesStyles";
import I18n from "../../I18n/I18n";
import BaseScreen from "../base-screen/BaseScreen";

const _provider = ProviderFactory.getProvider();

export default class Sites extends BaseScreen {
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

  async componentWillMount() {
    // Call parent
    super.componentWillMount();
    // Get if Org is active
    const isComponentOrganizationActive = (await _provider.getSecurityProvider()).isComponentOrganizationActive();
    // Check
    if (!isComponentOrganizationActive) {
      // No site management: go to chargers
      this.props.navigation.navigate("Chargers");
    }
  }

  async componentDidMount() {
    // Call parent
    super.componentDidMount();
    // Get the sites
    const sites = await this._getSites(this.searchText, this.state.skip, this.state.limit);
    // Add sites
    if (this.isMounted()) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        sites: sites.result,
        count: sites.count,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
  }

  _getSites = async (searchText = "", skip, limit) => {
    let sites = [];
    try {
      // Get the Sites
      sites = await _provider.getSites(
        { Search: searchText, WithAvailableChargers: true },
        { skip, limit }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return sites;
  };

  _refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const sites = await this._getSites(this.searchText, 0, skip + limit);
      // Add sites
      this.setState({
        sites: sites.result
      });
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

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if (skip + limit < count) {
      // No: get next sites
      const sites = await this._getSites(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        sites: [...prevState.sites, ...sites.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  _footerList = () => {
    const { skip, count, limit } = this.state;
    if (skip + limit < count) {
      return <Spinner/>;
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
            title={I18n.t("sidebar.sites")}
            showSearchAction={true}
            searchRef={this.searchRef}
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
            {loading ? (
              <Spinner style={style.spinner} />
            ) : (
              <FlatList
                data={this.state.sites}
                renderItem={({ item }) => (
                  <SiteComponent site={item} navigation={this.props.navigation} />
                )}
                keyExtractor={item => item.id}
                refreshControl={
                  <RefreshControl
                    onRefresh={this._manualRefresh}
                    refreshing={this.state.refreshing}
                  />
                }
                onEndReached={this._onEndScroll}
                onEndReachedThreshold={0.5}
                ListFooterComponent={this._footerList}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  }
}
