import I18n from 'i18n-js';
import { Button, View } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import Modal from 'react-native-modal';
import FilterContainerComponent, { FilterContainerComponentProps } from './FilterContainerComponent';
import computeStyleSheet from './FilterContainerComponentStyles';

export interface Props extends FilterContainerComponentProps {
  visible?: boolean;
}

interface State {
  visible?: boolean;
}

export default class FilterModalContainerComponent extends FilterContainerComponent {
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

  public async notifyFilterChanged() {
    const { onFilterChanged } = this.props;
    // Notify
    onFilterChanged(this.getFilters(), false);
  }

  public applyFiltersAndNotify = async () => {
    const { onFilterChanged } = this.props;
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setVisible(false);
  }

  public clearFiltersAndNotify = async () => {
    const { onFilterChanged } = this.props;
    // Clear
    this.clearFilters();
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setVisible(false);
  }

  public render = () => {
    const style = computeStyleSheet();
    const { visible } = this.state;
    return (
      <Modal isVisible={visible} onBackdropPress={() => this.setState({ visible: false })}>
        <View style={style.contentModalFilter}>
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
