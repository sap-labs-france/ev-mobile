import React from 'react';
import { Linking } from 'react-native';
import I18n from 'i18n-js';
import { Icon } from 'native-base';
import DialogModal from '../DialogModal';
import Utils from '../../../utils/Utils';
export interface Props {
  close?: () => void;
}

interface State {}

export default class AppUpdateModal extends React.Component<Props, State> {
  public static defaultProps: { isVisible: false };
  public state: State;
  public props: Props;

  public openModal() {
    this.setState({ isVisible: true });
  }

  public render() {
    const commonColor = Utils.getCurrentCommonColor();
    const { close } = this.props;
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
            action: async () => Linking.openURL(''),
            buttonTextStyle: { color: commonColor.light },
            buttonStyle: { backgroundColor: commonColor.primary, borderColor: commonColor.primary }
          }
        ]}
      />
    );
  }
}
