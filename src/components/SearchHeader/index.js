import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./styles";
import { Button, Icon, Text, Header, Input, Item } from "native-base";
import Constants from "../../utils/Constants";
import I18n from "../../I18n/I18n";
import PropTypes from "prop-types";

export default class SearchHeaderComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
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
      this.textInput._root.clear();
      // Launch timer
      this._startSearchTimer();
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

  render() {
    const style = computeStyleSheet();
    const {  iconSearch, iconSearchType, icon, iconType } = this.props;
    return (
      <Header searchBar rounded style={style.header}>
        <Item style={style.items}>
          <Icon type={iconSearchType} name={iconSearch} style={style.icon}/>
          <Input ref={(ref) => { this.textInput = ref; }} 
            style={style.text}
            placeholder={I18n.t("general.search")}
            onChangeText={(searchText) => this._searchChanged(searchText)}/>
          <Icon type="MaterialIcons" name="clear" style={style.icon} onPress={() => this._clearSearch()}/>
          <Icon type={iconType} name={icon} style={style.icon}/>
        </Item>
        <Button transparent>
          <Text>{I18n.t("general.search")}</Text>
        </Button>
      </Header>
    );
  }
}

SearchHeaderComponent.propTypes = {
  navigation: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  iconSearch: PropTypes.string,
  iconSearchType: PropTypes.string,
  icon: PropTypes.string,
  iconType: PropTypes.string,
};

SearchHeaderComponent.defaultProps = {
  iconSearch: "search",
  iconType: "MaterialIcons",
  iconSearchType: "MaterialIcons",
};