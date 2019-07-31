import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Container, Spinner, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteAreaComponent from "../../components/site-area/SiteAreaComponent";
import SearchHeaderComponent from "../../components/search-header/SearchHeaderComponent";
import HeaderComponent from "../../components/header/HeaderComponent";
import computeStyleSheet from "./SiteAreasStyles";
import I18n from "../../I18n/I18n";
import BaseScreen from "../base-screen/BaseScreen";
import BackgroundComponent from "../../components/background/BackgroundComponent";

const _provider = ProviderFactory.getProvider();

export default class SiteAreas extends BaseScreen {
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
    super.componentDidMount();
    // Get the sites
    const siteAreas = await this._getSiteAreas(this.searchText, this.state.skip, this.state.limit);
    // Add sites
    if (this.isMounted()) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        siteAreas: siteAreas.result,
        count: siteAreas.count,
        loading: false
      });
    }
  }

  componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
  }

  _getSiteAreas = async (searchText, skip, limit) => {
    let siteAreas = [];
    const siteID = Utils.getParamFromNavigation(this.props.navigation, "siteID", null);
    try {
      // Get the Sites
      siteAreas = await _provider.getSiteAreas(
        { Search: searchText, SiteID: siteID, WithAvailableChargers: true },
        { skip, limit }
      );
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return siteAreas;
  };

  _refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const siteAreas = await this._getSiteAreas(this.searchText, 0, skip + limit);
      // Add sites
      this.setState({
        siteAreas: siteAreas.result
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
      const siteAreas = await this._getSiteAreas(
        this.searchText,
        skip + Constants.PAGING_SIZE,
        limit
      );
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
    if (skip + limit < count) {
      return <Spinner color="white" />;
    }
    return null;
  };

  render() {
    const style = computeStyleSheet();
    const { navigation } = this.props;
    const { loading } = this.state;
    return (
      <Container style={style.container}>
        <BackgroundComponent>
          <HeaderComponent
            title={I18n.t("siteAreas.title")}
            showSearchAction={true}
            searchRef={this.searchRef}
            leftAction={() => navigation.navigate("Sites")}
            leftActionIcon={"navigate-before"}
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
              <Spinner color="white" style={style.spinner} />
            ) : (
              <FlatList
                data={this.state.siteAreas}
                renderItem={({ item }) => (
                  <SiteAreaComponent siteArea={item} navigation={this.props.navigation} />
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
