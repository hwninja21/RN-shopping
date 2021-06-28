import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import { ModalSelectList } from 'react-native-modal-select-list';
import { DEIRegularText } from './APIConstants';
import { Icon } from 'react-native-elements';
import { Colors } from '../themes';
import { StyleSheet, View } from 'react-native';



const DeiSelect = ({ render, label, ...props }) => {
  const modalRef = useRef(null);
  const [ selectedOption, setSelectedOption] = useState(null);

  const fullSelectedOption = selectedOption ?
    props.options.find(({ value }) => value === selectedOption) :
    props.options[0];


  const _render = () => {
    if (render) {
      return render(fullSelectedOption);
    }

    return (
      <View style={styles.variantSectionContainer}>
        <DEIRegularText title={label} style={styles.variantSectionTitle} />
        <Touchable style={styles.optionContainer} onPress={() => modalRef.current.show()}>
          <>
            <DEIRegularText title={fullSelectedOption.label}/>
            <Icon type='feather' name="chevron-down" color={Colors.primary}/>
          </>
        </Touchable>
      </View>
    )
  };

  const onSelectedOption = value => {
    setSelectedOption(value);
    if (props.onSelectedOption) {
      props.onSelectedOption(value);
    }
  };

  return (
    <>
      { _render() }
      <ModalSelectList
        ref={modalRef}
        closeButtonText="Close"
        disableTextSearch={true}
        { ...props }
        onSelectedOption={onSelectedOption}
      />
    </>
  );
};

DeiSelect.propTypes = {
  render: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.object,
  ...ModalSelectList.propTypes
};


const styles = StyleSheet.create({
  variantSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  variantSectionTitle: {
    width: 100
  },
  optionContainer: {
    flex: 1,
    padding: 5,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});

export default DeiSelect;
