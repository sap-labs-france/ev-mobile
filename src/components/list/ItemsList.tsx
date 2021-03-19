import React from 'react';
import { FlatList, Platform, RefreshControl, TouchableOpacity } from 'react-native';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import ListEmptyTextComponent from './empty-text/ListEmptyTextComponent';
import ListFooterComponent from './footer/ListFooterComponent';

export interface Props<T extends ListItem> extends BaseProps {
  renderItem: (item: T, selected: boolean) => Element;
  onSelect: (selectedIds: {[key: string]: T}) => void;
  emptyTitle: string;
  manualRefresh: () => void;
  onEndReached: () => void;
  data: T[];
  select?: ItemsListTypes;
  skip: number;
  count: number;
  limit: number;
  refreshing: boolean;
  initiallySelectedItems?: {[key: string]: T };
}

export enum ItemsListTypes {
  NONE= 'none',
  MULTI = 'multi',
  SINGLE = 'single'
}

interface State<T> {
  selectedItems?: {[key: string]: T};
}

export default class ItemsList<T extends ListItem> extends React.Component<Props<T>, State<T>> {

  public constructor(props: Props<T>) {
    super(props);
    this.state = {selectedItems: {}};
  }

  public static defaultProps = {
    select: ItemsListTypes.NONE,
    onSelect: () => {return; }
  }
  public state: State<T>;
  public props: Props<T>;

  public componentDidMount() {
    const { initiallySelectedItems } = this.props;
    if( initiallySelectedItems ) {
      this.setState({selectedItems : initiallySelectedItems});
    }
  }

  public setState = (state: State<T> | ((prevState: Readonly<State<T>>, props: Readonly<Props<T>>) => State<T> | Pick<State<T>, never>) | Pick<State<T>, never>, callback?: () => void) => {
    super.setState(state, callback);
  }

  private onSelectItem(item: T) {
    const { selectedItems } = this.state;
    const { select } = this.props;
    const id = item.id;
    // If the item is already selected, unselect it
    if (selectedItems[id]) {
      delete selectedItems[id];
      this.setState({selectedItems}, () => this.props.onSelect(this.state.selectedItems));
      // Else, add the item to the selected Ids
    } else {
      switch (select) {
        case ItemsListTypes.MULTI:
          this.setState({...this.state, selectedItems: {...selectedItems, [id]: item}}, () => this.props.onSelect(this.state.selectedItems));
          break;
        case ItemsListTypes.SINGLE:
          this.setState({...this.state, selectedItems: {[id]: item}}, () => this.props.onSelect(this.state.selectedItems)
          );
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
      emptyTitle,
      select
    } = this.props;
    const { selectedItems } = this.state;
    return (
      <FlatList
        data={data}
        renderItem={({item}) => (
          <TouchableOpacity onPress={select === ItemsListTypes.NONE ? null : () => this.onSelectItem(item)}>
            {this.props.renderItem(item, selectedItems.hasOwnProperty(item.id))}
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `${index}`}
        maxToRenderPerBatch={15}
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
