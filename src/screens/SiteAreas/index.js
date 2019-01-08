import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { Image, FlatList, RefreshControl } from "react-native";
import { Container, Header, Spinner, Left, Right, Body, Title, Button, Icon, View } from "native-base";
import Utils from "../../utils/Utils";
import Constants from "../../utils/Constants";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteAreaComponent from "../../components/SiteArea";
import computeStyleSheet from "./styles";

const _provider = ProviderFactory.getProvider();
class SiteAreas extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      siteAreas: [],
      siteImage: null,
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
    // Get the sites
    const siteAreas = await this._getSiteAreas(this.state.skip, this.state.limit);
    // Add sites
    this.setState({
      siteAreas: siteAreas.result,
      count: siteAreas.count,
      loading: false
    });
    // Refresh every minutes
    this.timerRefresh = setInterval(() => {
      // Refresh
      this._refresh();
    }, Constants.AUTO_REFRESH_PERIOD_MILLIS);
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

  _getSiteImage = async () => {
    const { site } = this.props.navigation.state.params;
    try {
      let result = await _provider.getSiteImage(
        { ID: site.id }
      );
      // Found 
      if (result) {
        // Yes
        this.setState({siteImage: result.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  _getSiteAreas = async (skip, limit) => {
    const { site } = this.props.navigation.state.params;
    let siteAreas = [];
    try {
      // Get the Sites
      siteAreas = await _provider.getSiteAreas(
        { SiteID: site.id, WithAvailableChargers: true }, { skip, limit });
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    // Return
    return siteAreas;
  }

  _refresh = async () => {
    // Component Mounted?
    if (this.mounted) {
      const { skip, limit } = this.state;
      // Refresh All
      const siteAreas = await this._getSiteAreas(0, (skip + limit));
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
      const siteAreas = await this._getSiteAreas(skip + Constants.PAGING_SIZE, limit);
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
    const { site } = this.props.navigation.state.params;
    const { loading, siteImage } = this.state;
    return (
      <Container>
        <Header style={style.header}>
        <Left style={style.leftHeader}>
            <Button transparent onPress={() => navigation.goBack()}>
              <Icon active name="arrow-back" style={style.iconHeader} />
            </Button>
          </Left>
          <Body style={style.bodyHeader}>
            <Title style={style.titleHeader}>{site.name}</Title>
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
              data={this.state.siteAreas}
              renderItem={({item}) => 
                <SiteAreaComponent siteArea={item} navigation={this.props.navigation} siteImage={siteImage} />
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

export default SiteAreas;
