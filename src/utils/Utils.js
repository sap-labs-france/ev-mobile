import Message from "./Message";
import I18n from "../I18n/I18n";
import validate from 'validate.js'

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

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static validateInput(screen, constraints) {
        let formValid = true;
        const errorState = {};
        // Reset all
        for (const key in screen.state) {
            if (screen.state.hasOwnProperty(key)) {
                // Error?
                if (key.startsWith("error")) {
                    // Clear
                    let clearError = {};
                    clearError[key] = null;
                    screen.setState(clearError);
                }
            }
        }
        // Check
        let error = validate(screen.state, constraints);
        // Check for Errors
        if (error) {
            // Set in state the errors
            for (const key in error) {
                if (error.hasOwnProperty(key)) {
                    // Set
                    errorState["error" + Utils.capitalizeFirstLetter(key)] = error[key];
                }
            }
            formValid = false;
        }
        // Set
        screen.setState(errorState);
        // Return
        return formValid;
    }
}