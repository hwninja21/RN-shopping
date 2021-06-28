import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { DEIRegularText, PrimaryView } from '../../components';

class SelectedCardView extends Component {
  constructor(props) {
    super(props);
  }

  renderSelectedAddr = index => {
    const icon =
      this.props.selected == true
        ? require('../../assets/Cart/ic_addr_select.png')
        : require('../../assets/Cart/ic_addr_unselect.png');

    return (
      <TouchableOpacity
        onPress={() => this.props.selectedAction(this.props.selectedIndex)}
      >
        <Image
          source={icon}
          style={{
            width: 18,  
            height: 18,
            resizeMode: 'contain',
            marginRight: 20
          }}
        />
      </TouchableOpacity>
    );
  };

  componentWillReceiveProps = nextProps => {
    console.log(nextProps);
  };

  render() {
    console.log('this.props.cardInfo', this.props.cardInfo);

    const {
      description,
      last4,
      exp_month,
      exp_year,
    } = this.props.cardInfo;

    const textStyle = {
      color: '#B19CFD',
      fontSize: 13
    };

    return (
      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
        <View style={styles.rowViewStyle}>
          <View style={{ padding: 10 }}>
            <DEIRegularText
              title={description}
              style={textStyle}
            />
            <DEIRegularText title={`**** **** **** ${last4}`} style={textStyle} />
            <DEIRegularText title={`${exp_month} / ${exp_year}`} style={textStyle} />
          </View>
          {this.renderSelectedAddr()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowViewStyle: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});

export { SelectedCardView };
