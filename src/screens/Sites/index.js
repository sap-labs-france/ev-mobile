import React, { Component } from "react";
import { Image, FlatList } from "react-native";
import {
  Container,
  Header,
  Content,
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
import PTRView from "react-native-pull-to-refresh";

class Sites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSites: [],
      loading: true
    };
  }

  componentWillMount() {
    this.setState({
      dataSites: [],
      loading: true
    });
  }

  componentDidMount() {
    // Get the sites
    this.getSites();
  }

  getSites = async () => {
    try {
      // Get the Sites
      let sites = await ProviderFactory.getProvider().getSites(
        { WithAvailableChargers: true, WithChargeBoxes: true });
      // Fill each sites to dataSites array
      this.setState({
        dataSites: sites.result,
        loading: false
      });
      console.log(sites.result);
    } catch (error) {
      // Stop
      this.setState({
        loading: false
      });
      // Other common Error
      Utils.handleHttpUnexpectedError(error);
    }
  }

  _refresh = async () => {
    return await this.getSites();
  }

  _renderItem = ({item}) => {
    return (
      <SiteComponent item={item} navigation={this.props.navigation}  />
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

        <PTRView onRefresh={this._refresh} delay={15} offset={90}>
          <Content showsVerticalScrollIndicator={false} style={{ backgroundColor: "black" }}>
            {loading ?
              <Container>
                <Spinner color="white" style={{flex: 1}} />
              </Container>
            :
              <View>
                <FlatList
                  data={this.state.dataSites}
                  renderItem={this._renderItem}
                  keyExtractor={item => item.id}
                />
              </View>
            }
          </Content>
        </PTRView>
      </Container>
    );
  }
}

export default Sites;
