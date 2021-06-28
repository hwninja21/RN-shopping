import React, { Component } from 'react';
import * as Sentry from '@sentry/react-native';
import PrimaryNavigation from './src/navigation/PrimaryNavigation';
import createStore from './src/redux'
import { Provider } from 'react-redux'

Sentry.init({
  dsn: 'https://f0b1c270d3c7470e93b0ecba9103af21@sentry.io/1871994',
});

// create our store
const store = createStore();

class App extends Component {
  state = {};
  render() {
    return <Provider store={store}>
      <PrimaryNavigation />
      </Provider>;
  }
}

export default App;
