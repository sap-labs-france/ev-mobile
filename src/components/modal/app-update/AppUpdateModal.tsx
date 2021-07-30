import React from 'react';
import { Linking } from 'react-native';
import I18n from 'i18n-js';
import { Icon } from 'native-base';
import DialogModal from '../DialogModal';
import Utils from '../../../utils/Utils';
import { CheckVersionResponse } from 'react-native-check-version';

export interface Props {
  close?: () => void;
  appVersion?: CheckVersionResponse;
}

interface State {}

export default class AppUpdateModal extends React.Component<Props, State> {
  public static defaultProps: { isVisible: false };
  public state: State;
  public props: Props;

  public render() {
    const commonColor = Utils.getCurrentCommonColor();
    const { close, appVersion } = this.props;
    return (
      <DialogModal
        close={() => close?.()}
        withCloseButton={true}
        description={I18n.t('appUpdate.appUpdateDialogDescription')}
        renderIcon={(iconStyle) => <Icon style={iconStyle} name={'update'} type={'MaterialIcons'} />}
        withCancel={true}
        title={I18n.t('appUpdate.appUpdateDialogTitle')}
        buttons={[
          {
            text: I18n.t('general.update'),
            action: async () => Linking.openURL(appVersion?.url),
            buttonTextStyle: { color: commonColor.light },
            buttonStyle: { backgroundColor: commonColor.primary, borderColor: commonColor.primary }
          }
        ]}
      />
    );
  }
}
