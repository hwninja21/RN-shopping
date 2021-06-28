import { Colors, Fonts } from '../themes';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React, { Component } from 'react';

const scrWidth = Dimensions.get('screen').width;
const QuantityWidth = scrWidth / 3 - 25;

const QButton = ({ title, action, color }) => {
  return (
    <TouchableOpacity
      onPress={action}
      style={{
        width: 20,
        height: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 0.2,
        borderColor: '#E9E9E9'
      }}
    >
      <Text style={{ textAlign: 'center', color: color, fontWeight: 'bold' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

class STQuantityView extends Component {
  constructor(props) {
    super(props);
    var currentQuantity = 0;
    if (props.item != null && props.item.quantity > 0) {
      currentQuantity = props.item.quantity;
    }
    var isHaveOptions = false;
    if (Array.isArray(props.item.options) && props.item.options.length > 0) {
      isHaveOptions = true;
    }
    this.state = {
      quantity: currentQuantity,
      item: props.item,
      hasOptions: isHaveOptions,
      hasVarients: props.isVarientSelected
    };

    this.addClicked = this.addClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.quantity != this.props.item.quantity) {
      this.setState({
        quantity: nextProps.item.quantity,
        item: nextProps.item
      });
    }
    if (nextProps.isVarientSelected != this.props.isVarientSelected) {
      this.setState({
        hasVarients: nextProps.isVarientSelected
      });
    }
  }

  addClicked() {
    if (this.getHasMultipleOptions() && !this.props.isDetail) {
      this.props.action();
      return;
    }
    this.setState({
      quantity: 1,
      item: {
        ...this.state.item,
        quantity: 1
      }
    }, () => {
      this.props.quantityChanged(this.state.item)
    });

  }

  quantityClicked = isAdd => {
    var currentQuantity = this.state.quantity;
    if (isAdd) {
      currentQuantity += 1;
    } else {
      currentQuantity -= 1;
    }
    this.setState({
      quantity: currentQuantity,
      item: {
        ...this.state.item,
        quantity: currentQuantity
      }
    }, () => {
      this.props.quantityChanged(this.state.item);
    });


  };

  renderQuantityAddedView = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: QuantityWidth,
          justifyContent: 'space-evenly',
          paddingHorizontal: 10
        }}
      >
        <QButton
          title={'-'}
          action={() => this.quantityClicked(false)}
          color={Colors.primary}
        />
        <Text
          style={{
            color: '#fff',
            fontWeight: 'bold',
            flex: 1,
            textAlign: 'center',
            fontFamily: Fonts.type.base
          }}
        >
          {this.state.quantity}
        </Text>
        <QButton
          title={'+'}
          action={() => this.quantityClicked(true)}
          color={Colors.primary}
        />
      </View>
    );
  };

  renderAddButton = () => {
    var marginValue = this.props.isDetail || !this.state.hasOptions ? 10 : 0;

    const hasMultipleOptions = this.getHasMultipleOptions();

    return (
      <TouchableOpacity
        onPress={this.addClicked}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            color: Colors.white,
            fontWeight: 'bold',
            fontFamily: Fonts.type.base,
            marginLeft: marginValue
          }}
        >
          {hasMultipleOptions && !this.props.isDetail ? 'OPTIONS' : 'ADD'}
        </Text>
        {(this.props.isDetail || !hasMultipleOptions) && (
          <QButton title={'+'} action={this.addClicked} color={'#E9E9E9'} />
        )}
      </TouchableOpacity>
    );
  };

  getHasMultipleOptions = () => {
    const productOptions = this.props.item['product_options'];
    return productOptions && productOptions.length && productOptions.length > 1;
  };

  render() {
    const showAddButton = !this.state.quantity || (this.state.hasOptions && !this.props.isDetail);
    const backgroundColor = !this.state.quantity ? Colors.accent : Colors.primary;

    return (
      <View
        style={{
          height: 30,
          width: QuantityWidth,
          justifyContent: 'center',
          borderRadius: 15,
          backgroundColor: backgroundColor
        }}
      >
        { showAddButton ? this.renderAddButton() : this.renderQuantityAddedView() }
      </View>
    );
  }
}

export { STQuantityView };
