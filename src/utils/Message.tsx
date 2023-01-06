import { Platform } from 'react-native';
import Toast from 'react-native-root-toast';
import { scale } from 'react-native-size-matters';

import Utils from './Utils';

export default class Message {
  public static showError(message: string): void {
    Message.show(message, 'danger');
  }

  public static showWarning(message: string): void {
    Message.show(message, 'warning');
  }

  public static showSuccess(message: string): void {
    Message.show(message, 'success');
  }

  private static show(message: string, type: 'danger' | 'success' | 'warning'): void {
    const commonColor = Utils.getCurrentCommonColor();
    Toast.show(message, {
      shadow: false,
      animation: true,
      hideOnPress: true,
      duration: Toast.durations.LONG,
      opacity: 1,
      position: Toast.positions.TOP + (Platform.OS === 'ios' ? 20 : 0),
      textColor: '#FFF',
      textStyle: {
        fontSize: scale(15),
        textAlign: 'center'
      },
      backgroundColor: commonColor[type]
    });
  }
}
