import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import moment from 'moment';
import { DEIRegularText, DEIMediumText } from '../../components';

class CartDateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: [],
      selectedDateIndex: 0
    };
  }

  componentDidMount() {
    const dates = this.convertDates();
    this.setState({ dates });
    this.props.action(dates[0]);
  }

  convertDates() {
    const names = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    return this.props.dates.map(cartformat => {
      const date = moment(cartformat, 'YYYY-MM-DD').toDate();

      return {
        date: date.getDate(),
        day: names[date.getDay()],
        desc: moment(date).format('DD, ddd MMM YYYY'),
        cartformat,
      }
    })
  }

  textColor = index => {
    return index == this.state.selectedDateIndex ? '#FF8960' : '#D5D5D5';
  };

  dateClicked = index => {
    this.setState({ selectedDateIndex: index });
    this.props.action(this.state.dates[index]);
  };

  render() {
    return (
      <View>
        <View>
          <DEIRegularText
            title={'Select date & time'}
            style={styles.dateTextStyle}
          />

          <FlatList
            horizontal
            data={this.state.dates}
            extraData={this.state}
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.desc}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => this.dateClicked(index)}>
                <View style={styles.dateViewStyle}>
                  <DEIMediumText
                    title={item.day.toUpperCase()}
                    style={{ color: this.textColor(index) }}
                  />
                  <DEIMediumText
                    title={item.date}
                    style={{ color: this.textColor(index), fontSize: 10 }}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dateViewStyle: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dateTextStyle: {
    textAlign: 'center',
    marginTop: 10,
    color: '#B19CFD',
    marginBottom: 10
  }
});

export default CartDateList;
