import { Text } from 'native-base';
import React from 'react';
import I18n from '../../../I18n/I18n';
import BaseProps from '../../../types/BaseProps';
import computeStyleSheet from './ListEmptyTextComponentStyles';

export interface Props extends BaseProps {
  text?: string;
}

interface State {
}

export default class ListEmptyTextComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const style = computeStyleSheet();
    const { text } = this.props;
    return <Text style={style.noRecordFound}>{text || I18n.t('general.noRecordFound')}</Text>;
  }
}
