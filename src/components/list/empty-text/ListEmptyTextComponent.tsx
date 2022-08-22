import I18n from 'i18n-js';
import React from 'react';

import BaseProps from '../../../types/BaseProps';
import computeStyleSheet from './ListEmptyTextComponentStyles';
import { Text } from 'react-native';

export interface Props extends BaseProps {
  text?: string;
}

interface State {}

export default class ListEmptyTextComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;

  // eslint-disable-next-line no-useless-constructor
  public constructor(props: Props) {
    super(props);
  }

  public render() {
    const style = computeStyleSheet();
    const { text } = this.props;
    return <Text style={style.noRecordFound}>{text || I18n.t('general.noRecordFound')}</Text>;
  }
}
