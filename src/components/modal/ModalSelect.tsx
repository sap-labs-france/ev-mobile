import { Button, Icon, Text, View } from 'native-base';
import React from 'react';
import Modal from 'react-native-modal';
import computeFormStyleSheet from '../../FormStyles';
import BaseProps from '../../types/BaseProps';
import ListItem from '../../types/ListItem';
import Utils from '../../utils/Utils';
import { ItemSelectionMode } from '../list/ItemsList';
import Items from '../list/test/Items';
import computeStyleSheet from './ModalStyles';
import I18n from 'i18n-js';
import SelectableList from '../../screens/base-screen/SelectableList';

export interface Props<T> extends BaseProps {
  renderItemsList?: (onSelectCallback: (items: ListItem[]) => void, initiallySelectedItems: T[]) => Items<T>;
  defaultItem: T;
  buildItemName: (item: T) => string;
  selectionMode: ItemSelectionMode;
}
interface State<T> {
  isVisible: boolean;
  selectedItems: T[];
  canValidateMultiSelection: boolean;
}

export default class ModalSelect<T> extends React.Component<Props<T>, State<T>> {
  public state: State<T>;
  public props: Props<T>;
  private itemsListRef = React.createRef<SelectableList<T>>();
  public constructor(props: Props<T>) {
    super(props);
    this.state = {
      isVisible: false,
      selectedItems: [],
      canValidateMultiSelection: false
    };
  }

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const { buildItemName, selectionMode, defaultItem } = this.props;
    const { selectedItems, isVisible, canValidateMultiSelection } = this.state;
    const itemsList = React.Children.only(this.props.children);
    const otherSelectedItemsCount = Math.max(selectedItems?.length - 1, 0);
    const initializedSelectedItems = Utils.isEmptyArray(selectedItems) ? [defaultItem] : selectedItems;
    return (
      <View>
        <Button block={true} style={formStyle.button} onPress={() => this.setState({ isVisible: true })}>
          <Text style={formStyle.buttonText} uppercase={false}>
            {buildItemName(initializedSelectedItems?.[0])} {otherSelectedItemsCount > 0 && `(+${otherSelectedItemsCount})`}
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
                ref: (ref: React.RefObject<SelectableList<T>>) => (this.itemsListRef = ref)
              })}
            </View>
            {selectionMode === ItemSelectionMode.MULTI && (
              <View style={style.bottomButtonContainer}>
                <Button disabled={!canValidateMultiSelection} block light style={[style.buttonDisabled, canValidateMultiSelection && style.buttonEnabled]} onPress={() => this.validateSelection()}>
                  <Text style={style.buttonText}>{I18n.t('general.validate')}</Text>
                </Button>
              </View>
            )}
          </View>
        </Modal>
      </View>
    );
  }

  private validateSelection(): void {
    const selectedItems = this.itemsListRef?.state.selectedItems;
    this.setState({ selectedItems, isVisible: false, canValidateMultiSelection: false });
  }

  private onItemSelected(selectedItems: T[]) {
    const { selectionMode } = this.props;
    if (selectionMode === ItemSelectionMode.MULTI) {
      this.setState({ canValidateMultiSelection: selectedItems.length > 0 });
    } else if (selectedItems && !Utils.isEmptyArray(selectedItems) && this.props.selectionMode === ItemSelectionMode.SINGLE) {
      this.setState({ selectedItems, isVisible: false });
    }
  }
}
