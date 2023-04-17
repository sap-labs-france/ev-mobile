import React from 'react';

import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import computeModalCommonStyle from '../../../modal/ModalCommonStyle';
import computeStyleSheet from'./FilterModalContainerComponentStyles';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import I18n from 'i18n-js';
import { Icon } from 'native-base';
import { Button } from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { scale } from 'react-native-size-matters';

export interface Props extends FilterContainerComponentProps {}

interface State extends FilterContainerComponentState {
  applyLoading?: boolean;
  clearLoading?: boolean;
  visible?: boolean;
}

export default class FilterModalContainerComponent extends FilterContainerComponent {
  public state: State;
  public props: Props;

  public constructor(props: Props) {
    super(props);
    this.state = {
      applyLoading: false,
      clearLoading: false,
      visible: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async notifyFilterChanged() {
    const { onFilterChanged } = this.props;
    // Notify
    onFilterChanged?.(this.getFilters(), false);
  }

  public applyFiltersAndNotify = async () => {
    const { onFilterChanged } = this.props;
    this.setState({applyLoading: true});
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setState({visible: false, applyLoading: false});
  };

  public async clearFiltersAndNotify(): Promise<void> {
    const { onFilterChanged } = this.props;
    this.setState({clearLoading: true})
    // Clear
    this.clearFilters();
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setState({clearLoading: false});
  };

  public render = () => {
    const { visible, applyLoading, clearLoading } = this.state;
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
            <SafeAreaView style={style.safeArea}>
              <View style={style.header}>
                <Text style={style.title}>{I18n.t('general.filters')}</Text>
                <TouchableOpacity onPress={() => this.setState({visible: false})}>
                  <Icon size={scale(37)}  name={'close'} as={EvilIcons} style={style.closeIcon}/>
                </TouchableOpacity>
              </View>
              {this.props.children}
              <View style={style.buttonsContainer}>
                <Button
                  loading={applyLoading}
                  containerStyle={style.buttonContainer} style={modalCommonStyle.primary}
                  onPress={() => this.applyFiltersAndNotify()} title={I18n.t('general.apply')}/>
                <Button
                  loading={clearLoading}
                  containerStyle={style.buttonContainer} style={modalCommonStyle.primary}
                  onPress={() => this.clearFilters()} title={I18n.t('general.clear')}/>
              </View>
            </SafeAreaView>
          </View>

        </Modal>
      </View>
    );
  }
}
