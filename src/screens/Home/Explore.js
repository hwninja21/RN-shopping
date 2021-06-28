import React, { Component } from 'react';
import { isNetworkConnected } from '../../components';
import Axios from 'axios';
import Touchable from 'react-native-platform-touchable';
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import ConfigurationAction from '../../redux/ConfigurationRedux';
import AuthActions from '../../redux/AuthRedux';
import { DEIRegularText } from '../../components';
import { SafeAreaView } from 'react-navigation';
import { Colors, Fonts } from '../../themes';
import { Icon } from 'react-native-elements';
import { api } from '../../sagas';

const screenWidth = Dimensions.get('window').width;
const itemHeight = 200;
const borderRadius = 20;

const MODE = {
  explore: 'explore',
  experience: 'exprience'
};

class Explore extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    explore: [],
    experience: [],
    mode: MODE.explore,
    isLoading: false
  };

  componentDidMount() {
    // this.fetchExplore();
    this.setState({ explore: this.props.launchData.Configuration.explore})
  }

  // fetchExplore = async () => {
  //   let configuration = await AsyncStorage.getItem(StorageKeys.Configuration);
  //   configuration = JSON.parse(configuration);
  //   this.setState({
  //     explore: configuration.explore
  //   });
  // };

  openExperiences = item => {
    if (item.experience.length == 1) {
      this.updateUserExperience(item.experience[0].id)
    } else {
      this.setState({
        mode: MODE.experience,
        experience: item.experience
      });
    }
  };

  updateUserExperience = experience_id => {
    isNetworkConnected().then(isConnected => {
      if (isConnected) {
        this.setState({ isLoading: true });
        const body = {
          experience_id
        };
        api.configCustomer(body)
        .then(res => {
          if (res.ok && res.data) {
            this.props.resetConfiguration();
            this.props.resetExperienceID(res.data.User);
            this.props.setConfiguration(res.data);
            this.props.navigation.navigate('Home');
          } else {
            alert('Error, please try again later');
          }
        })
        .catch(() => {
          alert('Error, please try again later');
        });
      } else {
        alert('not connected to network');
      }
    });
  };

  renderItem = ({ item }) => {
    return (
      <Touchable
        onPress={() => {
          if (this.state.mode === MODE.explore) {
            this.openExperiences(item);
          } else {
            // TODO: Update user config
            this.updateUserExperience(item.id);
          }
        }}
      >
        <View style={styles.itemContainer}>
          <Image
            source={{ uri: item.image_url }}
            imageStyle={{ borderRadius: 20 }}
            resizeMode={'cover'}
            style={styles.imageBackground}
          />

          <DEIRegularText title={item.name} style={styles.title} />
        </View>
      </Touchable>
    );
  };
  render() {
    const { isLoading, explore, experience, mode } = this.state;

    const exploreTitle = (
      <Text style={styles.sectionTitle}>
        Where would you {`\n`}
        like to <Text style={{ fontWeight: 'bold' }}>Explore</Text> today?
      </Text>
    );
    const experienceTitle = (
      <Text style={styles.sectionTitle}>
        What Would You {`\n`}
        Like to <Text style={{ fontWeight: 'bold' }}>Experience?</Text>
      </Text>
    );
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          ListHeaderComponent={
            <View style={styles.sectionContainer}>
              <TouchableOpacity
                onPress={() => { this.props.navigation.goBack() }}
                style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}
              >
                <Icon name="cross" type="entypo" color="white" />
              </TouchableOpacity>
              {mode === MODE.explore ? exploreTitle : experienceTitle}
              <Text style={styles.sectionSubtitle}>
                We are happy to provide one-stop solution to your non-stop requirements on{' '}
                goods, services and products!{' '}
                Choose where you would like to shop now.
              </Text>
              {isLoading && (
                <ActivityIndicator style={styles.activityIndicator} />
              )}
            </View>
          }
          data={mode === MODE.explore ? explore : experience}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => `explore_${index}`}
          numColumns={2}
          horizontal={false}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
    margin: 10
  },
  sectionContainer: {
    padding: 20,
    paddingBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#63274A',
    marginBottom: 50,
    borderBottomWidth: 10,
    borderBottomColor: '#4E1B38'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 25,
    fontFamily: Fonts.type.medium,
    color: 'white'
  },
  sectionSubtitle: {
    paddingHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
    fontSize: 15,
    fontFamily: Fonts.type.base,
    color: 'white'
  },
  itemContainer: {
    marginBottom: 10,
    minHeight: itemHeight,
    marginHorizontal: 20,
  },
  imageBackground: {
    width: (screenWidth / 2) - 40,
    height: (screenWidth / 2) - 40,
    marginBottom: 10,
    zIndex: 0
  },
  titleContainer: {
    position: 'absolute',
    left: 5,
    bottom: 5,
    zIndex: 20,
    width: screenWidth / 1.2
  },
  title: {
    color: Colors.orange,
    fontSize: 18,
    fontFamily: Fonts.type.medium,
    textAlign: 'center'
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    borderRadius: borderRadius,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});

const mapStateToProps = ({ auth }) => ({
  launchData: auth.launchData
})

const mapDispatchToProps = (dispatch) => ({
  resetConfiguration: () => dispatch(ConfigurationAction.resetConfiguration()),
  setConfiguration: (data) => dispatch(ConfigurationAction.setConfiguration(data)),
  resetExperienceID: (data) => dispatch(AuthActions.resetExperienceID(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Explore);
