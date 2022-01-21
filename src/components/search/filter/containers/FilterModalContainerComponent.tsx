import React from 'react';

import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import computeModalCommonStyle from '../../../modal/ModalCommonStyle';
import computeStyleSheet from'./FilterModalContainerComponentStyles';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import I18n from 'i18n-js';
import { Icon } from 'native-base';
import { Button } from 'react-native-elements';

export interface Props extends FilterContainerComponentProps {}

interface State extends FilterContainerComponentState {}

export default class FilterModalContainerComponent extends FilterContainerComponent {
  public state: State;
  public props: Props;
  private filtersActive: boolean = null;

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

  public setFiltersActive(filtersActive: boolean): void {
    this.filtersActive = filtersActive;
  }

  public getFiltersActive(): boolean {
    return this.filtersActive;
  }

  public async notifyFilterChanged() {
    const { onFilterChanged } = this.props;
    // Notify
    onFilterChanged?.(this.getFilters(), false);
  }

  public clearFilters() {
    super.clearFilters();
    this.setFiltersActive(false);
   // this.notifyFilterChanged();
  }

  public applyFiltersAndNotify = async () => {
    const { onFilterChanged } = this.props;
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setVisible(false);
  };

  public async clearFiltersAndNotify(): Promise<void> {
    const { onFilterChanged } = this.props;
    // Clear
    this.clearFilters();
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setVisible(false);
  };

  public render = () => {
    const { visible } = this.state;
    const modalCommonStyle = computeModalCommonStyle();
    const style = computeStyleSheet();
    return (
      <View>
        <Modal
          style={style.modal}
          animationOut={'slideOutDown'}
          animationIn={'slideInUp'}
          animationInTiming={700}
          animationOutTiming={200}
          useNativeDriver={true}
          isVisible={visible}
          onBackButtonPress={() => this.setState({visible: false})}
          onBackdropPress={() => this.setState({visible: false})}
        >
          <View style={style.modalContent}>
            <View style={style.header}>
              <Text style={style.title}>{I18n.t('general.filters')}</Text>
              <Icon onPress={() => this.setState({visible: false})} name={'x'} type={'Feather'} style={style.closeIcon}/>
            </View>
            {this.props.children}
            <View style={style.buttonsContainer}>
              <Button containerStyle={style.buttonContainer} style={modalCommonStyle.primary}
                      onPress={() => this.applyFiltersAndNotify()} title={I18n.t('general.apply')}/>
              <Button containerStyle={style.buttonContainer} style={modalCommonStyle.primary}
                      onPress={() => this.clearFiltersAndNotify()} title={I18n.t('general.clear')}/>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
