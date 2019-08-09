import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import { TextInput, Keyboard } from "react-native";
import computeStyleSheet from "./SearchHeaderComponentStyles";
import { Icon } from "native-base";
import Constants from "../../utils/Constants";
import I18n from "../../I18n/I18n";
import PropTypes from "prop-types";
import commonColor from "../../theme/variables/commonColor";
import * as Animatable from "react-native-animatable";

export default class SearchHeaderComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
    this.searchText = "";
    this.searchChanged = false;
  }

  componentWillUnmount() {
    // Clear the timer
    this._clearSearchTimer();
  }

  _checkSearch() {
    const { onChange } = this.props;
    if (this.searchChanged) {
      // Call the function
      onChange(this.searchText);
      // Disable
      this.searchChanged = false;
      // Clear the timer
      this._clearSearchTimer();
    }
  }

  _searchChanged(searchText) {
    // Keep it
    this.searchText = searchText;
    this.searchChanged = true;
    // Clear the timer
    this._clearSearchTimer();
    // Launch timer
    this._startSearchTimer();
  }

  _clearSearch() {
    // Check
    if (this.searchText !== "") {
      // Clear
      this.searchText = "";
      this.searchChanged = true;
      this.textInput.clear();
      // Search
      this._checkSearch();
    }
  }

  _startSearchTimer() {
    // Start the timer
    if (!this.timerCheckSearch) {
      // Start
      this.timerCheckSearch = setTimeout(() => {
        // Refresh
        this._checkSearch();
      }, Constants.SEARCH_CHECK_PERIOD_MILLIS);
    }
  }

  _clearSearchTimer() {
    // Clear the timer
    if (this.timerCheckSearch) {
      clearTimeout(this.timerCheckSearch);
      this.timerCheckSearch = null;
    }
  }

  setVisible(isVisible) {
    const style = computeStyleSheet();
    // Show/Hide
    this.setState({ isVisible });
    // Check
    if (isVisible) {
      this.animRef.transitionTo(style.visible, Constants.ANIMATION_SHOW_HIDE_MILLIS);
      // Set the focus
      setTimeout(() => {
        // Set the focus
        if (this.textInput) {
          this.textInput.focus();
        }
      }, 100);
    } else {
      // Hide
      this.animRef.transitionTo(style.hidden, Constants.ANIMATION_SHOW_HIDE_MILLIS);
      // Hide keyboard
      Keyboard.dismiss();
    }
  }

  render() {
    const style = computeStyleSheet();
    return (
      <Animatable.View
        ref={(ref) => {
          this.animRef = ref;
        }}
        style={style.container}>
        <Icon type={"MaterialIcons"} name={"search"} style={style.icon} />
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          style={style.inputField}
          placeholder={I18n.t("general.search")}
          placeholderTextColor={commonColor.tabBarTextColor}
          onChangeText={(searchText) => this._searchChanged(searchText)}
        />
        <Icon type="MaterialIcons" name="delete" style={style.icon} onPress={() => this._clearSearch()} />
      </Animatable.View>
    );
  }
}

SearchHeaderComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  initialVisibility: PropTypes.bool
};

SearchHeaderComponent.defaultProps = {
  initialVisibility: true
};
