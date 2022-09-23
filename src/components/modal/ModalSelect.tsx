import { Icon, Spinner} from 'native-base';
import React from 'react';
import Modal from 'react-native-modal';
import BaseProps from '../../types/BaseProps';
import Utils from '../../utils/Utils';
import { ItemSelectionMode } from '../list/ItemsList';
import computeStyleSheet from './ModalSelectStyles';
import I18n from 'i18n-js';
import SelectableList from '../../screens/base-screen/SelectableList';
import ListItem from '../../types/ListItem';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import computeListItemCommonStyle from '../list/ListItemCommonStyle';
import computeModalCommonStyle from './ModalCommonStyle';
import { Button } from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { scale } from 'react-native-size-matters';

export interface Props<T> extends BaseProps {
  defaultItems?: T[];
  buildItemName?: (item: T) => string;
  // Disable the opening with specific styles
  disabled?: boolean;
  label?: string;
  // Render button for single select
  renderItem?: (item?: T) => React.ReactElement;
  // Render button for multi select
  renderItems?: (items?: T[]) => React.ReactElement;
  // Render a generic item when the items list is empty (only if renderItemPlaceholder is null)
  renderNoItem?: () => React.ReactElement;
  // Render a generic item when nothing is selected
  renderItemPlaceholder?: () => React.ReactElement;
  // Whether or not to display the button to clear the input
  clearable?: boolean;
  selectionMode: ItemSelectionMode;
  onItemsSelected: (selectedItems: T[]) => void;
  defaultItemLoading?: boolean;
  // Can open the modal
  openable?: boolean;
  itemsEquals?: (a: T, b: T) => boolean;
}
interface State<T> {
  isVisible: boolean;
  noneSelected: boolean;
  selectedItems: T[];
}

export default class ModalSelect<T extends ListItem> extends React.Component<Props<T>, State<T>> {
  public static defaultProps: {
    defaultItemLoading: false;
  };
  public state: State<T>;
  public props: Props<T>;
  private itemsListRef: SelectableList<T>;
  public constructor(props: Props<T>) {
    super(props);
    this.state = {
      isVisible: false,
      selectedItems: [],
      noneSelected: false
    };
  }

  private clearSelection(): void {
    this.itemsListRef?.clearSelectedItems();
  }

  public resetInput(noneSelected: boolean = false, items: T[] = []): void {
    this.itemsListRef?.clearSelectedItems();
    this.setState({noneSelected, selectedItems: items, isVisible: false}, () => this.props.onItemsSelected(items));
  }

