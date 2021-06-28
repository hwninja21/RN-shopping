import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

import {
  DEIRegularText,
  GradientBgView,
  DEIMediumText
} from '../../components';
import { SgTextField, CartButton } from '../../components/index';

import CartDateList from './CartDateList';

class AddDeliveryTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
      selectedIndex: 0,
      selectedDay: {},
      slots: []
    };
  }

  slotClicked = index => {
    this.setState({ selectedIndex: index });
  };

  getDateSlots = date => {
    const deliveryDate = this.props.dates.find(deliveryDate => deliveryDate.date === date);

    if (!deliveryDate) {
      return [];
    }

    return deliveryDate.slots.map(slot => ({ title: slot.display, id: slot.id }));
  };

  dateChanged = details => {
    console.log(details);
    this.setState({
      selectedDay: details,
      slots: this.getDateSlots(details.cartformat)
    });
  };

  saveClicked = () => {
    const { slots, selectedIndex, selectedDay } = this.state;
    console.log(slots[selectedIndex]);
    console.log(selectedDay);

    const selectedSlot = slots[selectedIndex].id;
    this.props.action({
      selectedDay: selectedDay,
      slot: slots[selectedIndex],
      delivery_timeslot: selectedSlot,
      delivery_date: selectedDay.cartformat
    });
  };

  getColor = (index, isBg) => {
    const { selectedIndex } = this.state;
    const isselected = selectedIndex == index;
    if (isBg) {
      return isselected ? '#FF8960' : '#F4F4F4';
    }
    return isselected ? '#fff' : '#000';
  };

  render() {
    const { viewStyle, itemViewStyle } = styles;
    const { slots, selectedIndex, visible } = this.state;

    return (
      <Modal animationType="fade" transparent={true} visible={visible}>
        <GradientBgView>
          <View style={viewStyle}>
            <CartDateList dates={this.props.dates.map(({ date }) => date)} action={this.dateChanged} />
            <DEIMediumText
              title={this.state.selectedDay.desc}
              style={{ color: '#FF8960', marginHorizontal: 20, marginTop: 10 }}
            />
            <FlatList
              style={{ marginTop: 10 }}
              data={slots}
              keyExtractor={item => item.id}
              extraData={this.state}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => this.slotClicked(index)}>
                  <View
                    style={[
                      itemViewStyle,
                      { backgroundColor: this.getColor(index, true) }
                    ]}
                  >
                    <DEIRegularText
                      title={item.title}
                      style={{
                        textAlign: 'left',
                        paddingLeft: 15,
                        color: this.getColor(index, false)
                      }}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={{ marginHorizontal: 20 }}>
              <CartButton title={'Save'} action={this.saveClicked} />
            </View>
          </View>
        </GradientBgView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    width: '80%',
    height: '50%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#fff'
  },
  itemViewStyle: {
    height: 49,
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 24,
    borderColor: 'transparent',
    borderWidth: 1
  }
});
export default AddDeliveryTime;
