import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Image,
  StatusBar,
  StyleSheet
} from 'react-native';

import { connect } from 'react-redux'
import AuthActions from '../../redux/AuthRedux'
import { Images, Colors, Fonts, ApplicationStyles } from '../../themes';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      launchFetched: false,
      imgSrc: '',
    };
  }

  componentDidMount() {
    this.selectSplashImage();
    this.props.getLaunchData();
  }

  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
    if (this.props.success && !this.props.error) {
      this.navigateToSpecificScreen()
    }
  }

  navigateToSpecificScreen = () => {
    const { user } = this.props
    if (user != null) {
      if (
        user.experience_id == null ||
        user.experience_id === 0
      ) {
        this.props.navigation.navigate('Explore');
      } else {
        this.props.navigation.navigate('Home');
      }
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  selectSplashImage = () => {
    const scrWidth = Dimensions.get('screen').width;
    const scrHeight = Dimensions.get('screen').height;

    console.log('srcWidth, srcHeight', scrWidth, scrHeight)
    if (scrWidth == 1125 && scrHeight == 2436) {
      this.setState({
        imgSrc: Images.logos.ip_xs
      })
    } else if (scrWidth == 1242 && scrHeight == 2688) {
      this.setState({
        imgSrc: Images.logos.ip_xs_max
      })
    } else if (scrWidth == 828 && scrHeight == 1792) {
      this.setState({
        imgSrc: Images.logos.ip_xr
      })
    } else if (scrWidth == 640 && scrHeight == 1136) {
      this.setState({
        imgSrc: Images.logos.ip_se
      })
    } else if (scrWidth == 750 && scrHeight == 1334) {
      this.setState({
        imgSrc: Images.logos.ip_8
      })
    } else if (scrWidth == 1242 && scrHeight == 2208) {
      this.setState({
        imgSrc: Images.logos.ip_8_plus
      })
    } else {
      this.setState({
        imgSrc: Images.logo
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor={Colors.darkPrimary}
          barStyle="light-content"
        />
        <Image style={styles.logo} source={this.state.imgSrc} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    ...ApplicationStyles.screen.wrapper,
  },
  logo: { width: '50%', height: '35%', resizeMode: 'contain' },
  title: {
    fontFamily: Fonts.type.base,
    fontSize: 20,
    color: Colors.purple
  }
});

const mapStateToProps = ({ startup, auth }) => ({
  user: auth.user,
  success: startup.success,
  error: startup.error
});

const mapDispatchToProps = (dispatch) => ({
  getLaunchData: () => dispatch(AuthActions.getLaunchDataRequest())
});

export default connect(mapStateToProps, mapDispatchToProps)(Welcome);
