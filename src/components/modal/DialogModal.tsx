import React from 'react';
import Modal from 'react-native-modal';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'native-base';
import I18n from 'i18n-js';
import computeStyleSheet from './DialogModalStyle';
import computeModalCommonStyles from '../modal/ModalCommonStyle';
import { Animation } from 'react-native-animatable';
import { Button } from 'react-native-elements';
import { RootSiblingParent } from 'react-native-root-siblings';


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
  confirm?: (...args: any[]) => void;
  withCancel?: boolean;
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
    const modalCommonStyles = computeModalCommonStyles();
    const buttonsContainerStyle = this.computeButtonsContainerStyle(style);
    const buttonContainerCommonStyle = this.computeButtonContainerCommonStyle(style);
    const iconStyle = style.icon;
    return (
      <Modal
        animationIn={animationIn ?? 'fadeIn'}
        animationOut={animationOut ?? 'fadeOut'}
        animationInTiming={600}
        animationOutTiming={600}
        isVisible
        onBackdropPress={() => (onBackDropPress ? onBackDropPress() : close?.())}
        onBackButtonPress={() => (onBackButtonPressed ? onBackButtonPressed() : close?.())}
      >
        <RootSiblingParent>
          <View style={style.modalContainer}>
            {withCloseButton && (
              <TouchableOpacity onPress={() => close?.()} style={style.closeButtonContainer}>
                <Icon style={style.closeButton} name={'close'} type={'EvilIcons'} />
              </TouchableOpacity>
            )}
            {renderIcon?.(iconStyle)}
            <Text style={[style.text, style.title]}>{title?.toUpperCase()}</Text>
            <Text style={[style.text, style.description]}>{description}</Text>
            <ScrollView contentContainerStyle={style.controlsContent} style={style.controlsContainer} >
              {renderControls?.()}
            </ScrollView>
            <View style={[style.buttonsContainer, buttonsContainerStyle]}>
              {buttons?.filter((b) => b).map((button: DialogModalButton, index) => (
                <Button
                  key={index}
                  title={button.text?.toUpperCase()}
                  containerStyle={buttonContainerCommonStyle}
                  buttonStyle={[modalCommonStyles.primaryButton , button.buttonStyle, style.button]}
                  titleStyle={style.buttonText}
                  onPress={button.action}
                />
              ))}
              {withCancel && (
                <Button
                  title={(cancelButtonText ?? I18n.t('general.cancel')).toUpperCase()}
                  containerStyle={buttonContainerCommonStyle}
                  buttonStyle={[modalCommonStyles.primaryButton, style.cancelButton, style.button]}
                  titleStyle={[style.buttonText, style.cancelButtonText]}
                  onPress={() => close?.()}
                />
              )}
            </View>
          </View>
        </RootSiblingParent>
      </Modal>
    );
  }

  private computeButtonsContainerStyle(style: any) {
    const { buttons, withCancel } = this.props;
    const horizontalLayoutCount = withCancel ? 1 : 2;
    if (buttons?.filter((b) => b).length === horizontalLayoutCount) {
      return style.horizontalButtonsContainer;
    } else if (buttons && buttons?.filter((b) => b).length !== horizontalLayoutCount) {
      return style.verticalButtonsContainer;
    }
  }

  private computeButtonContainerCommonStyle(style: any) {
    const { buttons, withCancel } = this.props;
    const horizontalLayoutCount = withCancel ? 1 : 2;
    if (buttons?.filter((b) => b).length === horizontalLayoutCount) {
      return {...style.buttonContainer, ...style.horizontalButton};
    } else if (buttons && buttons?.filter((b) => b).length !== horizontalLayoutCount) {
      return {...style.buttonContainer, ...style.verticalButton};
    }
  }
}
