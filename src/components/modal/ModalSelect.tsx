import I18n from 'i18n-js';
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

export interface Props<T> extends BaseProps {
  renderItemsList: (onSelectCallback: (items: ListItem[]) => void, initiallySelectedItems: T[]) => Items<T>;
  defaultItem: T;
  buildItemName: (item: T) => string;
  selectionMode: ItemSelectionMode;
}
interface State<T> {
  isVisible: boolean;
  selectedItems: T[];
}

export default class ModalSelect<T> extends React.Component<Props<T>, State<T>> {
  public state: State<T>;
  public props: Props<T>;
  public constructor(props: Props<T>) {
    super(props);
    this.state = {
      isVisible: false,
      selectedItems: []
    };
  }

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const { renderItemsList, buildItemName, defaultItem } = this.props;
    const { selectedItems } = this.state;
    const selectedItemsInitialized = Utils.isEmptyArray(selectedItems) ? [defaultItem] : selectedItems;
    return (
      <View>
        <Button block={true} style={formStyle.button} onPress={() => this.setState({ isVisible: true })}>
          <Text style={formStyle.buttonText} uppercase={false}>
            {buildItemName(selectedItemsInitialized[0])}
          </Text>
        </Button>
        <Modal
          propagateSwipe={true}
          supportedOrientations={['portrait', 'landscape']}
          style={style.modal}
          isVisible={this.state.isVisible}
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
              <Text style={style.modalTitle}>{I18n.t('users.selectUser')}</Text>
            </View>
            <View style={style.listContainer}>{renderItemsList(this.onItemSelected.bind(this), selectedItemsInitialized)}</View>
          </View>
        </Modal>
      </View>
    );
  }

  private onItemSelected(selectedItems: T[]) {
    if (selectedItems && !Utils.isEmptyArray(selectedItems)) {
      this.setState({ selectedItems, isVisible: this.props.selectionMode !== ItemSelectionMode.SINGLE });
    }
  }
}
