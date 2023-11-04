import React from 'react';
import { Linking } from 'react-native';
import I18n from 'i18n-js';
import DialogModal, { DialogCommonProps } from '../DialogModal';
import { CheckVersionResponse } from 'react-native-check-version';
import computeStyleSheet from '../ModalCommonStyle';
import { scale } from 'react-native-size-matters';
import {Icon} from 'react-native-elements';

export interface Props extends DialogCommonProps {
  appVersion?: CheckVersionResponse;
}

interface State {}

export default class AppUpdateDialog extends React.Component<Props, State> {
  public static defaultProps: { isVisible: false };
  public state: State;
  public props: Props;

  public render() {
    const modalCommonStyle = computeStyleSheet();
    const { close, appVersion } = this.props;
    return (
      <DialogModal
        close={() => close?.()}
        withCloseButton={true}
        description={I18n.t('appUpdate.appUpdateDialogDescription')}
        renderIcon={(iconStyle) => <Icon size={scale(iconStyle.fontSize)} iconStyle={iconStyle} name={'update'} type={'material'} />}
        withCancel={true}
        title={I18n.t('appUpdate.appUpdateDialogTitle')}
        buttons={[
          {
            text: I18n.t('general.update'),
            action: async () => Linking.openURL(appVersion?.url),
            buttonTextStyle: modalCommonStyle.primaryButtonText,
            buttonStyle: modalCommonStyle.primaryButton
          }
        ]}
      />
    );
  }
}
