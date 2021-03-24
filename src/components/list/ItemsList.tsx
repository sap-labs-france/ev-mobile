import React from 'react';
import { FlatList, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import ListEmptyTextComponent from './empty-text/ListEmptyTextComponent';
import ListFooterComponent from './footer/ListFooterComponent';

export interface Props<T extends ListItem> extends BaseProps {
  renderItem: (item: T, selected: boolean) => Element;
  emptyTitle: string;
  manualRefresh: () => void;
  onEndReached: () => void;
  data: T[];
  select?: ItemsListTypes;
  skip: number;
  count: number;
  limit: number;
  refreshing: boolean;
}

export enum ItemsListTypes {
  NONE= 'none',
  MULTI = 'multi',
  SINGLE = 'single'
}

interface State {
  selectedIds?: Set<string>;
}

export default class ItemsList<T extends ListItem> extends React.Component<Props<T>, State> {

  public constructor(props: Props<T>) {
    super(props);
    this.state = {selectedIds: new Set<string>()};
  }

  public static defaultProps = {
    select: ItemsListTypes.NONE
  };
  public state: State;
  public props: Props<T>;

  public setState = (state: State | ((prevState: Readonly<State>, props: Readonly<Props<T>>) => State | Pick<State, never>) | Pick<State, never>, callback?: () => void) => {
    super.setState(state, callback);
  };

  private onSelectItem(item: T) {
    const { selectedIds } = this.state;
    const id = item.id;
    // If the item is already selected, unselect it
    if (selectedIds.has(id)) {
      const newSelectedIds = new Set(selectedIds);
      newSelectedIds.delete(id);
      this.setState({...this.state, selectedIds: newSelectedIds});
      // Else, add the item to the selected Ids
    } else {
      switch (this.props.select) {
        case ItemsListTypes.MULTI:
          this.setState({...this.state, selectedIds: new Set(selectedIds).add(item.id)});
          break;
        case ItemsListTypes.SINGLE:
          this.setState({...this.state, selectedIds: new Set().add(id)});
          break;
      }
    }
  }

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
      emptyTitle
    } = this.props;
    const {selectedIds} = this.state;
    return (
      <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => this.onSelectItem(item)}>
            {this.props.renderItem(item, selectedIds.has(item.id))}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${index}`}
        onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
        refreshControl={<RefreshControl onRefresh={manualRefresh} refreshing={refreshing}/>}
        ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip}
          count={count} limit={limit}/>}
        onEndReached={onEndReached}
        ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation}
          text={emptyTitle}/>}
      />
    );
  }
}
