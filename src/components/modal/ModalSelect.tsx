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

export interface Props<T> extends BaseProps {
  defaultItem?: T;
  buildItemName: (item: T) => string;
  selectionMode: ItemSelectionMode;
  onItemsSelected: (selectedItems: T[]) => void;
  defaultItemLoading?: boolean;
  renderIcon?: (style: any) => React.ReactElement;
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

  public render() {
    const style = computeStyleSheet();
    const commonColors = Utils.getCurrentCommonColor();
    const { buildItemName, selectionMode, defaultItemLoading, defaultItem, renderIcon } = this.props;
    const { isVisible, selectedItemsCount, selectedItems } = this.state;
    const itemsList = React.Children.only(this.props.children);
    return (
      <View style={style.container}>
        <Button
          disabled={!defaultItem}
          block={true}
          style={[style.button, !defaultItem ? style.buttonDisabled : style.buttonEnabled]}
          onPress={() => this.setState({ isVisible: true })}>
          <View style={style.selectionContainer}>
            {renderIcon && <View style={style.iconContainer}>{renderIcon(style.inputIcon)}</View>}
            {defaultItemLoading ? (
              <Spinner style={style.spinner} color={commonColors.textColor} />
            ) : (
              <Text ellipsizeMode={'tail'} style={[style.buttonText, style.selectText]} uppercase={false}>
                {buildItemName(defaultItem)}{' '}
                {selectedItemsCount > 1 && `(+${selectedItemsCount - 1})`}
              </Text>
            )}
          </View>
        </Button>
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
              <Icon
                onPress={() => this.setState({ isVisible: false })}
                type="MaterialIcons"
                name={'expand-more'}
                style={[style.icon, style.downArrow]}
              />
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
                  disabled={selectedItemsCount <= 0}
                  block
                  light
                  style={[style.modalButton, selectedItemsCount > 0 ? style.buttonEnabled : style.buttonDisabled]}
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
  }

  private validateSelection(): void {
    const { onItemsSelected } = this.props;
    const selectedItems = this.itemsListRef?.current?.state.selectedItems;
    if (!Utils.isEmptyArray(selectedItems)) {
      this.setState({ isVisible: false, selectedItemsCount: 0 }, () => onItemsSelected(selectedItems));
    }
  }

  private onItemSelected(selectedItems: T[]): void {
    const { selectionMode, onItemsSelected } = this.props;
    if (selectionMode === ItemSelectionMode.MULTI) {
      // We only need the items count to handle the activation of the 'validate' button
      this.setState({ selectedItemsCount: selectedItems.length });
    } else if (selectionMode === ItemSelectionMode.SINGLE && !Utils.isEmptyArray(selectedItems)) {
      this.setState({ isVisible: false }, () => onItemsSelected(selectedItems));
    }
  }
}
