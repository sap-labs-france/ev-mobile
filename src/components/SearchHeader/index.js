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

  async componentDidMount() {
    // Add listeners
    this.props.navigation.addListener("didFocus", this.componentDidFocus);
    this.props.navigation.addListener("didBlur", this.componentDidBlur);
  }

  componentDidFocus = () => {
  }

  componentDidBlur = () => {
    // Clear the timer
    this._clearSearchTimer();
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
    // Launch it again
    this._startSearchTimer();
  }

  _startSearchTimer() {
    // Start the timer
    this.timerCheckSearch = setTimeout(() => {
      // Refresh
      this._checkSearch();
    }, Constants.SEARCH_CHECK_PERIOD_MILLIS);
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
      <Header searchBar rounded>
        <Item style={style.items}>
          <Icon type={iconSearchType} name={iconSearch} style={style.text}/>
          <Input placeholder={I18n.t("general.search")} style={style.text} onChangeText={(searchText) => this._searchChanged(searchText)}/>
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