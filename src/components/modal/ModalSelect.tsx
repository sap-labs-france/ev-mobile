import { Button, Icon, Text, View } from 'native-base';
import React, { createRef } from 'react';
import Modal from 'react-native-modal';
import computeFormStyleSheet from '../../FormStyles';
import BaseProps from '../../types/BaseProps';
import Utils from '../../utils/Utils';
import { ItemSelectionMode } from '../list/ItemsList';
import computeStyleSheet from './ModalStyles';
import I18n from 'i18n-js';
import SelectableList from '../../screens/base-screen/SelectableList';

export interface Props<T> extends BaseProps {
  defaultItem?: T;
  buildItemName: (item: T) => string;
  selectionMode: ItemSelectionMode;
  onItemsSelected: (selectedItems: T[]) => void;
}
interface State<T> {
  isVisible: boolean;
  selectedItems: T[];
  selectedItemsCount: number;
}

export default class ModalSelect<T> extends React.Component<Props<T>, State<T>> {
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
    const formStyle = computeFormStyleSheet();
    const { buildItemName, selectionMode, defaultItem } = this.props;
    const { isVisible, selectedItemsCount, selectedItems } = this.state;
    const itemsList = React.Children.only(this.props.children);
    return (
      <View>
        <Button block={true} style={formStyle.button} onPress={() => this.setState({ isVisible: true })}>
          <Text style={formStyle.buttonText} uppercase={false}>
            {buildItemName(defaultItem)} {selectedItemsCount > 1 && `(+${selectedItemsCount - 1})`}
          </Text>
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
                <Button style={style.button} block light onPress={() => this.clearSelection()}>
                  <Text style={style.buttonText}>{I18n.t('general.reset')}</Text>
                </Button>
                <Button
                  disabled={Utils.isEmptyArray(selectedItems)}
                  block
                  light
                  style={[style.button, !Utils.isEmptyArray(selectedItems) ? style.buttonEnabled : style.buttonDisabled]}
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
      this.setState({ selectedItems: [], isVisible: false, selectedItemsCount: selectedItems.length }, () => onItemsSelected(selectedItems)
      );
    }
  }

  private onItemSelected(selectedItems: T[]): void {
    const { selectionMode, onItemsSelected } = this.props;
    if (selectionMode === ItemSelectionMode.MULTI) {
      this.setState({ selectedItems });
    } else if (selectionMode === ItemSelectionMode.SINGLE && selectedItems && !Utils.isEmptyArray(selectedItems)) {
      this.setState({ selectedItems, isVisible: false }, () => onItemsSelected(selectedItems));
    }
  }
}
