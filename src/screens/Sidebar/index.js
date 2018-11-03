import React, { Component } from "react";
import { ImageBackground, TouchableOpacity, Image, Dimensions } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import { Container, Content, Text, Icon, ListItem, Thumbnail, View } from "native-base";
import ProviderFactory from "../../provider/ProviderFactory";

import I18n from "../../I18n/I18n";
import styles from "./style";

const deviceHeight = Dimensions.get("window").height;

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  async logoff() {
    // Logoff
    await ProviderFactory.getProvider().logoff();
    // Back to login
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: "Login"})]
    }));
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <ImageBackground style={styles.background} source={require("../../../assets/sidebar-transparent.png")}>
          <Content style={styles.drawerContent}>
            <View style={{borderColor: "#FFFFFF", borderBottomWidth: 1, paddingBottom: 30}}>
              <Image source={require("../../../assets/logo-low.gif")} style={{flex: 1, resizeMode: "contain", height: deviceHeight / 6, alignSelf: "center"}} />
            </View>
            <ListItem style={[styles.links, {marginTop: 30}]} button iconLeft onPress={() => navigation.navigate("Sites")}>
              <Icon name="ios-grid-outline" />
              <Text style={styles.linkText}>{I18n.t("sidebar.sites")}</Text>
            </ListItem>
            {/* <ListItem button onPress={() => navigation.navigate("Settings")} iconLeft style={styles.links}>
              <Icon name="ios-settings-outline" />
              <Text style={styles.linkText}>SETTINGS</Text>
            </ListItem> */}
            {/* <ListItem button onPress={() => navigation.navigate("Feedback")} iconLeft style={styles.links}>
              <Icon name="ios-paper-outline" />
              <Text style={styles.linkText}>FEEDBACK</Text>
            </ListItem> */}
          </Content>
          <View style={styles.logoutContainer}>
            <View style={styles.logoutbtn} foregroundColor={"white"}>
              <View style={styles.gridLogoutContainer}>
                <View style={styles.columnAccount}>
                  <TouchableOpacity style={styles.buttonLogout} onPress={() => this.logoff()}>
                    <Text style={styles.logout}>{I18n.t("authentication.logOut")}</Text>
                    <Text note style={styles.name}>Kumar Sanket</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.columnThumbnail}>
                  <TouchableOpacity style={styles.buttonThumbnail} onPress={() => navigation.navigate("Profile")}>
                    <Thumbnail style={styles.profilePic} source={require("../../../assets/no-photo.png")} />
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
