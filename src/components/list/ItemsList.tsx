import React from 'react';
import { FlatList, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import ListEmptyTextComponent from './empty-text/ListEmptyTextComponent';
import ListFooterComponent from './footer/ListFooterComponent';

export interface Props<T extends ListItem> extends BaseProps {
  renderItem: (item: T, selected: boolean) => Element;
  onSelect?: (selectedItems: T[]) => void;
  emptyTitle: string;
  manualRefresh: () => void;
  onEndReached: () => void;
  data: T[];
  selectionMode?: ItemSelectionMode;
  skip: number;
  count: number;
  limit: number;
  refreshing: boolean;
  initiallySelectedItems?: T[];
}

export enum ItemSelectionMode {
  NONE = 'none',
  MULTI = 'multi',
  SINGLE = 'single'
}

interface State<T> {
  selectedItems?: Map<string | number, T>;
}

export default class ItemsList<T extends ListItem> extends React.Component<Props<T>, State<T>> {
  public static defaultProps = {
    selectionMode: ItemSelectionMode.NONE,
    initiallySelectedItems: []
  };
  public state: State<T>;
  public props: Props<T>;

  public constructor(props: Props<T>) {
    super(props);
    this.state = { selectedItems: new Map<string | number, T>() };
  }

  public componentDidMount() {
    const { initiallySelectedItems } = this.props;
    if (initiallySelectedItems) {
      const selectedItems = new Map<string | number, T>();
      initiallySelectedItems.forEach((item) => selectedItems.set(item.id, item));
      this.setState({ selectedItems });
    }
  }

  public setState = (
    state:
      | State<T>
      | ((prevState: Readonly<State<T>>, props: Readonly<Props<T>>) => State<T> | Pick<State<T>, never>)
      | Pick<State<T>, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const {
      data,
      skip,
      count,
      limit,
      navigation,
      manualRefresh,
      refreshing,
      onEndReached,
      emptyTitle,
      selectionMode,
      onSelect
    } = this.props;
    const { selectedItems } = this.state;
    const selectionEnabled = selectionMode !== ItemSelectionMode.NONE && onSelect;
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity disabled={!selectionEnabled} onPress={() => this.onSelectItem(item)}>
            {this.props.renderItem(item, selectedItems.has(item.id))}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => item.id.toString() + index.toString()}
        onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
        refreshControl={<RefreshControl onRefresh={manualRefresh} refreshing={refreshing} />}
        ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
        onEndReached={onEndReached}
        ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={emptyTitle} />}
      />
    );
  }

  private onSelectItem(item: T): void {
    const { selectedItems } = this.state;
    const { onSelect, selectionMode } = this.props;
    const itemSelectedCallback = onSelect ? () => onSelect([...this.state.selectedItems.values()]) : null;
    // If the item is already selected
    if (selectedItems.has(item.id)) {
      // If the item is not the only one selected, unselect it
      if (selectedItems.size > 1) {
        selectedItems.delete(item.id);
        this.setState({ selectedItems }, itemSelectedCallback);
      }
      // Else, add the item to the selected Ids
    } else {
      switch (selectionMode) {
        case ItemSelectionMode.MULTI:
          selectedItems.set(item.id, item);
          this.setState({ selectedItems }, itemSelectedCallback);
          break;
        case ItemSelectionMode.SINGLE:
          selectedItems.clear();
          selectedItems.set(item.id, item);
          this.setState({ selectedItems }, itemSelectedCallback);
          break;
      }
    }
  }
}
