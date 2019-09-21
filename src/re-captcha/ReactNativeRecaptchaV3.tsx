import React, { PureComponent } from 'react';
import { WebView } from 'react-native-webview';

const recaptchaHtml = `
    <!DOCTYPE html>
    <html>
        <head>
            <style>
                body {
                    display: flex;
                    justify-content: left;
                    align-items: top;
                }
            </style>
        </head>
        <body>
            <div id="inline-badge"></div>
            <script src="https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoadCallback"></script>
            <script>
                function onRecaptchaLoadCallback() {
                var clientId = grecaptcha.render('inline-badge', {
                    'sitekey': '[SITEKEY]',
                    'badge': 'inline',
                    'size': 'invisible'
                });

                grecaptcha.ready(function () {
                    grecaptcha.execute(clientId, {
                        action: '[ACTION]'
                    })
                    .then(function (token) {
                        window.ReactNativeWebView.postMessage(token, '*')
                    });
                });
                }
            </script>
        </body>
    </html>
`;

interface Props {
    url: string;
    siteKey: string;
    action: string;
    onHandleToken?: (token: string) => void;
}

class ReactNativeRecaptchaV3 extends PureComponent<Props> {
    public static defaultProps = {
        leftActionIconType: "MaterialIcons",
        rightActionIconType: "MaterialIcons",
        showSearchAction: false
    };
      
    public render() {
        const { onHandleToken, url, siteKey, action } = this.props;
        const recaptchaHtmlWithKey = recaptchaHtml.replace('[SITEKEY]', siteKey).replace('[ACTION]', action);
        return (
            <WebView
                originWhitelist={['*']}
                style={{ width: 0, height: 0 }}
                startInLoadingState={false}
                javaScriptEnabled={true}
                source={{ html: recaptchaHtmlWithKey, baseUrl: url }}
                onMessage={event => onHandleToken(event.nativeEvent.data)}
            />
        );
    }
}

export default ReactNativeRecaptchaV3;