  public render() {
    const style = computeStyleSheet();
    const { selectionMode, label } = this.props;
    const { isVisible } = this.state;
    const itemsList = React.Children.only(this.props.children);
    const canValidateMultiSelect = this.itemsListRef?.getSelectedItems()?.length > 0;
    const modalCommonStyle = computeModalCommonStyle();
    const title = this.itemsListRef?.buildModalHeaderTitle();
    const subtitle = this.itemsListRef?.buildModalHeaderSubtitle();
    return (
      <View style={style.container}>
        {label && <Text style={style.label}>{label}</Text>}
        {this.renderButton(style)}
        <Modal
          propagateSwipe={true}
          useNativeDriverForBackdrop={true}
          supportedOrientations={['portrait', 'landscape']}
          style={style.modal}
          isVisible={isVisible}
          swipeDirection={['down']}
          statusBarTranslucent={true}
          animationInTiming={500}
          animationOutTiming={500}
          onSwipeComplete={() => this.setState({ isVisible: false })}
          // Modal component registers the given method for hardwareBackPress event and unregisters it when the modal
          // inner content unmounts.
          // Inner component list also unsubscribe on unmount, allowing the last subscriber to choose back implementation.
          // Here the last subscriber is the parent component
          onBackButtonPress={() => this.setState({ isVisible: false })}
         // onBackdropPress={() => this.setState({ isVisible: false })}
          hideModalContentWhileAnimating={true}>
          <SafeAreaView style={style.modalContainer}>
            <View style={style.modalHeader}>
              <View style={style.modalTitleContainer}>
                {title && <Text ellipsizeMode={'tail'} numberOfLines={1} style={style.modalTitle}>{title}</Text>}
                {subtitle && <Text numberOfLines={1} style={style.modalSubtitle}>{subtitle}</Text>}
              </View>
              <TouchableOpacity onPress={() => this.setState({ isVisible: false })}>
                <Icon size={scale(30)} style={style.closeIcon} as={EvilIcons} name={'close'} />
              </TouchableOpacity>
            </View>
            <View style={style.listContainer}>
              {React.cloneElement(itemsList, {
                onItemsSelected: (selectedItems: T[]) => this.onItemSelected(selectedItems),
                selectionMode,
                isModal: true,
                onContentUpdated: () => this.onListContentUpdated(),
                ref: (itemsList: SelectableList<T>) => {
                  if (itemsList && this.itemsListRef !== itemsList) {
                    this.itemsListRef = itemsList;
                    this.forceUpdate();
                  }
                }
              })}
            </View>
            {selectionMode === ItemSelectionMode.MULTI && (
              <View style={style.buttonsContainer}>
                <Button
                  disabled={!canValidateMultiSelect}
                  title={I18n.t('general.validate')}
                  disabledStyle={style.disabledButton}
                  disabledTitleStyle={style.disabledButtonText}
                  containerStyle={[style.buttonContainer]}
                  onPress={() => this.validateSelection()}/>
                <Button
                  containerStyle={[style.buttonContainer, modalCommonStyle.primaryButton]}
                  title={I18n.t('general.reset')}
                  onPress={() => this.clearSelection()} />
              </View>
            )}
          </SafeAreaView>
        </Modal>
      </View>
    );
  }

  private validateSelection(): void {
    const { onItemsSelected } = this.props;
    const selectedItems = this.itemsListRef?.getSelectedItems();
    if (!Utils.isEmptyArray(selectedItems)) {
      this.setState({ isVisible: false, selectedItems }, () => onItemsSelected?.(selectedItems));
    }
  }

  private onItemSelected(selectedItems: T[]): void {
    const { selectionMode, onItemsSelected } = this.props;
    if (selectionMode === ItemSelectionMode.MULTI) {
      this.setState({ noneSelected: false });
    } else if (selectionMode === ItemSelectionMode.SINGLE && !Utils.isEmptyArray(selectedItems)) {
      this.setState({ selectedItems, isVisible: false, noneSelected: false }, () => onItemsSelected?.(selectedItems));
    }
  }

  private onListContentUpdated(): void {
    this.forceUpdate();
  }

  private renderButton(style: any) {
    const {
      defaultItemLoading,
      renderNoItem,
      renderItem,
      renderItemPlaceholder,
      openable,
      disabled,
      clearable,
      defaultItems,
      selectionMode,
      renderItems
    } = this.props;
    const { selectedItems, noneSelected } = this.state;
    const listItemCommonStyle = computeListItemCommonStyle();

    const commonColors = Utils.getCurrentCommonColor();
    if (defaultItemLoading) {
      return (
        <View style={[listItemCommonStyle.container, style.spinnerContainer]}>
          <Spinner size={scale(20)} color={commonColors.textColor} style={style.spinner} />
        </View>
      );
    }
    if ((selectedItems?.[0] || defaultItems?.[0])) {
      return (
        <View style={style.itemContainer}>
          <TouchableOpacity
            disabled={disabled || !openable}
            onPress={() => this.setState({ isVisible: true })}
            style={[style.itemButtonContainer, disabled && style.buttonDisabled]}>
            {selectionMode === ItemSelectionMode.MULTI ?
              renderItems?.(Utils.isEmptyArray(selectedItems) ? defaultItems : selectedItems)
              :
              renderItem?.(selectedItems?.[0] ?? defaultItems?.[0])
            }
          </TouchableOpacity>
          {clearable && (
            <TouchableOpacity style={style.clearContainer} onPress={() => this.resetInput(true)}>
              <Icon size={scale(25)} style={style.clearIcon} as={EvilIcons} name={'close'} />
            </TouchableOpacity>
          )}
        </View>
      );
    } if (renderItemPlaceholder && (noneSelected || !renderNoItem)) {
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
