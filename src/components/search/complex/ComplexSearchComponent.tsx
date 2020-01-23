import I18n from 'i18n-js';
import { Button, View } from 'native-base';
import React from 'react';
import { Text } from 'react-native';
import Modal from 'react-native-modal';
import SecuredStorage from '../../../utils/SecuredStorage';
import BaseFilterComponent from './BaseFilterComponent';
import computeStyleSheet from './ComplexSearchComponentStyles';

export interface Props {
  onFilterChanged?: (filters: any, closed: boolean) => void;
  visible?: boolean;
  children?: React.ReactNode;
}

interface State {
  visible?: boolean;
}

export default class ComplexSearchComponent extends React.Component<Props, State> {
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
    for (const filterComponent of this.filterComponents) {
      if (filterComponent.getID() === newFilterComponent.getID()) {
        return;
      }
    }
    // Add new
    this.filterComponents.push(newFilterComponent);
  }

  public setFilterValue = async (filterID: string, filterValue: any) => {
    // Search
    for (const filterComponent of this.filterComponents) {
      if (filterComponent.getID() === filterID) {
        // Set
        filterComponent.setValue(filterValue);
        // Trigger notif
        this.onFilterChanged(false);
        break;
      }
    }
  }

  public clearFilterValue = async (filterID: string) => {
    // Search
    for (const filterComponent of this.filterComponents) {
      if (filterComponent.getID() === filterID) {
        // Set
        filterComponent.clearValue();
        // Trigger notif
        this.onFilterChanged(false);
        break;
      }
    }
  }

  public getFilterValue = (ID: string): string => {
    // Search
    for (const filterComponent of this.filterComponents) {
      if (filterComponent.getID() === ID) {
        return filterComponent.getValue();
      }
    }
    return null;
  }

  public getFilterValues = (): any => {
    const filters: any = {};
    // Build
    for (const filterComponent of this.filterComponents) {
      if (filterComponent.getValue()) {
        filters[filterComponent.getID()] = filterComponent.getValue();
      }
    }
    return filters;
  }

  public onFilterChanged = (closed: boolean) => {
    const { onFilterChanged } = this.props;
    // Call method
    if (onFilterChanged) {
      onFilterChanged(this.getFilterValues(), closed);
    }
  }

  public applyFiltersAndNotify = async () => {
    // Save
    await this.saveFilterValues();
    // Trigger notif
    this.onFilterChanged(true);
    // Close
    this.setVisible(false);
  }

  public clearFilterValues() {
    // Clear
    for (const filterComponent of this.filterComponents) {
      filterComponent.clearValue();
    }
  }

  public clearFiltersAndNotify = async () => {
    // Clear
    await this.clearFilterValues();
    // Save
    await this.saveFilterValues();
    // Trigger notif
    this.onFilterChanged(true);
    // Close
    this.setVisible(false);
  }

  private async saveFilterValues() {
    // Build
    for (const filterComponent of this.filterComponents) {
      // Save
      if (filterComponent.canBeSaved()) {
        await SecuredStorage.saveFilterValue(filterComponent.getInternalID(), filterComponent.getValue());
      }
    }
  }

  public render = () => {
    const style = computeStyleSheet();
    const { visible } = this.state;
    return (
      <Modal isVisible={visible}>
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
