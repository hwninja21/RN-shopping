import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Colors, Fonts } from '../themes';


export default ({ label, value, onChangeText, required, before, style, ...otherProps }) => (
  <View style={updateProfileInputStyles.updateProfileInputContainer}>
    <Text style={updateProfileInputStyles.subtitle}>{ label }</Text>
    {
      required && (
        <Text style={updateProfileInputStyles.requiredAsterix}>{' '}*</Text>
      )
    }
    {
      before && before()
    }
    <TextInput
      style={{...updateProfileInputStyles.updateProfileInputComponentRight, ...style}}
      onChangeText={onChangeText}
      value={value}
      { ...otherProps }
    />
  </View>
);

export const updateProfileInputStyles = StyleSheet.create({
  updateProfileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 30,
    height: 50
  },
  updateProfileInputComponentRight: {
    textAlign: 'right',
    flex: 1,
    color: '#F08A46',
    fontSize: 16
  },
  subtitle: {
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.small,
    color: Colors.black
  },
  requiredAsterix: {
    color: 'red'
  }
});
