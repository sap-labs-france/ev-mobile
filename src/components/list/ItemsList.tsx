import React from 'react';
import { FlatList, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import ListEmptyTextComponent from './empty-text/ListEmptyTextComponent';
import ListFooterComponent from './footer/ListFooterComponent';

export interface Props<T extends ListItem> extends BaseProps {
  renderItem: (item: T, selected: boolean) => Element;
  onSelect?: (selectedIds: Set<string | number>) => void;
  emptyTitle: string;
  manualRefresh: () => void;
  onEndReached: () => void;
  data: T[];
  select?: ItemsListTypes;
  skip: number;
  count: number;
  limit: number;
  refreshing: boolean;
  initiallySelectedItems?: Set<string | number>;
}

export enum ItemsListTypes {
  NONE = 'none',
  MULTI = 'multi',
  SINGLE = 'single'
}

interface State {
  selectedItems?: Set<string | number>;
}

export default class ItemsList<T extends ListItem> extends React.Component<Props<T>, State> {
  public static defaultProps = {
    select: ItemsListTypes.NONE
  };

  public state: State;
  public props: Props<T>;

  public constructor(props: Props<T>) {
    super(props);
    this.state = { selectedItems: new Set<string>() };
  }

  public componentDidMount() {
    const { initiallySelectedItems } = this.props;
    if (initiallySelectedItems) {
      this.setState({ selectedItems: initiallySelectedItems });
    }
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props<T>>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public render() {
    const { data, skip, count, limit, navigation, manualRefresh, refreshing, onEndReached, emptyTitle, select, onSelect } = this.props;
    const { selectedItems } = this.state;
    const selectionEnabled = select !== ItemsListTypes.NONE && onSelect;
    return (
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={selectionEnabled ? () => this.onSelectItem(item) : null}>
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
    const { onSelect, select } = this.props;
    const callback = onSelect ? () => onSelect(this.state.selectedItems) : null;
    const id = item.id;
    // If the item is already selected
    if (selectedItems.has(id)) {
      // If the item is not the only one selected, unselect it
      if (selectedItems.size > 1) {
        selectedItems.delete(id);
        this.setState({ selectedItems }, callback);
      }
      // Else, add the item to the selected Ids
    } else {
      switch (select) {
        case ItemsListTypes.MULTI:
          this.setState({ selectedItems: selectedItems.add(id) }, callback);
          break;
        case ItemsListTypes.SINGLE:
          this.setState(
            { selectedItems: new Set<string | number>([id]) },
            callback
          );
          break;
      }
    }
  }
}
