import React, { Component } from "react";
import {
  Image,
  Platform,
  Dimensions,
  FlatList
} from "react-native";

import {
  Container,
  Header,
  Content,
  Button,
  Icon,
  Body,
  View,
  Spinner,
  List
} from "native-base";

import ProviderFactory from "../../provider/ProviderFactory";
import SiteAreaComponent from "../../components/SiteArea";
import ChargerComponent from "../../components/Charger";
import Utils from "../../utils/Utils";
import styles from "./styles";
import PTRView from "react-native-pull-to-refresh";

class Chargers extends Component {

  constructor(props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      siteID: this.props.navigation.state.params.siteID,
      chargers: []
    };
  }

  componentDidMount() {
    // Get Site Areas
    this.getChargers(this.state.siteID);
  }

  getChargers = async (siteID) => {
    try {
      // Get Chargers NOT IMPLEMENTED WITH MOCK
      let chargers = await ProviderFactory.getProvider().getChargers(
        { SiteID: siteID, WithSiteArea: true });
      // Set result
      this.setState({
        loading: false,
        chargers: chargers.result
      });
      console.log(chargers.result);
    } catch (error) {
      // Stop
      this.setState({
        loading: false
      });
      // Other common Error
      Utils.handleHttpUnexpectedError(error);
    }
  }

  _onRefresh = async () => {
    return await this.getChargers(this.state.siteID);
  }

  _renderItem({item}) {
    return (
      <List>
        <ChargerComponent items={item} />
      </List>
    );
  }

  render() {
    let d = Dimensions.get("window");
    const { height, width } = d;

    return (
      <Container>
        <Header
          style={[
            styles.headerStyle,
            this.state.open ? styles.headerModalStyle : styles.headerStyle
          ]}
        >
          <Body
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: Platform.OS === "ios" && (height === 812 || width === 812) ? 20 : 0
              }}>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon active name="arrow-back" style={styles.headerIcons} />
            </Button>
            <Image source={require("../../../assets/logo-low.gif")} style={styles.imageHeader} />
            <Button transparent>
              <Icon name="options" style={styles.headerIcons} />
            </Button>
          </Body>
        </Header>
        <PTRView onRefresh={this._onRefresh} delay={15} offset={95}>
          <Content
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "black" }}
          >
            {this.state.loading && (
              <Container>
                <Spinner color="white" style={{flex: 1}} />
              </Container>
            )}
            {!this.state.loading && (
              <View>
                <FlatList
                  data={this.state.chargers}
                  renderItem={this._renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
            )}
          </Content>
        </PTRView>
      </Container>
    );
  }
}

export default Chargers;
