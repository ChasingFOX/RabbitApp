// React Native Entry Point Code

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

function App() {
  // Code to hide the splash screen when the application is loaded
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
