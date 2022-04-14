import React from 'react';
import I18n from 'i18n-js';
import { BackHandler } from 'react-native';
import DialogModal, { DialogCommonProps } from '../DialogModal';
import computeStyleSheet from '../ModalCommonStyle';

interface State {}

export interface Props extends DialogCommonProps {}

export default class ExitAppDialog extends React.Component<Props, State> {
  public props: Props;
  public state: State;

  public render() {
    const modalCommonStyle = computeStyleSheet();
    return (
      <DialogModal
        title={I18n.t('general.exitApp')}
        description={I18n.t('general.exitAppConfirm')}
        buttons={[
          {
            text: I18n.t('general.yes'),
            action: () => BackHandler.exitApp(),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          },
          {
            text: I18n.t('general.no'),
            action: () => this.props.close?.(),
            buttonStyle: modalCommonStyle.primaryButton,
            buttonTextStyle: modalCommonStyle.primaryButtonText
          }
        ]}
      />
    );
  }
}
