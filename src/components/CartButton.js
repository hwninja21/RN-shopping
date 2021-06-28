import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { DEIBoldText } from './APIConstants';
import colors from '../themes/Colors';

class CartButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { title, viewStyle } = this.props;
    return (
      <ImageBackground
        style={[{ width: '100%', height: 100 }, viewStyle]}
        imageStyle={{ resizeMode: 'contain' }}
      >
        <TouchableOpacity onPress={() => this.props.action()}>
          <View style={styles.viewStyle}>
            <DEIBoldText
              title={title}
              style={{ fontSize: 16, color: '#fff' }}
            />
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange,
    marginTop: 15,
    borderRadius: 25,
  }
});
export { CartButton };
