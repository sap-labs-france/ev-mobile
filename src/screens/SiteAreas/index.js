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

import CentralServerProvider from "../../provider/CentralServerProvider";
import SiteAreaComponent from "../../components/SiteArea";
import ChargerComponent from "../../components/Charger";
import Utils from "../../utils/Utils";
import styles from "./styles";

class SiteAreas extends Component {

  constructor(props) {
    super(props);
    // Init State
    this.state = {
      loading: true,
      siteID: "5abeba9e4bae1457eb565e66",
      siteAreas: []
    };
  }

  componentDidMount() {
    const { siteID } = this.state;
    // Get Site Areas
    this.getSitesAreas(siteID);
  }

  getSitesAreas = async (siteID) => {
    try {
      // Get Site Areas
      let siteAreas = await CentralServerProvider.getSiteAreas(siteID);
      // Set result
      this.setState({
        loading: false,
        siteAreas: siteAreas.result
      });
      console.log(siteAreas.result);
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error.request);
    }
  }

  _renderItem({item}) {
    return (
      <List>
        <SiteAreaComponent item={item} />
        <ChargerComponent items={item.chargeBoxes} />
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
                data={this.state.siteAreas}
                renderItem={this._renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

export default SiteAreas;
