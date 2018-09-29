import Message from "./Message";
import I18n from "../I18n/I18n";

export default class Utils {

    static handleHttpUnexpectedError(request) {
        switch (request.status) {
            // Backend not available
            case 0:
                Message.showError(I18n.t("general.cannotConnectBackend"));
                break;
            // Other errors
            default:
                Message.showError(I18n.t("general.unexpectedError"));
                break;
        }
    }
}
