import moment from "moment";
import { Icon, Text, View} from "native-base";
import PropTypes from "prop-types";
import React from "react";
import { ResponsiveComponent } from "react-native-responsive-ui";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./TransactionHeaderComponentStyles";

export default class TransactionHeaderComponent extends ResponsiveComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
  }

  render() {
    const style = computeStyleSheet();
    const { transaction, isAdmin, displayNavigationIcon } = this.props;
    return (
      <View style={style.container}>
        <View style={style.headerContent}>
          <View style={style.rowContainer}>
            <Text style={style.headerName}>{moment(new Date(transaction.timestamp)).format("LLL")}</Text>
          </View>
          {displayNavigationIcon && <Icon style={style.icon} type="MaterialIcons" name="navigate-next" />}
        </View>
        <View style={style.subHeader}>
          <Text numberOfLines={1} style={[style.subHeaderName, style.subHeaderNameLeft]}>
            {transaction.chargeBoxID} - {Utils.getConnectorLetter(transaction.connectorId)}
          </Text>
          {isAdmin && (
            <Text numberOfLines={1} style={[style.subHeaderName, style.subHeaderNameRight]}>
              {Utils.buildUserName(transaction.user)}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

TransactionHeaderComponent.propTypes = {
  transaction: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  displayNavigationIcon: PropTypes.bool.isRequired
};

TransactionHeaderComponent.defaultProps = {
  displayNavigationIcon: true
};
