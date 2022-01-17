import I18n from 'i18n-js';
import {View } from 'native-base';
import React from 'react';

import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import DialogModal from '../../../modal/DialogModal';
import computeModalCommonStyle from '../../../modal/ModalCommonStyle';

export interface Props extends FilterContainerComponentProps {}

interface State extends FilterContainerComponentState {}

export default class FilterModalContainerComponent extends FilterContainerComponent {
  public state: State;
  public props: Props;
  private filtersActive: boolean = null;

  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public setFiltersActive(filtersActive: boolean): void {
    this.filtersActive = filtersActive;
  }

  public getFiltersActive(): boolean {
    return this.filtersActive;
  }

  public async notifyFilterChanged() {
    const { onFilterChanged } = this.props;
    // Notify
    onFilterChanged(this.getFilters(), false);
  }

  public clearFilters() {
    super.clearFilters();
    this.setFiltersActive(false);
   // this.notifyFilterChanged();
  }

  public applyFiltersAndNotify = async () => {
    const { onFilterChanged } = this.props;
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setVisible(false);
  };

  public clearFiltersAndNotify = async () => {
    const { onFilterChanged } = this.props;
    // Clear
    this.clearFilters();
    // Save
    await this.saveFilters();
    // Notify
    onFilterChanged(this.getFilters(), true);
    // Close
    this.setVisible(false);
  };

  public render = () => {
    const modalCommonStyle = computeModalCommonStyle();
    const { visible } = this.state;
    return (
      <View>
        {visible && (
          <DialogModal
            title={I18n.t('general.filters')}
            renderControls={() => this.props.children}
            withCloseButton={true}
            onBackDropPress={() => {}}
            close={() => this.setState({ visible: false })}
            buttons={[
              {
                text: I18n.t('general.apply'),
                action: async () => this.applyFiltersAndNotify(),
                buttonTextStyle: modalCommonStyle.primaryButton,
                buttonStyle: modalCommonStyle.primaryButton
              },
              {
                text: I18n.t('general.clear'),
                action: async () => this.clearFiltersAndNotify(),
                buttonTextStyle: modalCommonStyle.primaryButton,
                buttonStyle: modalCommonStyle.primaryButton
              }
            ]}
          />
        )}
      </View>
    );
  };
}
