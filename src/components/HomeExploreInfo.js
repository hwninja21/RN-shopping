import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, StyleSheet, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Colors, Fonts, Images } from '../themes';
import { StorageKeys } from '../config';
import _ from 'lodash';

class HomeExploreInfo extends Component {
  state = {
    experience: {
      explore_name: 'Little India',
      experience_name: 'Retail'
    }
  };

  componentDidMount() {
    this.searchExperience();
  }
  
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (prevProps.user != this.props.user)
      this.searchExperience();
  }

  searchExperience = async () => {
    const { experience_id } = this.props.user;
    const { explore } = this.props.launchData.Configuration;

    explore.map(exp => {
      exp.experience.map(item => {
        if (item.id == experience_id) {
          this.setState({
            experience: {
              explore_name: exp.name,
              experience_name: item.name
            }
          })
        }
      })
    })
  };

  render() {
    const { experience } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <TouchableOpacity
            style={styles.searchBarViewStyle}
            onPress={() =>
              this.props.navigation.navigate('Explore')
            }
          >
            <Image source={Images.home.explore} style={styles.exploreIcon} />
            <Text style={styles.title}>{experience.explore_name}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.item}>
          <Image source={Images.home.experience} style={styles.exploreIcon} />
          <Text style={styles.title}>{experience.experience_name}</Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ configuration, auth }) => ({
  home: configuration.home,
  user: auth.user || {},
  launchData: auth.launchData || {}
})

export default connect(mapStateToProps)(HomeExploreInfo);

const styles = StyleSheet.create({
  exploreIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginTop: 4, 
    marginRight: 5
  },
  container: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: Colors.headerTint,
    borderTopWidth: 0.5,
    borderColor: Colors.grey
  },
  verticalDivider: {
    width: 0.5,
    borderWidth: 0.5,
    borderColor: Colors.grey
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: Colors.black,
    fontFamily: Fonts.type.base
  },
  searchBarViewStyle: {
    flexDirection: 'row',
  }
});
