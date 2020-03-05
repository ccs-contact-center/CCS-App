import React from 'react'
import { Util, SecureStore } from 'expo';
import { StyleSheet, View, StatusBar } from 'react-native'
import {
  Provider as PaperProvider,
  DarkTheme,
  DefaultTheme,
  Theme,
} from 'react-native-paper';
import { AppRegistry } from 'react-native';
import AppNavigation from '../src/Navigation/AppNavigation'
import { Provider } from 'react-redux'
import { store, persistor } from '../src/Redux/store';
import { PersistGate } from 'redux-persist/lib/integration/react';

//const store = configureStore()

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3F3F3F',
    accent: '#C00327'

  }
};





export default class App extends React.Component {



  render() {
    return (
        <Provider store = { store }>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider theme={theme}>
                <AppNavigation/>
            </PaperProvider>
          </PersistGate>
        </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})
