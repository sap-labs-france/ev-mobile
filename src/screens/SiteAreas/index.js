import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Container, Spinner, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteAreaComponent from "../../components/SiteArea";
import SearchHeaderComponent from "../../components/SearchHeader";
import HeaderComponent from "../../components/Header";
import computeStyleSheet from "./styles";
import I18n from "../../I18n/I18n";
import BaseScreen from "../BaseScreen"

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
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      siteAreas: siteAreas.result,
      count: siteAreas.count,
      loading: false
    });
  }

  componentWillUnmount() {
    // Call parent
    super.componentWillUnmount();
  }

  _getSiteAreas = async (searchText, skip, limit) => {
    const siteID = Utils.getParamFromNavigation(this.props.navigation, "siteID", null);
    let siteAreas = [];
    try {
      // Get the Sites
      siteAreas = await _provider.getSiteAreas(
        { Search: searchText, SiteID: siteID, WithAvailableChargers: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return siteAreas;
  }

  _refresh = async () => {
    // Component Mounted?
    if (this.isMounted()) {
      const { skip, limit } = this.state;
      // Refresh All
      const siteAreas = await this._getSiteAreas(this.searchText, 0, (skip + limit));
      // Add sites
      this.setState({
        siteAreas: siteAreas.result
      });
    }
  }

  _onEndScroll = async () => {
    const { count, skip, limit } = this.state;
    // No reached the end?
    if ((skip + limit) < count) {
      // No: get next sites
      const siteAreas = await this._getSiteAreas(this.searchText, skip + Constants.PAGING_SIZE, limit);
      // Add sites
      this.setState((prevState, props) => ({
        siteAreas: [...prevState.siteAreas, ...siteAreas.result],
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
        <HeaderComponent title={I18n.t("siteAreas.title")}
          leftAction={() => navigation.navigate("Sites")} leftActionIcon={"arrow-back" }
          rightAction={navigation.openDrawer} rightActionIcon={"menu"} />
        <SearchHeaderComponent
          onChange={(searchText) => this._search(searchText)} navigation={navigation} icon={"view-week"}/>
        <View style={style.content}>
          {loading ?
            <Spinner color="white" style={style.spinner} />
          :
            <FlatList
              data={this.state.siteAreas}
              renderItem={({item}) => 
                <SiteAreaComponent siteArea={item} navigation={this.props.navigation} />
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