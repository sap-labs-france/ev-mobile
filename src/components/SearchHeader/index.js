import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import computeStyleSheet from "./styles";
import { Button, Icon, Text, Header, Input, Item } from "native-base";
import I18n from "../../I18n/I18n";
import PropTypes from "prop-types";

export default class SearchHeaderComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const style = computeStyleSheet();
    return (
      <Header searchBar rounded>
        <Item style={style.items}>
          <Icon name="ios-search" style={style.icon}/>
          <Input placeholder={I18n.t("general.search")} style={style.text} onChangeText={(text) => this.props.onChange(text)}/>
          <Icon type="MaterialIcons" name="store-mall-directory" style={style.text}/>
        </Item>
        <Button transparent>
          <Text>{I18n.t("general.search")}</Text>
        </Button>
      </Header>
    );
  }
}

SearchHeaderComponent.propTypes = {
  onChange: PropTypes.func.isRequired
};

SearchHeaderComponent.defaultProps = {
};