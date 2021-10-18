import { Button, Icon, Spinner, Text, View } from 'native-base';
import React, { createRef } from 'react';
import Modal from 'react-native-modal';
import BaseProps from '../../types/BaseProps';
import Utils from '../../utils/Utils';
import { ItemSelectionMode } from '../list/ItemsList';
import computeStyleSheet from './ModalStyles';
import I18n from 'i18n-js';
import SelectableList from '../../screens/base-screen/SelectableList';
import ListItem from '../../types/ListItem';
import { TouchableHighlight, TouchableOpacity } from 'react-native';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';

export interface Props<T> extends BaseProps {
  defaultItem?: T;
  buildItemName?: (item: T) => string;
  disabled?: boolean;
  label?: string;
  renderItem?: (item?: T) => React.ReactElement;
  renderNoItem?: () => React.ReactElement;
  renderItemPlaceholder?: () => React.ReactElement;
  selectionMode: ItemSelectionMode;
  onItemsSelected: (selectedItems: T[]) => void;
  defaultItemLoading?: boolean;
  openable?: boolean;
}
interface State<T> {
  isVisible: boolean;
  selectedItems: T[];
  selectedItemsCount: number;
}

export default class ModalSelect<T extends ListItem> extends React.Component<Props<T>, State<T>> {
  public static defaultProps: {
    defaultItemLoading: false;
  };
  public state: State<T>;
  public props: Props<T>;
  private itemsListRef = createRef<SelectableList<T>>();
  public constructor(props: Props<T>) {
    super(props);
    this.state = {
      isVisible: false,
      selectedItems: [],
      selectedItemsCount: 0
    };
  }

  public clearInput() {
    this.setState({ selectedItems: [] });
  }

  public render() {
    const style = computeStyleSheet();
    const { selectionMode, label } = this.props;
    const { isVisible, selectedItems } = this.state;
    const itemsList = React.Children.only(this.props.children);
    return (
      <View style={style.container}>
        <View style={style.buttonContainer}>
          {label && <Text style={style.label}>{label}</Text>}
          {this.renderButton(style)}
        </View>
        <Modal
          propagateSwipe={true}
          supportedOrientations={['portrait', 'landscape']}
          style={style.modal}
          isVisible={isVisible}
          swipeDirection={'down'}
          animationInTiming={1000}
          onSwipeComplete={() => this.setState({ isVisible: false })}
          onBackButtonPress={() => this.setState({ isVisible: false })}
          onBackdropPress={() => this.setState({ isVisible: false })}
          hideModalContentWhileAnimating={true}>
          <View style={style.modalContainer}>
            <View style={style.modalHeader}>
              <TouchableHighlight style={style.closeIcon} onPress={() => this.setState({ isVisible: false })}>
                <Icon type="MaterialIcons" name={'close'} />
              </TouchableHighlight>
            </View>
            <View style={style.listContainer}>
              {React.cloneElement(itemsList, {
                onItemsSelected: (selected: T[]) => this.onItemSelected(selected),
                selectionMode,
                isModal: true,
                ref: this.itemsListRef
              })}
            </View>
            {selectionMode === ItemSelectionMode.MULTI && (
              <View style={style.bottomButtonContainer}>
                <Button style={style.modalButton} block light onPress={() => this.clearSelection()}>
                  <Text style={style.buttonText}>{I18n.t('general.reset')}</Text>
                </Button>
                <Button
                  disabled={selectedItems.length <= 0}
                  block
                  light
                  style={[style.modalButton, selectedItems.length > 0 ? style.buttonEnabled : style.buttonDisabled]}
                  onPress={() => this.validateSelection()}>
                  <Text style={style.buttonText}>{I18n.t('general.validate')}</Text>
                </Button>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  }

  private clearSelection(): void {
    this.itemsListRef?.current?.clearSelectedItems();
    this.setState(this.state);
  }

  private validateSelection(): void {
    const { onItemsSelected } = this.props;
    const selectedItems = this.itemsListRef?.current?.state.selectedItems;
    if (!Utils.isEmptyArray(selectedItems)) {
      this.setState({ isVisible: false }, () => onItemsSelected(selectedItems));
    }
  }

  private onItemSelected(selectedItems: T[]): void {
    const { selectionMode, onItemsSelected } = this.props;
    if (selectionMode === ItemSelectionMode.MULTI) {
      this.setState({ selectedItems });
    } else if (selectionMode === ItemSelectionMode.SINGLE && !Utils.isEmptyArray(selectedItems)) {
      this.setState({ selectedItems, isVisible: false }, () => onItemsSelected(selectedItems));
    }
  }

  private renderButton(style: any) {
    const { defaultItemLoading, defaultItem, renderNoItem, renderItem, renderItemPlaceholder, openable, disabled } = this.props;
    const { selectedItems } = this.state;
    const listItemCommonStyle = computeListItemCommonStyle();
    const commonColors = Utils.getCurrentCommonColor();
    if (defaultItemLoading) {
      return (
        <View style={[listItemCommonStyle.container, style.spinnerContainer]}>
          <Spinner color={commonColors.textColor} style={style.spinner} />
        </View>
      );
    }
    if (defaultItem || selectedItems[0]) {
      return (
        <TouchableOpacity
          disabled={disabled || !openable}
          onPress={() => this.setState({ isVisible: true })}
          style={[style.itemContainer, disabled && style.buttonDisabled]}>
          {renderItem?.(selectedItems.length > 0 ? selectedItems[0] : defaultItem)}
        </TouchableOpacity>
      );
    } else if (renderItemPlaceholder) {
      return (
        <TouchableOpacity onPress={() => this.setState({ isVisible: true })} style={style.itemContainer}>
          {renderItemPlaceholder?.()}
        </TouchableOpacity>
      );
    } else {
      return <View style={style.itemContainer}>{renderNoItem?.()}</View>;
    }
  }
}
