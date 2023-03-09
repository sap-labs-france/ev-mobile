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
            <script src="https://www.google.com/recaptcha/api.js?render=SITEKEY"></script>
            <script>
                grecaptcha.ready(function() {
                    grecaptcha.execute('SITEKEY', {action: 'ACTION'}).then(function(token) {
                        window.ReactNativeWebView.postMessage(token);
                    });
                });
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

  public render() {
    const { onHandleToken, url, siteKey, action } = this.props;
    const recaptchaHtmlWithKey = recaptchaHtml.replace(/SITEKEY/g, siteKey).replace(/ACTION/g, action);
    return (
      <WebView
        originWhitelist={['*']}
        style={{ width: 0, height: 0, backgroundColor: 'transparent' }}
        startInLoadingState={false}
        javaScriptEnabled
        source={{ html: recaptchaHtmlWithKey, baseUrl: url }}
        onMessage={(event) => onHandleToken(event.nativeEvent.data)}
      />
    );
  }
}

export default ReactNativeRecaptchaV3;
