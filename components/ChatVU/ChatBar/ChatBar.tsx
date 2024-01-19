import React from 'react';
import {useStyles, createStyleSheet} from './styles';
import {View, Text, Image} from 'react-native';
import ellipse36 from './ellipse36.png';

export interface Frame98Props {
  testID?: string,
}

export function Frame98(props: Frame98Props) {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <View style={styles.root} testID={props.testID}>
      <View style={styles.rectangle405} testID="124:1046"/>
      <Text style={styles.chatVu} testID="124:1048">
        {`ChatVU`}
      </Text>
      <Image source={{uri: ellipse36}} style={{width: 57, height: 57}} resizeMode="cover"/>
      <Text style={styles.ab} testID="124:2522">
        {`AB`}
      </Text>
      <Component18 testID="131:3014"/>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  root: {
    width: 432,
    height: 85,
    borderWidth: 0,
    borderStyle: 'solid',
    shadowColor: 'rgba(0, 0, 0, 0.250980406999588)',
    shadowRadius: 4,
    shadowOffset: {"width":0,"height":4},
  },
  rectangle405: {
    width: 432,
    height: 85,
    flexShrink: 0,
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'rgba(245, 245, 245, 1)',
    shadowColor: 'rgba(0, 0, 0, 0.250980406999588)',
    shadowRadius: 12,
    shadowOffset: {"width":0,"height":0},
  },
  chatVu: {
    width: 148,
    height: 34,
    flexDirection: 'column',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'rgba(0, 0, 0, 1)',
    fontFamily: 'Roboto Slab',
    fontSize: 29,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.073,
  },
  ab: {
    width: 37,
    height: 31,
    flexShrink: 0,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
  },
}));

