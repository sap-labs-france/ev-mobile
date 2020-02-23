import I18n from 'i18n-js';
import { Button, View } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import Modal from 'react-native-modal';
import BaseFilterContainerComponent, { BaseFilterContainerComponentProps } from './BaseFilterContainerComponent';
import computeStyleSheet from './FilterModalContainerComponentStyles';

export interface Props extends BaseFilterContainerComponentProps {
  visible?: boolean;
  children?: React.ReactNode;
}

interface State {
  visible?: boolean;
}

export default class FilterModalContainerComponent extends BaseFilterContainerComponent<Props, State> {
  public state: State;
  public props: Props;
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

  public applyFiltersAndNotify = async () => {
    // Super
    await super.applyFiltersAndNotify();
    // Close
    this.setVisible(false);
  }

  public clearFiltersAndNotify = async () => {
    // Super
    await super.clearFiltersAndNotify();
    // Close
    this.setVisible(false);
  }

  public render = () => {
    const style = computeStyleSheet();
    const { visible } = this.state;
    return (
      <Modal isVisible={visible} onBackdropPress={() => this.setState({ visible: false })}>
        <View style={style.contentFilter}>
          {this.props.children}
        </View>
        <View style={style.contentButton}>
          <Button style={style.buttonFilter} full={true} danger={true} onPress={this.clearFiltersAndNotify} >
            <Text style={style.textButtonFilter}>{I18n.t('general.clear')}</Text>
          </Button>
          <Button style={style.buttonFilter} full={true} primary={true} onPress={this.applyFiltersAndNotify} >
            <Text style={style.textButtonFilter}>{I18n.t('general.close')}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}
