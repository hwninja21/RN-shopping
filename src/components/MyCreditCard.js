import React from 'react';
import PropTypes from 'prop-types';
import colors from '../themes/Colors';
import { Image, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import { DEIRegularText } from './APIConstants';
import { MyAccountSeparatorLine } from '../screens/Account/MyAccountComponents';


const paddingHorizontal = 20;
const fontSizeNormal = 16;
const fontSizeSmall = fontSizeNormal - 2;

const brandLogos = {
  'Visa': require('../assets/MyAccount/visa.png'),
  'MasterCard': require('../assets/MyAccount/mastercard.png'),
  'JCB': require('../assets/MyAccount/jcb.png')
};

const MyCreditCard = props => {
  const { card, onPress } = props;

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Alert',
      'Are you sure you want to remove this card?',
      [
        {
          text: 'No',
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: () => {
            this.onCardDelete(card.id);
          }
        }
      ],
      { cancelable: true }
    );
  };

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper style={styles.container} onPress={ onPress ? () => onPress(card) : undefined }>
      <View style={styles.detailsContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={brandLogos[card.brand]}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
        <View style={{ flex: 1}}>
          <DEIRegularText
            title={card.description}
            style={{ color: 'black', fontSize: fontSizeNormal }}
          />

          <DEIRegularText
            title={`**** **** **** ${card.last4}`}
            style={{ color: 'black', fontSize: fontSizeSmall, marginTop: 10}}
          />

          <DEIRegularText
            title={`${card['exp_month']} / ${card['exp_year']}`}
            style={{ color: 'black', fontSize: fontSizeSmall, marginTop: 10}}
          />
        </View>
      </View>

      <MyAccountSeparatorLine style={{ marginTop: 15 }} />

      <View style={styles.actionsContainer}>
        <View>
          {/*{*/}
          {/*  card['is_default'] ? (*/}
          {/*    <DEIRegularText title=""/>*/}
          {/*  ) : (*/}
          {/*    <TouchableOpacity>*/}
          {/*      <DEIRegularText*/}
          {/*        title="Set as Default"*/}
          {/*        style={{ color: colors.orange }}*/}
          {/*      />*/}
          {/*      /!* TODO: add the logic for setting a card as default *!/*/}
          {/*    </TouchableOpacity>*/}
          {/*  )*/}
          {/*}*/}
        </View>
        <View style={{ flexDirection: 'row' }}>
          {
            props.displayRemoveButton && (
              <TouchableOpacity onPress={showDeleteConfirmation}>
                <DEIRegularText
                  title="Remove"
                  style={{ color: colors.orange }}
                />
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1'
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal
  },
  logoContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 40
  },
  actionsContainer: {
    paddingHorizontal: paddingHorizontal,
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between'
  }
});

MyCreditCard.defaultProps = {
  displayRemoveButton: true
};

MyCreditCard.propTypes = {
  card: PropTypes.object.isRequired,
  onCardDelete: PropTypes.func,
  displayRemoveButton: PropTypes.bool,
  onPress: PropTypes.func
};

export default MyCreditCard;
