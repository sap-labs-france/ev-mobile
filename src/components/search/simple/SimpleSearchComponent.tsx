import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';

import BaseProps from '../../../types/BaseProps';
import Utils from '../../../utils/Utils';
import computeStyleSheet from './SimpleSearchComponentStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { scale } from 'react-native-size-matters';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DEBOUNCE_TIME_MILLIS = 400;

export interface Props extends BaseProps {
  onChange: (search: string) => void;
  containerStyle?: ViewStyle;
  searchText?: string;
}

interface State {
  searchText: string;
}

export default class SimpleSearchComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private textInput: TextInput;
  private timer: NodeJS.Timer;

  public constructor(props: Props) {
    super(props);
    this.state = {
      searchText: this.props.searchText
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public onSearchInputChange(searchText: string, timeout: number = 0) {
    const { onChange } = this.props;
    // Debounce search queries with a timeout to avoid making API calls for every input change.
    this.setState({searchText}, () => {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => onChange(searchText.trim()), timeout);
    });
  }

  public clearSearch() {
    this.textInput.clear();
    this.onSearchInputChange('');
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
    const { searchText } = this.props;
    // If prop has changed and component is not aware, use prop for search input
    if ((searchText !== prevProps.searchText) && (searchText !== this.state.searchText)) {
      this.setState({searchText}, () => this.props.onChange(searchText));
    }
  }

  public render() {
    const style = computeStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const { containerStyle } = this.props;
    const { searchText } = this.state;
    return (
      <View style={[style.container, containerStyle]}>
        <Icon marginX={scale(5)} size={scale((22))} as={MaterialIcons} name="search" style={style.icon} />
        <TextInput
          ref={(ref) => {
            this.textInput = ref;
          }}
          style={style.inputField}
          autoCorrect={false}
          value={this.state.searchText}
          placeholder={I18n.t('general.search')}
          placeholderTextColor={commonColor.placeholderTextColor}
          keyboardType={'default'}
          returnKeyType={'search'}
          onSubmitEditing={(event) => this.onSearchInputChange(event?.nativeEvent?.text)}
          onChangeText={(newSearchText) => this.onSearchInputChange(newSearchText, DEBOUNCE_TIME_MILLIS)}
        />
        {searchText && (
          <TouchableOpacity onPress={() => this.clearSearch()}>
            <Icon marginX={scale(5)} size={scale(20)} as={MaterialCommunityIcons} name="close-circle" style={[style.icon, style.clearIcon]} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
