import { Toast } from "native-base";
import { ScaledSheet } from "react-native-size-matters";

export default class Message {
  static showError(message) {
    // Show
    Message._show(message, "danger");
  }

  static showWarning(message) {
    // Show
    Message._show(message, "warning");
  }

  static showInfo(message) {
    // Show
    Message._show(message, "success");
  }

  static showSuccess(message) {
    // Show
    Message._show(message, "success");
  }

  static _show(message, type) {
    // Show
    Toast.show(
      ScaledSheet.create({
        text: message,
        textStyle: {
          fontSize: "15@s",
          color: "white",
          textAlign: "center"
        },
        duration: 3000,
        type,
        position: "top"
      })
    );
  }
}
