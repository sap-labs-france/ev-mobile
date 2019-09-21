
declare module "react-native-recaptcha-v3" {
    import { Component } from "react";
    interface Props {
        onMessage?: () => void,
        containerStyle?: any;
        siteKey: string;
        url: string;
        action?: string;
        onReady?: () => void;
        onExecute?: (captcha: string) => void;
        customWebRecaptcha?: () => void;
        reCaptchaType: 1|2;
    }
    export default class  extends Component<Props> {
    }
}