import I18n from "i18n-js";
import { Button, View } from "native-base";
import React from "react";
import { Text } from "react-native";
import Modal from "react-native-modal";
import computeStyleSheet from "./ComplexSearchComponentStyles";

export interface Props {
  onFilterChanged?: (filters: any, closed: boolean) => void;
  visible?: boolean;
  children?: React.ReactNode;
}

interface State {
  visible?: boolean;
}

export default class ComplexSearchComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private filters: any = {};
  public static defaultProps = {
    visible: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: props.visible ? props.visible : false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setVisible = (visible: boolean) => {
    this.setState({ visible });
  }

  public setFilter = (ID: string, value: string) => {
    this.filters[ID] = value;
    // Trigger notif
    this.onFilterChanged(false);
  }

  public deleteFilter = (ID: string) => {
    delete this.filters[ID];
    // Trigger notif
    this.onFilterChanged(false);
  }

  public getFilter = (ID: string): string => {
    return this.filters[ID];
  }

  public getFilters = (): any => {
    return this.filters;
  }

  public clearFilters = () => {
    this.filters = {};
  }

  public onFilterChanged = (closed: boolean) => {
    const { onFilterChanged } = this.props;
    // Call method
    if (onFilterChanged) {
      onFilterChanged(this.getFilters(), closed);
    }
  }

  public applyFiltersAndNotify = () => {
    // Trigger notif
    this.onFilterChanged(true);
    // Close
    this.setVisible(false);
  }

  public clearFiltersAndNotify = () => {
    // Clear
    this.clearFilters();
    // Trigger notif
    this.onFilterChanged(true);
    // Close
    this.setVisible(false);
  }

  public render = () => {
    const style = computeStyleSheet();
    const { visible } = this.state;
    return (
      <Modal isVisible={visible}>
        <View style={style.contentFilter}>
          {this.props.children}
        </View>
        <View style={style.contentButton}>
          <Button style={style.buttonFilter} full={true} danger={true} onPress={this.clearFiltersAndNotify} >
            <Text style={style.textButtonFilter}>{I18n.t("general.clear")}</Text>
          </Button>
          <Button style={style.buttonFilter} full={true} primary={true} onPress={this.applyFiltersAndNotify} >
            <Text style={style.textButtonFilter}>{I18n.t("general.close")}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}
