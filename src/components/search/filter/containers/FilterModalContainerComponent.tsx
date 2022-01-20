import React from 'react';

import FilterContainerComponent, { FilterContainerComponentProps, FilterContainerComponentState } from './FilterContainerComponent';
import computeModalCommonStyle from '../../../modal/ModalCommonStyle';
import FiltersModal from '../../../modal/FiltersModal';
import { View } from 'react-native';

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
    onFilterChanged?.(this.getFilters(), false);
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

  public async clearFiltersAndNotify(): Promise<void> {
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
    const { visible } = this.state;
    return (
      <View>
        {visible && (
          <FiltersModal
            apply={() => this.applyFiltersAndNotify()}
            clear={() => this.clearFiltersAndNotify()}
            close={() => this.setState({visible: false})}>
            {this.props.children}
          </FiltersModal>
        )}
      </View>
    );
  }
}
