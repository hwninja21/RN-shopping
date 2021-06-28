import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { DEIMediumText } from '../../components';

const AccountItemView = (
  {
    title,
    isDisclosure = false,
    action,
    iconSrc,
    iconWidth,
    iconHeight,
    titleStyle,
    chevronSrc
  }
) => {


  return (
    <TouchableOpacity
      onPress={() => (isDisclosure ? action(title) : {})}
      style={styles.viewStyle}
    >
      <View style={{ flexDirection: 'row' }}>
        <View
          style={{
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Image
            source={iconSrc}
            style={{ width: iconWidth, height: iconHeight }}
          />
        </View>

        <DEIMediumText
          title={title}
          style={{ color: '#262628', fontSize: 14, marginLeft: 30, ...titleStyle }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        {isDisclosure && (
          <Image
            source={chevronSrc}
            style={{ width: 7, height: 14 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export const MyAccountSeparatorLine = ({ style }) => (
  <View
    style={{
      flex: 1,
      borderTopWidth: 1,
      borderColor: '#e1e1e1',
      ...style
    }}
  />
);

export const MyAccountSeparator = () => (
  <View style={{
    flex: 1,
    height: 10,
    backgroundColor: '#f9f9f9'
  }}/>
);

AccountItemView.defaultProps = {
  iconWidth: 18,
  iconHeight: 18,
  chevronSrc: require('../../assets/MyAccount/ic_chevron_right.png')
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 30,
    height: 50
  }
});
export { AccountItemView };
