import React from 'react';

import { ItemSelectionMode } from '../../components/list/ItemsList';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import BaseAutoRefreshScreen from './BaseAutoRefreshScreen';

export interface SelectableProps<T> extends BaseProps {
  selectionMode?: ItemSelectionMode;
  isModal?: boolean;
  onItemsSelected?: (selectedItems: T[]) => void;
}

export interface SelectableState<T> {
  selectedItems: T[];
}

export default class SelectableList<T extends ListItem> extends BaseAutoRefreshScreen<SelectableProps<T>, SelectableState<T>> {
  public static defaultProps = {
    selectionMode: ItemSelectionMode.NONE,
    isModal: false
  };
  public state: SelectableState<T>;
  public props: SelectableProps<T>;

  protected onItemsSelected(selectedItems: T[]): void {
    this.setState({ selectedItems });
    const { onItemsSelected } = this.props;
    if (onItemsSelected) {
      onItemsSelected(selectedItems);
    }
  }
}
