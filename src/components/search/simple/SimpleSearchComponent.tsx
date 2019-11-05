import I18n from 'i18n-js';
import { Button, Icon } from 'native-base';
import React from 'react';
import { TextInput, View } from 'react-native';
import commonColor from '../../../theme/variables/commonColor';
import BaseProps from '../../../types/BaseProps';
import computeStyleSheet from './SimpleSearchComponentStyles';

export interface Props extends BaseProps {
  onChange: (search: string) => void,
}

interface State {
}

export default class SimpleSearchComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private textInput: TextInput;
  private currentSearchText: string;
  public static defaultProps = {
    visible: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

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
    return (
      <View style={style.container}>
        <Icon type='MaterialIcons' name='search' style={style.icon} />
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
        <Button disabled={!this.currentSearchText} style={style.iconButton} transparent={true}>
          <Icon type='MaterialIcons' name='clear' style={style.icon} onPress={() => this.clearSearch()} />
        </Button>
      </View>
    );
  }
}
