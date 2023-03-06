/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import LoadingIndicator from './LoadingIndicator';

const LEAFLET_HTML_SOURCE = Platform.select({
  ios: require('../android/app/src/main/assets/index.html'),
  android: {uri: 'file:///android_asset/index.html'},
});

function App(): JSX.Element {
  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      const data = event?.nativeEvent?.data;
      if (!data) {
        return;
      }
      const message = JSON.parse(data);
      console.log(`received: ${JSON.stringify(message)}`);
    },
    []
  );

  return (
    <SafeAreaView style={{flex:1}}>
      <WebView
        containerStyle={styles.container}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        domStorageEnabled={true}
        startInLoadingState={true}

        originWhitelist={['*']}
        renderLoading={() => <LoadingIndicator/>}
        source={LEAFLET_HTML_SOURCE}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        androidHardwareAccelerationDisabled={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    // ...StyleSheet.absoluteFillObject,
  },
});

export default App;
