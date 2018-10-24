import React, { Component } from "react";
import { Image, FlatList, RefreshControl } from "react-native";
import {
  Container,
  Header,
  Spinner,
  Left,
  Right,
  Body,
  Button,
  Icon,
  View
} from "native-base";
import Utils from "../../utils/Utils";
import ProviderFactory from "../../provider/ProviderFactory";
import SiteComponent from "../../components/Site";
import styles from "./styles";

class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: [],
      newData: [],
      keepDataToRefresh: [],
      newDataStoredFirstTime: false,
      loading: true,
      refreshing: false,
      skip: 0,
      limit: 10,
      count: 0,
    };
  }

  componentWillMount() {
    this.setState({
      sites: [],
      loading: true,
      refreshing: false
    });
  }

  componentDidMount() {
    // Get the sites
    this.getSites();
  }

  getSites = async () => {
    const { limit, skip } = this.state;
    try {
      // Get the Sites
      let sites = await ProviderFactory.getProvider().getSites(
        { WithAvailableChargers: true, WithChargeBoxes: true }, { limit, skip });
      // Fill each sites to sites[]
      this.setState({
        newData: sites.result,
        count: sites.count
      }, () => {
        if (!this.state.newDataStoredFirstTime) {
          this.setState({sites: this.state.newData, newDataStoredFirstTime: true, keepDataToRefresh: this.state.newData});
        }
      });
      console.log(this.state.sites);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
    this.setState({
      refreshing: false,
      loading: false
    });
  }

  _onRefresh = async () => {
    this.setState({refreshing: true}, async () => await this.getSites());
  }

  _onEndScroll = () => {
    const { sites, count } = this.state;
    if (sites.length < count) {
      this.setState({skip: this.state.skip + 10}, async () => {
        await this.getSites();
        this.setState({sites: [...this.state.sites, ...this.state.newData]});
      });
    }
  }

  footerList = () => {
    const { sites, count } = this.state;
    if (sites.length < count) {
      return (
        <Spinner color="white" />
      );
    }
    return null;
  }

  _renderItem = ({item}) => {
    return (
      <SiteComponent item={item} navigation={this.props.navigation} />
    );
  };

  render() {
    const navigation = this.props.navigation;
    const { loading } = this.state;
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => navigation.openDrawer()}>
              <Icon active name="menu" />
            </Button>
          </Left>
          <Body>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
          </Body>
          <Right>
            <Button transparent>
              <Icon active name="options" />
            </Button>
          </Right>
        </Header>

        <View style={{flex: 1}}>
          {loading ?
            <Spinner color="white" style={{flex: 1}} />
          :
            <FlatList
              data={this.state.sites}
              renderItem={this._renderItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl onRefresh={this._onRefresh} refreshing={this.state.refreshing} />
              }
              onEndReached={this._onEndScroll}
              onEndReachedThreshold={0.5}
              ListFooterComponent={this.footerList}
            />
          }
        </View>
      </Container>
    );
  }
}

export default Sites;
