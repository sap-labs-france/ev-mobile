import { Icon, Text, View } from "native-base";
import React from "react";
import I18nManager from "../../../I18n/I18nManager";
import BaseScreen from "../../../screens/base-screen/BaseScreen";
import BaseProps from "../../../types/BaseProps";
import Transaction from "../../../types/Transaction";
import Utils from "../../../utils/Utils";
import computeStyleSheet from "./TransactionHeaderComponentStyles";

export interface Props extends BaseProps {
  transaction: Transaction;
  isAdmin: boolean;
  displayNavigationIcon?: boolean;
  initialVisibility?: boolean;
}

interface State {
}
export default class TransactionHeaderComponent extends BaseScreen<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    props.displayNavigationIcon = true;
    this.state = {
      isVisible: this.props.initialVisibility
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public render() {
    const style = computeStyleSheet();
    const { transaction, isAdmin, displayNavigationIcon } = this.props;
    return (
      <View style={style.container}>
        <View style={style.headerContent}>
          <View style={style.rowContainer}>
            <Text style={style.headerName}>{I18nManager.formatDateTime(transaction.timestamp)}</Text>
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
