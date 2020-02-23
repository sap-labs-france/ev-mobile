import I18n from 'i18n-js';
import { Button, View } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import Modal from 'react-native-modal';
import SecuredStorage from '../../../utils/SecuredStorage';
import BaseFilterComponent from './filter/BaseFilterControlComponent';
import computeStyleSheet from './FilterModalContainerComponentStyles';

export interface Props {
  onFilterChanged?: (filters: any, closed: boolean) => void;
  visible?: boolean;
  children?: React.ReactNode;
}

interface State {
  visible?: boolean;
}

export default class FilterModalContainerComponent extends React.Component<Props, State> {
  public state: State;
  public props: Props;
  private filterComponents: BaseFilterComponent[] = [];
  public static defaultProps = {
    visible: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: props.visible ? props.visible : false
    };
  }

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  public setVisible = (visible: boolean) => {
    this.setState({ visible });
  }

  public async addFilter(newFilterComponent: BaseFilterComponent) {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === newFilterComponent.getID()) {
        return;
      }
    }
    // Add new
    this.filterComponents.push(newFilterComponent);
  }

  public setFilter = async (filterID: string, filterValue: any) => {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === filterID) {
        // Set
        filterContainerComponent.setValue(filterValue);
        // Trigger notif
        this.onFilterChanged(false);
        break;
      }
    }
  }

  public clearFilter = async (filterID: string) => {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === filterID) {
        // Set
        filterContainerComponent.clearValue();
        // Trigger notif
        this.onFilterChanged(false);
        break;
      }
    }
  }

  public getFilter = (ID: string): string => {
    // Search
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getID() === ID) {
        return filterContainerComponent.getValue();
      }
    }
    return null;
  }

  public getFilters = (): any => {
    const filters: any = {};
    // Build
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getValue()) {
        filters[filterContainerComponent.getID()] = filterContainerComponent.getValue();
      }
    }
    return filters;
  }

  public onFilterChanged = (closed: boolean) => {
    const { onFilterChanged } = this.props;
    if (onFilterChanged) {
      onFilterChanged(this.getFilters(), closed);
    }
  }

  public applyFiltersAndNotify = async () => {
    // Save
    await this.saveFilters();
    // Trigger notif
    this.onFilterChanged(true);
    // Close
    this.setVisible(false);
  }

  public clearFilters() {
    // Clear
    for (const filterContainerComponent of this.filterComponents) {
      filterContainerComponent.clearValue();
    }
  }

  public getNumberOfFilters(): number {
    let numberOfFilter = 0
    for (const filterContainerComponent of this.filterComponents) {
      if (filterContainerComponent.getValue()) {
        numberOfFilter++;
      }
    }
    return numberOfFilter;
  }

  public clearFiltersAndNotify = async () => {
    // Clear
    await this.clearFilters();
    // Save
    await this.saveFilters();
    // Trigger notif
    this.onFilterChanged(true);
    // Close
    this.setVisible(false);
  }

  private async saveFilters() {
    // Build
    for (const filterContainerComponent of this.filterComponents) {
      // Save
      if (filterContainerComponent.canBeSaved()) {
        await SecuredStorage.saveFilterValue(filterContainerComponent.getInternalID(), filterContainerComponent.getValue());
      }
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { visible } = this.state;
    return (
      <Modal isVisible={visible}
        onBackdropPress={() => this.setState({ visible: false })}
      >
        <View style={style.contentFilter}>
          {this.props.children}
        </View>
        <View style={style.contentButton}>
          <Button style={style.buttonFilter} full={true} danger={true} onPress={this.clearFiltersAndNotify} >
            <Text style={style.textButtonFilter}>{I18n.t('general.clear')}</Text>
          </Button>
          <Button style={style.buttonFilter} full={true} primary={true} onPress={this.applyFiltersAndNotify} >
            <Text style={style.textButtonFilter}>{I18n.t('general.close')}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}
