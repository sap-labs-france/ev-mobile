import I18n from 'i18n-js';
import { Icon } from 'native-base';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import { scale } from 'react-native-size-matters';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import computeModalCommonStyle from '../../../modal/ModalCommonStyle';
import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import computeStyleSheet from'./FilterModalContainerComponentStyles';

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
            <View style={style.header}>
              <Text style={style.title}>{I18n.t('general.filters')}</Text>
              <TouchableOpacity onPress={() => this.setState({visible: false})}>
                <Icon size={scale(30)}  name={'close'} as={EvilIcons} style={style.closeIcon}/>
              </TouchableOpacity>
            </View>
            {this.props.children}
            <View style={style.buttonsContainer}>
              <Button
                loading={applyLoading}
                containerStyle={style.buttonContainer}
                buttonStyle={modalCommonStyle.primaryButton}
                title={I18n.t('general.apply')}
                titleStyle={[modalCommonStyle.buttonText]}
                onPress={() => void this.applyFiltersAndNotify()}
              />
              <Button
                loading={clearLoading}
                containerStyle={style.buttonContainer}
                buttonStyle={modalCommonStyle.dangerButton}
                title={I18n.t('general.clear')}
                titleStyle={[modalCommonStyle.buttonText, modalCommonStyle.dangerButtonText]}
                onPress={() => this.clearFilters()}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
