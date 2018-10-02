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
import {Grid, Col} from "react-native-easy-grid";
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
        <ImageBackground
          source={require("../../../assets/sidebar-transparent.png")}
          style={styles.background}
        >
          <Content style={styles.drawerContent}>
            <ListItem
              button
              onPress={() => {
                navigation.navigate("Sites");
              }}
              iconLeft
              style={styles.links}
            >
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
              <Grid>
                <Col>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.dispatch(resetAction);
                    }}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "transparent"
                    }}
                  >
                    <Text style={{fontWeight: "bold", color: "#fff"}}>
                      LOG OUT
                    </Text>
                    <Text note style={{color: "#fff"}}>
                      Kumar Sanket
                    </Text>
                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    style={{alignSelf: "flex-end"}}
                    onPress={() => {
                      navigation.navigate("Profile");
                    }}
                  >
                    <Thumbnail
                      source={require("../../../assets/no-photo.png")}
                      style={styles.profilePic}
                    />
                  </TouchableOpacity>
                </Col>
              </Grid>
            </View>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}

export default SideBar;
