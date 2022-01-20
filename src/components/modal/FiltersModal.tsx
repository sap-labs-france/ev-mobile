import React from 'react';
import Modal from 'react-native-modal';
import computeStyleSheet from './FiltersModalStyles';
import computeModalStyles from './ModalCommonStyle';
import { Text, View } from 'react-native';
import { Icon } from 'native-base';
import { Button } from 'react-native-elements';
import I18n from 'i18n-js';

interface State {}

export interface Props {
  close?: () => void;
  clear?: () => void;
  apply?: () => void;
}


export default class FiltersModal extends React.Component<Props, State> {

  public render() {
    const { close, clear, apply } = this.props;
    const style = computeStyleSheet();
    const modalCommonStyle = computeModalStyles();
    return (
      <Modal
        style={style.modal}
        animationOut={'slideOutDown'}
        animationIn={'slideInUp'}
        animationInTiming={1000}
        animationOutTiming={2000}
        useNativeDriver={true}
        isVisible
        onBackButtonPress={() => close?.()}
        onBackdropPress={() => close?.()}
        >
        <View style={style.modalContent}>
          <View style={style.header}>
            <Text style={style.title}>{I18n.t('general.filters')}</Text>
            <Icon onPress={() => close?.()} name={'x'} type={'Feather'} style={style.closeIcon} />
          </View>
          {this.props.children}
          <View style={style.buttonsContainer}>
            <Button containerStyle={style.buttonContainer} style={modalCommonStyle.primary} onPress={() => apply?.()} title={I18n.t('general.apply')}/>
            <Button containerStyle={style.buttonContainer} style={modalCommonStyle.primary} onPress={() => clear?.()} title={I18n.t('general.clear')}/>
          </View>
        </View>

      </Modal>
    );
  }
}
