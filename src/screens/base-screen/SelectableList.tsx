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
  protected title: string;

  public clearSelectedItems(): void {
    this.itemsListRef.current?.clearSelectedItems();
  }

  protected onItemsSelected(selectedItems: T[]): void {
    this.setState({ selectedItems });
    const { onItemsSelected } = this.props;
    if (onItemsSelected) {
      onItemsSelected(selectedItems);
    }
  }

  protected buildHeaderTitle(): string {
    const { selectionMode } = this.props;
    switch (selectionMode) {
      case ItemSelectionMode.SINGLE:
        return I18n.t(this.selectSingleTitle);
      case ItemSelectionMode.MULTI:
        return I18n.t(this.selectMultipleTitle);
      default:
        return this.title;
    }
  }

  protected buildHeaderSubtitle(): string {
    const { selectionMode } = this.props;
    const { selectedItems, count } = this.state;
    switch (selectionMode) {
      case ItemSelectionMode.MULTI:
      case ItemSelectionMode.SINGLE:
        return `${I18n.t('general.selected')}: ${I18nManager.formatNumber(selectedItems.length)} - ${I18n.t('general.results')}: ${I18nManager.formatNumber(count)}`;
      default:
        return count > 0 && `${I18nManager.formatNumber(count)} ${I18n.t('users.users')}`;
    }
  }

  protected async refresh() {
    console.warn('BaseAutoRefreshScreen: Refresh not implemented!!!');
  }

  protected manualRefresh = async () => {
    // Display spinner
    this.setState({ refreshing: true });
    // Refresh
    await this.refresh();
    // Hide spinner
    this.setState({ refreshing: false });
  };
}
