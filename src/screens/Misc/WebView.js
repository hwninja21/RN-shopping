import React from 'react';
import { WebView } from 'react-native';
import { getNavigationOptions } from '../../services/Helpers';


export default class extends React.Component {
  static navigationOptions = getNavigationOptions();

  render() {
    const source = this.props.navigation.getParam('source');

    return <WebView source={source} />
  }
}
