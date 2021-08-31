import React from 'react';
import Modal from 'react-native-modal';
import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'native-base';
import I18n from 'i18n-js';
import computeStyleSheet from './DialogModalStyle';
import { Animation } from 'react-native-animatable';

export interface DialogModalButton {
  text: string;
  action?: () => any;
  buttonStyle?: any;
  buttonTextStyle?: any;
  renderIcon?: () => Icon;
}

export interface Props {
  renderControls?: () => React.ReactElement;
  renderIcon?: (style: any) => React.ReactElement;
  buttons?: DialogModalButton[];
  withCancel?: boolean;
  cancelButtonText?: string;
  title: string;
  description?: string;
  withCloseButton?: boolean;
  close?: () => void;
  animationIn?: Animation;
  animationOut?: Animation;
  onBackButtonPressed?: () => void;
  onBackDropPress?: () => void;
}

export interface DialogCommonProps {
  close: (...args: any[]) => void;
  back?: (...args: any[]) => void;
}

interface State {}

export default class DialogModal extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public constructor(props: Props) {
    super(props);
    this.state = {
      isVisible: true
    };
  }

  public render() {
    const {
      title,
      withCancel,
      buttons,
      description,
      renderIcon,
      withCloseButton,
      close,
      renderControls,
      animationIn,
      animationOut,
      onBackButtonPressed,
      cancelButtonText,
      onBackDropPress
    } = this.props;
    const style = computeStyleSheet();
    const buttonsContainerStyle = this.computeButtonsContainerStyle(style);
    const buttonCommonStyle = this.computeButtonCommonStyle(style);
    const iconStyle = style.icon;
    return (
      <Modal
        animationIn={animationIn ?? 'fadeIn'}
        animationOut={animationOut ?? 'fadeOut'}
        animationInTiming={600}
        animationOutTiming={600}
        isVisible
        onBackdropPress={() => (onBackDropPress ? onBackDropPress() : close?.())}
        onBackButtonPress={() => (onBackButtonPressed ? onBackButtonPressed() : close?.())}>
        <View style={style.modalContainer}>
          {withCloseButton && (
            <TouchableOpacity onPress={() => close?.()} style={style.closeButtonContainer}>
              <Icon style={style.closeButton} name={'close'} type={'MaterialIcons'} />
            </TouchableOpacity>
          )}
          {renderIcon?.(iconStyle)}
          <Text style={[style.text, style.title]}>{title?.toUpperCase()}</Text>
          <Text style={[style.text, style.description]}>{description}</Text>
          {renderControls?.()}
          <View style={[style.buttonsContainer, buttonsContainerStyle]}>
            {buttons?.map((button: DialogModalButton, index) => (
              <TouchableOpacity onPress={button.action} style={[button.buttonStyle, buttonCommonStyle]} key={index}>
                {button.renderIcon?.()}
                <Text style={{ ...style.buttonText, ...button.buttonTextStyle }}>{button.text?.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
            {withCancel && (
              <TouchableOpacity style={[buttonCommonStyle, style.cancelButton]} onPress={() => close?.()}>
                <Text style={[style.buttonText, style.cancelButtonText]}>{(cancelButtonText ?? I18n.t('general.cancel')).toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  private computeButtonsContainerStyle(style: any) {
    const { buttons, withCancel } = this.props;
    const horizontalLayoutCount = withCancel ? 1 : 2;
    if (buttons?.length === horizontalLayoutCount) {
      return style.horizontalButtonsContainer;
    } else if (buttons && buttons.length !== horizontalLayoutCount) {
      return style.verticalButtonsContainer;
    }
  }

  private computeButtonCommonStyle(style: any) {
    const { buttons, withCancel } = this.props;
    const horizontalLayoutCount = withCancel ? 1 : 2;
    if (buttons?.length === horizontalLayoutCount) {
      return { ...style.button, ...style.horizontalButton };
    } else if (buttons && buttons.length !== horizontalLayoutCount) {
      return { ...style.button, ...style.verticalButton };
    }
  }
}
