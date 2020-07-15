import I18n from 'i18n-js';
import { Button, Text, View } from 'native-base';
import React from 'react';
import Modal from 'react-native-modal';
import computeStyleSheet from '../../../../ModalStyles';
import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';

export interface Props extends FilterContainerComponentProps {
}

interface State extends FilterContainerComponentState {
}

export default class FilterModalContainerComponent extends FilterContainerComponent {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
    this.state = {
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
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
      <Modal style={style.modalContainer} isVisible={visible} onBackdropPress={() => this.setState({ visible: false })}>
        <View style={style.modalContentContainer}>
          {this.props.children}
        </View>
        <View style={style.modalButtonsContainer}>
          <Button style={style.modalButton} full={true} light={true} onPress={this.applyFiltersAndNotify} >
            <Text style={style.modalTextButton}>{I18n.t('general.apply')}</Text>
          </Button>
          <Button style={style.modalButton} full={true} danger={true} onPress={this.clearFiltersAndNotify} >
            <Text style={style.modalTextButton}>{I18n.t('general.clear')}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}
