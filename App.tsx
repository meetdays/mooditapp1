/**
 * @format
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, WebViewNavigation } from 'react-native-webview';
import BottomTabBar, { TAB_URLS, TabKey } from './components/bottom-tab/BottomTabBar';

const BASE_URL = 'https://moodit.ai.kr';
const HOME_URL = TAB_URLS.home;

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const [uri, setUri] = useState<string>(HOME_URL);
  const [isLoading, setIsLoading] = useState(true);
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeTab: TabKey = useMemo(() => {
    if (uri.includes('/feed')) return 'feed';
    if (uri.includes('/closet')) return 'closet';
    if (uri.includes('/me')) return 'me';
    if (uri.includes('/try')) return 'try';
    if (uri.includes('/home') || uri === BASE_URL || uri === `${BASE_URL}/`) {
      return 'home';
    }
    return 'home';
  }, [uri]);

  const navigateTo = (tab: TabKey) => {
    setUri(TAB_URLS[tab]);
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setUri(navState.url);
  };

  const handleShouldStartLoad = (request: WebViewNavigation) => {
    // Keep moodit domain links in-app, open external links in browser.
    if (request.url.startsWith(BASE_URL)) {
      return true;
    }
    Linking.openURL(request.url).catch(() => undefined);
    return false;
  };

  const webStackPx = useMemo(() => {
    const b = Math.max(insets.bottom, 8);
    return 90 + b + 8;
  }, [insets.bottom]);

  const bottomUiScript = useMemo(
    () => `(function(){try{
      var px='${webStackPx}px';
      document.documentElement.style.setProperty('--app-bottom-tab-stack', px, 'important');
      document.querySelectorAll('nav.fixed.inset-x-0.bottom-0.z-40').forEach(function(el){
        el.style.setProperty('display','none','important');
      });
    }catch(e){} true;})();`,
    [webStackPx],
  );

  const injectBottomUiFix = () => {
    webViewRef.current?.injectJavaScript(bottomUiScript);
  };

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.webViewShell}>
        <WebView
          ref={webViewRef}
          source={{ uri }}
          injectedJavaScriptBeforeContentLoaded={bottomUiScript}
          onLoadStart={() => {
            setIsLoading(true);
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
            }
            // Fallback: hide spinner even if WebView misses load end events.
            loadingTimeoutRef.current = setTimeout(() => setIsLoading(false), 8000);
          }}
          onLoadProgress={({ nativeEvent }) => {
            if (nativeEvent.progress >= 0.9) {
              setIsLoading(false);
            }
          }}
          onLoadEnd={() => {
            setIsLoading(false);
            injectBottomUiFix();
            setTimeout(injectBottomUiFix, 250);
          }}
          onError={() => setIsLoading(false)}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          style={styles.webView}
        />
      </View>
      {isLoading ? (
        <View style={styles.loaderOverlay} pointerEvents="none">
          <ActivityIndicator size="small" color="#ff6a3d" />
        </View>
      ) : null}
      <BottomTabBar activeTab={activeTab} onTabPress={navigateTo} />
    </SafeAreaView>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webViewShell: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webView: {
    flex: 1,
  },
  loaderOverlay: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
