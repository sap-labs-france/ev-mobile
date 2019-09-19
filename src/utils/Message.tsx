// import { Toast } from "native-base";
// import { scale } from "react-native-size-matters";

export default class Message {
  public static showError(message: string) {
    Message._show(message, "danger");
  }

  public static showWarning(message: string) {
    Message._show(message, "warning");
  }

  public static showInfo(message: string) {
    Message._show(message, "success");
  }

  public static showSuccess(message: string) {
    Message._show(message, "success");
  }

  private static _show(message: string, type: "danger" | "success" | "warning") {
    Toast.show({
      text: message,
      textStyle: {
        fontSize: scale(15),
        color: "white",
        textAlign: "center"
      },
      duration: 3000,
      type,
      position: "top"
    });
  }
}
