import React from 'react';
import { FlatList, Platform, RefreshControl, TouchableOpacity, View } from 'react-native';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import ListEmptyTextComponent from './empty-text/ListEmptyTextComponent';
import ListFooterComponent from './footer/ListFooterComponent';
import Utils from '../../utils/Utils';
import computeStyleSheet from './ItemsListStyle';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';

export interface Props<T extends ListItem> extends BaseProps {
  renderItem: (item: T, selected?: boolean) => React.ReactElement;
  onSelect?: (selectedItems: T[]) => void;
  emptyTitle: string;
  manualRefresh: () => void;
  onEndReached: () => void;
  data: T[];
  itemsSeparator?: ItemsSeparatorType;
  selectionMode?: ItemSelectionMode;
  skip: number;
  count: number;
  limit: number;
  refreshing: boolean;
  disableItem?: (item: T) => boolean;
}

export enum ItemSelectionMode {
  NONE = 'none',
  MULTI = 'multi',
  SINGLE = 'single'
}

export enum ItemsSeparatorType {
  DEFAULT = 'default'
}

interface State<T> {
  selectedItems?: Map<string | number, T>;
}

export default class ItemsList<T extends ListItem> extends React.Component<Props<T>, State<T>> {
  public static defaultProps = {
    selectionMode: ItemSelectionMode.NONE
  };
  public state: State<T>;
  public props: Props<T>;
  private itemsSelectedCallback: () => void;

  public constructor(props: Props<T>) {
    super(props);
    this.itemsSelectedCallback = this.props.onSelect ? () => this.props.onSelect([...this.state.selectedItems.values()]) : () => {};
    this.state = {
      selectedItems: new Map<string | number, T>()
    };
  }

  public setState = (state: | State<T> | ((prevState: Readonly<State<T>>, props: Readonly<Props<T>>) => State<T> | Pick<State<T>, never>) | Pick<State<T>, never>, callback?: () => void) => {super.setState(state, callback);};

  public clearSelectedItems(): void {
    this.setState({ selectedItems: new Map<string | number, T>() }, this.itemsSelectedCallback);
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
      selectionMode,
      onSelect,
      itemsSeparator,
      disableItem
    } = this.props;
    const { selectedItems } = this.state;
    const selectionEnabled = selectionMode !== ItemSelectionMode.NONE && onSelect;
    const style = computeStyleSheet();
    const listItemCommonStyles = computeListItemCommonStyle();
    const commonColors = Utils.getCurrentCommonColor();
    return (
      <View style={style.container}>
        <FlatList
          data={data}
          style={style.flatList}
          keyboardShouldPersistTaps={'always'}
          onStartShouldSetResponder={() => true}
          renderItem={({ item }) => {
            const isItemDisabled = !!disableItem?.(item);
            return (
              <View style={style.rowContainer}>
                <TouchableOpacity
                  style={[style.rowItem, isItemDisabled && selectionEnabled && listItemCommonStyles.disabled]}
                  disabled={!selectionEnabled}
                  onPress={selectionEnabled && !isItemDisabled ? () => this.onSelectItem(item) : () => {}}>
                  {this.props.renderItem(item, selectedItems.has(item.id))}
                </TouchableOpacity>
                {this.renderItemsSeparator(itemsSeparator, style)}
              </View>
            );
          }}
          keyExtractor={(item, index) => Utils.concatenateStrings(item?.id?.toString(), index?.toString())}
          removeClippedSubviews={true}
          onEndReachedThreshold={Platform.OS === 'android' ? 1 : 0.1}
          refreshControl={<RefreshControl progressBackgroundColor={commonColors.containerBgColor} colors={[commonColors.textColor, commonColors.textColor]} onRefresh={manualRefresh} refreshing={refreshing} />}
          ListFooterComponent={() => <ListFooterComponent navigation={navigation} skip={skip} count={count} limit={limit} />}
          onEndReached={onEndReached}
          ListEmptyComponent={() => <ListEmptyTextComponent navigation={navigation} text={emptyTitle} />}
        />
      </View>

    );
  }

  private onSelectItem(item: T): void {
    const { selectedItems } = this.state;
    const { selectionMode } = this.props;
    // If the item is already selected, unselect it
    if (selectedItems.has(item.id)) {
      selectedItems.delete(item.id);
      this.setState({ selectedItems }, this.itemsSelectedCallback);
      // Else, add the item to the selected Ids
    } else {
      switch (selectionMode) {
        case ItemSelectionMode.MULTI:
          selectedItems.set(item.id, item);
          this.setState({ selectedItems }, this.itemsSelectedCallback);
          break;
        case ItemSelectionMode.SINGLE:
          selectedItems.clear();
          selectedItems.set(item.id, item);
          this.setState({ selectedItems }, this.itemsSelectedCallback);
          break;
      }
    }
  }

  private renderItemsSeparator(itemsSeparatorType: ItemsSeparatorType, style: any) {
    switch (itemsSeparatorType) {
      case ItemsSeparatorType.DEFAULT:
        return <View style={style.rowSeparator} />;
      default:
        return <></>;
    }
  }
}
