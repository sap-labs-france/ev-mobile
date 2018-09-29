import { Toast } from "native-base";
import Constants from "./Constants";

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
    Toast.show({
      text: message,
      duration: Constants.TOAST_DURATION_MILLIS,
      type: type,
      position: "top",
      textStyle: Constants.TOAST_DEFAULT_STYLE
    });
  }
}