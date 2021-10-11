import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import { TextInput, View } from 'react-native';

import computeFormStyleSheet from '../../../FormStyles';
import BaseProps from '../../../types/BaseProps';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './SimpleSearchComponentStyles';

export interface Props extends BaseProps {
  onChange: (search: string) => void;
}

interface State {}

export default class SimpleSearchComponent extends React.Component<Props, State> {
  public static defaultProps = {
    visible: false
  };
  public state: State;
  public props: Props;
  private textInput: TextInput;
  private currentSearchText: string;

  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public searchHasChanged(searchText: string) {
    this.currentSearchText = searchText;
    const { onChange } = this.props;
    // Call the function
    onChange(searchText);
  }

  public clearSearch() {
    this.textInput.clear();
    this.searchHasChanged('');
  }

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    return (
      <View style={style.container}>
        <Icon type="MaterialIcons" name="search" style={style.icon} />
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          selectionColor={commonColor.textColor}
          style={style.inputField}
          autoCorrect={false}
          placeholder={I18n.t('general.search')}
          placeholderTextColor={commonColor.placeholderTextColor}
          onChangeText={(searchText) => this.searchHasChanged(searchText)}
        />
        <Icon type="MaterialIcons" name="clear" style={style.icon} onPress={() => this.clearSearch()} />
      </View>
    );
  }
}
