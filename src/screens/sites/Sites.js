import React from "react";
import { Platform, FlatList, RefreshControl, BackHandler, Alert } from "react-native";
import { Container, Spinner, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import SiteComponent from "../../components/site/SiteComponent";
import SearchHeaderComponent from "../../components/search-header/SearchHeaderComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import BackgroundComponent from "../../components/background/BackgroundComponent";
import computeStyleSheet from "./SitesStyles";
import I18n from "../../I18n/I18n";
import BaseAutoRefreshScreen from "../base-screen/BaseAutoRefreshScreen";
import ListEmptyTextComponent from "../../components/list/empty-text/ListEmptyTextComponent";
import ListFooterComponent from "../../components/list/footer/ListFooterComponent";

export default class Sites extends BaseAutoRefreshScreen {
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
    await super.componentWillMount();
    // No Site Management: Go to chargers
    const securityProvider = this.centralServerProvider.getSecurityProvider();
    if (securityProvider && !securityProvider.isComponentOrganizationActive()) {
      this.props.navigation.navigate("Chargers");
    }
  }

  async componentDidMount() {
    // Call parent
    await super.componentDidMount();
    // Get the sites
    await this.refresh();
  }

  async componentWillUnmount() {
    // Call parent
    await super.componentWillUnmount();
  }

  _getSites = async (searchText = "", skip, limit) => {
    let sites = [];
    try {
      // Get the Sites
      sites = await this.centralServerProvider.getSites({ Search: searchText, WithAvailableChargers: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(this.centralServerProvider, error, this.props.navigation, this.refresh);
    }
    // Return
    return sites;
  };

  onBack = () => {
    Alert.alert(
      I18n.t("general.exitApp"),
      I18n.t("general.exitAppConfirm"),
      [
        { text: I18n.t("general.no"), style: 'cancel' },
        { text: I18n.t("general.yes"), onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
    return true;
  };

  refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const sites = await this._getSites(this.searchText, 0, skip + limit);
      // Add sites
      this.setState({
        loading: false,
        count: sites.count,
        sites: sites.result
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
      const sites = await this._getSites(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        sites: [...prevState.sites, ...sites.result],
        skip: prevState.skip + Constants.PAGING_SIZE,
        refreshing: false
      }));
    }
  };

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading, skip, count, limit } = this.state;
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
                data={this.state.sites}
                renderItem={({ item }) => <SiteComponent site={item} navigation={this.props.navigation} />}
                keyExtractor={(item) => item.id}
                refreshControl={<RefreshControl onRefresh={this._manualRefresh} refreshing={this.state.refreshing} />}
                onEndReached={this._onEndScroll}
                onEndReachedThreshold={Platform.OS === "android" ? 1 : 0.1}
                ListEmptyComponent={() => <ListEmptyTextComponent text={I18n.t("sites.noSites")}/>}
                ListFooterComponent={() => <ListFooterComponent skip={skip} count={count} limit={limit}/>}
              />
            )}
          </View>
        </BackgroundComponent>
      </Container>
    );
  }
}
