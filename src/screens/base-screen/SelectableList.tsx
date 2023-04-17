import React from 'react';
import BaseProps from '../../types/BaseProps';
import ItemsList, { ItemSelectionMode } from '../../components/list/ItemsList';
import ListItem from '../../types/ListItem';
import BaseScreen from './BaseScreen';
import { default as I18n } from 'i18n-js';
import I18nManager from '../../I18n/I18nManager';

export interface SelectableProps<T> extends BaseProps {
  selectionMode?: ItemSelectionMode;
  isModal?: boolean;
  onItemsSelected?: (selectedItems: T[]) => void;
  filters?: {};
  onContentUpdated?: () => void;
}

export interface SelectableState<T> {
  selectedItems: T[];
  count: number;
}

export default class SelectableList<T extends ListItem> extends BaseScreen<SelectableProps<T>, SelectableState<T>> {
  public static defaultProps = {
    selectionMode: ItemSelectionMode.NONE,
    isModal: false
  };
  public state: SelectableState<T>;
  public props: SelectableProps<T>;
  protected itemsListRef = React.createRef<ItemsList<T>>();
  protected selectSingleTitle: string;
  protected selectMultipleTitle: string;
  protected selectSingleSubTitle: string;
  protected singleItemTitle: string;
  protected multiItemsTitle: string;

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    // When filters are enabled, first refresh is triggered via onFiltersChanged
    if (!this.screenFilters) {
      this.refresh(true);
    }
  }

  public clearSelectedItems(): void {
    this.itemsListRef.current?.clearSelectedItems();
  }

  public getSelectedItems(): T[] {
    return this.state.selectedItems;
  }

  protected onItemsSelected(selectedItems: T[]): void {
    this.setState({ selectedItems }, () => this.props.onItemsSelected?.(selectedItems));
  }

  public buildHeaderTitle(): string {
    return this.multiItemsTitle;
  }

  protected buildHeaderSubtitle(): string {
    const { count } = this.state;
    return count > 0 && `(${I18nManager.formatNumber(count)})`;
  }

  public buildModalHeaderTitle(): string {
    switch (this.props.selectionMode) {
      case ItemSelectionMode.SINGLE:
        return I18n.t(this.selectSingleTitle);
      default:
        return I18n.t(this.selectMultipleTitle);
    }
  }

  public buildModalHeaderSubtitle(): string {
    const { selectionMode } = this.props;
    const { selectedItems, count } = this.state;
    switch (selectionMode) {
      case ItemSelectionMode.MULTI:
        return `(${I18nManager.formatNumber(selectedItems.length)}/${I18nManager.formatNumber(count)})`;
      case ItemSelectionMode.SINGLE:
        return `(${I18nManager.formatNumber(count)})`;
      default:
        return '';
    }
  }

  protected async refresh(showSpinner = false, callback: () => void = () => null) {
    console.warn('BaseAutoRefreshScreen: Refresh not implemented!!!');
  }

  protected async manualRefresh() {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  }

  protected setDrawerStatus() {
    if (!this.props.isModal) {
      super.setDrawerStatus();
    }
  }
}
