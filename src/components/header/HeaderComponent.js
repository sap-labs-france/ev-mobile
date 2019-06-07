import React from "react";
import { Image, BackHandler } from "react-native";
import {
  Header,
  Left,
  Right,
  Body,
  Title,
  Subtitle,
  Button,
  Icon
} from "native-base";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./HeaderComponentStyles";
import PropTypes from "prop-types";

const logo = require("../../../assets/logo-low.gif");

export default class HeaderComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.searchIsVisible = false;
  }

  componentDidMount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.addEventListener("hardwareBackPress", leftAction);
    }
  }

  componentWillUnmount() {
    const { leftAction } = this.props;
    // Left Action is always Back
    if (leftAction) {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        this.handleBackPress
      );
    }
  }

  render() {
    const style = computeStyleSheet();
    const {
      title,
      subTitle,
      searchRef,
      showSearchAction,
      leftAction,
      leftActionIcon,
      leftActionIconType,
      rightAction,
      rightActionIcon,
      rightActionIconType
    } = this.props;
    return (
      <Header style={style.header}>
        <Left style={style.leftHeader}>
          {leftAction ? (
            <Button transparent onPress={() => leftAction()}>
              <Icon
                type={leftActionIconType}
                name={leftActionIcon}
                style={[style.iconHeader, style.leftIconHeader]}
              />
            </Button>
          ) : (
            <Image source={logo} style={style.logoHeader} />
          )}
        </Left>
        <Body style={style.bodyHeader}>
          <Title
            style={
              subTitle
                ? [style.titleHeader, style.titleHeaderWithSubTitle]
                : style.titleHeader
            }
          >
            {title}
          </Title>
          {subTitle ? (
            <Subtitle style={style.subTitleHeader}>{subTitle}</Subtitle>
          ) : (
            undefined
          )}
        </Body>
        <Right style={style.rightHeader}>
          {showSearchAction ? (
            <Icon
              type={"MaterialIcons"}
              name={"search"}
              onPress={() => {
                // Invert
                this.searchIsVisible = !this.searchIsVisible;
                // Set?
                if (searchRef) {
                  searchRef.setVisible(this.searchIsVisible);
                }
              }}
              style={[style.iconHeader, style.rightIconHeader]}
            />
          ) : (
            undefined
          )}
          {rightAction ? (
            <Icon
              type={rightActionIconType}
              name={rightActionIcon}
              onPress={() => rightAction()}
              style={[style.iconHeader, style.rightIconHeader]}
            />
          ) : (
            <Image source={logo} style={style.logoHeader} />
          )}
        </Right>
      </Header>
    );
  }
}

HeaderComponent.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  leftAction: PropTypes.func,
  leftActionIcon: PropTypes.string,
  leftActionIconType: PropTypes.string,
  rightAction: PropTypes.func,
  rightActionIcon: PropTypes.string,
  rightActionIconType: PropTypes.string,
  showSearchAction: PropTypes.bool,
  searchRef: PropTypes.object
};

HeaderComponent.defaultProps = {
  leftActionIconType: "MaterialIcons",
  rightActionIconType: "MaterialIcons",
  showSearchAction: false
};
