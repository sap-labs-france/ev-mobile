import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { ImageBackground, TouchableOpacity, Image } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { Container, Content, Text, Icon, ListItem, Thumbnail, View } from "native-base";
import computeStyleSheet from "./styles";
import ProviderFactory from "../../provider/ProviderFactory";
import I18n from "../../I18n/I18n";
import Utils from "../../utils/Utils";

const _provider = ProviderFactory.getProvider();
const noPhoto = require("../../../assets/no-photo.png");

class SideBar extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      userID: "",
      userImage: ""
    };
  }

  async componentDidMount() {
    // Logoff
    const userInfo = await _provider.getUserInfo();
    // Add sites
    this.setState({
      userName: `${userInfo.name} ${userInfo.firstName}`,
      userID: `${userInfo.id}`
    }, async () => {
      await this._getUserImage();
    });
  }

  async _getUserImage() {
    const { userID } = this.state;
    try {
      const result = await _provider.getUserImage(
        { ID: userID }
      );
      if (result) {
        this.setState({userImage: result.image});
      }
    } catch (error) {
      // Other common Error
      Utils.handleHttpUnexpectedError(error, this.props);
    }
  }

  async _logoff() {
    // Logoff
    await _provider.logoff();
    // Back to login
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: "Login"})]
    }));
  }

  _navigateTo = (screen) => {
    // Navigate
    this.props.navigation.navigate(screen);
    // Close
    this.props.navigation.closeDrawer();
  }

  render() {
    const style = computeStyleSheet();
    const navigation = this.props.navigation;
    const { userName, userImage } = this.state;
    return (
      <Container>
        <ImageBackground style={style.background} source={require("../../../assets/sidebar-transparent.png")}>
          <Content style={style.drawerContent}>
            <View style={style.logoContainer}>
              <Image source={require("../../../assets/logo-low.gif")} style={style.logo} />
              <Text style={style.versionText}>{I18n.t("general.version")}</Text>
              <Text style={style.versionDate}>{I18n.t("general.date")}</Text>
            </View>
            <ListItem style={style.links} button iconLeft onPress={() => this._navigateTo("Sites")}>
              <Icon type="MaterialIcons" name="business" />
              <Text style={style.linkText}>{I18n.t("sidebar.sites")}</Text>
            </ListItem>
            {/* <ListItem button onPress={() => navigation.navigate("Settings")} iconLeft style={style.links}>
              <Icon name="ios-settings-outline" />
              <Text style={style.linkText}>SETTINGS</Text>
            </ListItem> */}
            {/* <ListItem button onPress={() => navigation.navigate("Feedback")} iconLeft style={style.links}>
              <Icon name="ios-paper-outline" />
              <Text style={style.linkText}>FEEDBACK</Text>
            </ListItem> */}
          </Content>
          <View style={style.logoutContainer}>
            <View style={style.logoutButton} foregroundColor={"white"}>
              <View style={style.gridLogoutContainer}>
                <View style={style.columnAccount}>
                  <TouchableOpacity style={style.buttonLogout} onPress={() => this._logoff()}>
                    <Text style={style.logoutText}>{I18n.t("authentication.logOut")}</Text>
                    <Text note style={style.userName}>{userName}</Text>
                  </TouchableOpacity>
                </View>
                <View style={style.columnThumbnail}>
                  <TouchableOpacity style={style.buttonThumbnail} onPress={() => navigation.navigate("Profile")}>
                    <Thumbnail style={style.profilePic} source={(userImage ? {uri: userImage} : noPhoto)} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}

export default SideBar;
