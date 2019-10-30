import I18n from 'i18n-js';
import React from 'react';
import { Keyboard, TextInput } from 'react-native';
import * as Animatable from 'react-native-animatable';
import commonColor from '../../theme/variables/commonColor';
import BaseProps from '../../types/BaseProps';
import Constants from '../../utils/Constants';
import computeStyleSheet from './SearchHeaderComponentStyles';

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
  private textInput: TextInput;
  private animRef: Animatable.View;
  public static defaultProps = {
    initialVisibility: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: this.props.initialVisibility
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public searchHasChanged(searchText: string) {
    const { onChange } = this.props;
    // Call the function
    onChange(searchText);
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
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          selectionColor={commonColor.inverseTextColor}
          style={style.inputField}
          placeholder={I18n.t('general.search')}
          placeholderTextColor={commonColor.placeholderTextColor}
          onChangeText={(searchText) => this.searchHasChanged(searchText)}
        />
      </Animatable.View>
    );
  }
}
