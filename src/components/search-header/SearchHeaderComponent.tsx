import I18n from "i18n-js";
import { Icon } from "native-base";
import React from "react";
import { Keyboard, TextInput } from "react-native";
import * as Animatable from "react-native-animatable";
import commonColor from "../../theme/variables/commonColor";
import BaseProps from "../../types/BaseProps";
import Constants from "../../utils/Constants";
import computeStyleSheet from "./SearchHeaderComponentStyles";

export interface Props extends BaseProps {
  initialVisibility?: boolean;
  onChange: (search: string) => void,
}

interface State {
  isVisible?: boolean;
}

export default class SearchHeaderComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private searchText: string;
  private searchChanged: boolean;
  private textInput: TextInput;
  private timerCheckSearch: number;
  private animRef: Animatable.View;
  public static defaultProps = {
    initialVisibility: true
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
    this.searchText = "";
    this.searchChanged = false;
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public componentWillUnmount() {
    // Clear the timer
    this.clearSearchTimer();
  }

  public checkSearch() {
    const { onChange } = this.props;
    if (this.searchChanged) {
      // Call the function
      onChange(this.searchText);
      // Disable
      this.searchChanged = false;
      // Clear the timer
      this.clearSearchTimer();
    }
  }

  public searchHasChanged(searchText: string) {
    // Keep it
    this.searchText = searchText;
    this.searchChanged = true;
    // Clear the timer
    this.clearSearchTimer();
    // Launch timer
    this.startSearchTimer();
  }

  public clearSearch() {
    // Check
    if (this.searchText !== "") {
      // Clear
      this.searchText = "";
      this.searchChanged = true;
      this.textInput.clear();
      // Search
      this.checkSearch();
    }
  }

  public startSearchTimer() {
    // Start the timer
    if (!this.timerCheckSearch) {
      // Start
      this.timerCheckSearch = setTimeout(() => {
        // Refresh
        this.checkSearch();
      }, Constants.SEARCH_CHECK_PERIOD_MILLIS);
    }
  }

  public clearSearchTimer() {
    // Clear the timer
    if (this.timerCheckSearch) {
      clearTimeout(this.timerCheckSearch);
      this.timerCheckSearch = null;
    }
  }

  public setVisible(isVisible: boolean) {
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

  public render() {
    const style = computeStyleSheet();
    return (
      <Animatable.View
        ref={(ref: any) => {
          this.animRef = ref;
        }}
        style={style.container}>
        <Icon type="MaterialIcons" name="search" style={style.icon} />
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          selectionColor={commonColor.inverseTextColor}
          style={style.inputField}
          placeholder={I18n.t("general.search")}
          placeholderTextColor={commonColor.placeholderTextColor}
          onChangeText={(searchText) => this.searchHasChanged(searchText)}
        />
        <Icon type="MaterialIcons" name="clear" style={style.icon} onPress={() => this.clearSearch()} />
      </Animatable.View>
    );
  }
}
