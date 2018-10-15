import React, { Component } from "react";
import { ImageBackground, TouchableOpacity } from "react-native";
import { NavigationActions, StackActions } from "react-navigation";
import {
  Container,
  Content,
  Text,
  Icon,
  ListItem,
  Thumbnail,
  View
} from "native-base";
import styles from "./style";

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: "Login"})]
});

class SideBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <ImageBackground style={styles.background} source={require("../../../assets/sidebar-transparent.png")}>
          <Content style={styles.drawerContent}>
            <ListItem style={styles.links} button iconLeft onPress={() => navigation.navigate("Sites")}>
              <Icon name="ios-grid-outline" />
              <Text style={styles.linkText}>Sites</Text>
            </ListItem>
            {/* <ListItem
              button
              onPress={() => {
                navigation.navigate("Settings");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-settings-outline" />
              <Text style={styles.linkText}>SETTINGS</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Feedback");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-paper-outline" />
              <Text style={styles.linkText}>FEEDBACK</Text>
            </ListItem> */}
          </Content>
          <View style={styles.logoutContainer}>
            <View style={styles.logoutbtn} foregroundColor={"white"}>
              <View style={styles.gridLogoutContainer}>
                <View style={styles.columnAccount}>
                  <TouchableOpacity style={styles.buttonLogout} onPress={() => navigation.dispatch(resetAction)}>
                    <Text style={styles.logout}>LOG OUT</Text>
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
